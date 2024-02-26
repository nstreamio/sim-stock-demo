import { FC, useCallback, useEffect, useRef, useState } from "react";
import { WarpClient } from "@swim/client";
import { AgGridReact } from "ag-grid-react";
import { CellStyle, ColDef, GridOptions, RowStyle } from "ag-grid-community";
import { TableProps, Cusip, PriceChangeState, CusipMeta } from "./Table.types";
import { numValueFormatter } from "../../lib/helpers/numFormatting";
import { CusipForm } from "./CusipForm";
import "ag-grid-community/styles/ag-grid.css";

const NEW_CUSIP_METADATA: CusipMeta = { timer: null, priceLastUpdated: 0, prevDisplayedPrice: 0 };
const UPDATED_ROW_STYLE_DURATION_MS = 2000;
const MAX_UI_REFRESH_INTERVAL_MS = 16; // ~60/sec

const getRowStyle: GridOptions<Cusip>["getRowStyle"] = (params) => {
  const styles: RowStyle = {
    backgroundColor: params.rowIndex % 2 === 0 ? "var(--app-background)" : "var(--row-background-secondary)",
  };
  if (params?.data?.state != null) {
    styles.color = params.data.state === "falling" ? "var(--red-alert)" : "var(--green-alert)";
  }
  return styles;
};

const cellStyle: CellStyle = {
  height: "100%",
  display: "flex ",
  justifyContent: "center",
  alignItems: "center ",
};
const headerClass = "text-center text-white/50 text-sm";
const COLUMN_DEFS: ColDef[] = [
  { field: "key", cellStyle, headerClass },
  { field: "price", valueFormatter: numValueFormatter, cellStyle, headerClass, getQuickFilterText: () => '' },
  { field: "volume", valueFormatter: numValueFormatter, cellStyle, headerClass, getQuickFilterText: () => '' },
  { field: "movement", valueFormatter: numValueFormatter, cellStyle, headerClass, getQuickFilterText: () => '' },
];

export const Table: FC<TableProps> = (props) => {
  const { search } = props;

  /* Row data for passing to AGGridReact element; derived from cusipsRef
     Updates to this value trigger a rerender */
  const [rowData, setRowData] = useState<Cusip[]>([]);
  // Cusip data for display in table; updates to this value do not trigger rerenders
  const cusipsRef = useRef<Record<string, Cusip>>({});
  // Cusip metadata to help with styling; updates to this value do not trigger rerenders
  const cusipsMetaRef = useRef<Record<string, CusipMeta>>({});

  // Flag representing whether cusipsRef contains more up-to-date data than what is being displayed in the UI
  const needsRerenderRef = useRef<boolean>(false);
  const lastRowDataUpdatedAt = useRef<number>(0);
  const setRowDataIntervalRef = useRef<NodeJS.Timeout | null>(null); // used for cleanup

  // callback which handles individual Cusip updates
  const didSet: (newValue: Cusip | undefined) => void = useCallback(
    (cusip) => {
      // handle invalid message
      if (!cusip?.key) {
        return;
      }

      let state: PriceChangeState = null;

      if (cusipsRef.current[cusip.key]) {
        const newCusipMeta: CusipMeta = cusipsMetaRef.current[cusip.key] ?? { ...NEW_CUSIP_METADATA };
        // if present, cancel existing timeout for resetting row styles
        if (newCusipMeta.timer != null) {
          clearTimeout(newCusipMeta.timer);
          newCusipMeta.timer = null;
        }

        /* Ensure correct price is being used for determining direction of price change. Must use last
           *displayed* price since we're batching updates, instead of simply last price on record */
        if (newCusipMeta.priceLastUpdated! < lastRowDataUpdatedAt.current) {
          newCusipMeta.prevDisplayedPrice = cusipsRef.current[cusip.key].price;
        }

        // determine direction of price change, if any
        if (cusip.price && newCusipMeta.prevDisplayedPrice) {
          if (cusip.price > newCusipMeta.prevDisplayedPrice) {
            state = "rising";
          } else if (cusip.price < newCusipMeta.prevDisplayedPrice) {
            state = "falling";
          }
        }

        // define callback for resetting row styles
        const resetRowStyle = () => {
          cusipsRef.current[cusip.key] = {
            ...cusipsRef.current[cusip.key],
            state: null,
          }
          cusipsMetaRef.current[cusip.key].timer = null;
        };

        // clear row styles after a delay; set cusip metadata
        newCusipMeta.timer = setTimeout(resetRowStyle, UPDATED_ROW_STYLE_DURATION_MS);
        newCusipMeta.priceLastUpdated = cusip.timestamp;
        cusipsMetaRef.current[cusip.key] = newCusipMeta;
      }


      // Update data for this cusip key in cusipsRef. This will not trigger a rerender.
      cusipsRef.current[cusip.key] = {
        ...cusip,
        state,
      };
      // alert component that new cusip data has been received
      needsRerenderRef.current = true;
    },
    []
  );

  // Periodically update rowData with the more up-to-date data in cusipsRef. Will trigger a rerender.
  useEffect(() => {
    setRowDataIntervalRef.current = setInterval(() => {
      if (needsRerenderRef.current && cusipsRef.current) {
        needsRerenderRef.current = false;
        lastRowDataUpdatedAt.current = Date.now();
        setRowData(Object.values(cusipsRef.current));
      }
    }, MAX_UI_REFRESH_INTERVAL_MS);

    return (() => {
      // cleanup
      if (setRowDataIntervalRef.current) {
        clearInterval(setRowDataIntervalRef.current);
      }
    })
  }, []);

  useEffect(() => {
    const client = new WarpClient();

    const downlink = client.downlinkValue<Cusip | undefined>({
      hostUri: "warp://localhost:9001",
      nodeUri: "/symbols",
      laneUri: "stocks",
      valueForm: new CusipForm(), // coerces content of WARP message to strongly-typed JS object
      didSet: didSet,
    })
    .open();

    return () => {
      if (downlink) {
        downlink.close();
      }
    };
  }, [didSet]);

  return (
    <div className="h-full px-4 lg:px-8 justify-center">
      <AgGridReact
        rowData={rowData}
        rowHeight={44}
        getRowStyle={getRowStyle}
        columnDefs={COLUMN_DEFS}
        getRowId={(params) => params.data.key}
        deltaSort
        quickFilterText={search}
        autoSizeStrategy={{
          type: "fitGridWidth",
          defaultMinWidth: 80,
          columnLimits: [
            {
              colId: "key",
              maxWidth: 160,
            },
          ],
        }}
      />
    </div>
  );
};
