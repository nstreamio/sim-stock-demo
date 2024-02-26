export interface TableProps {
  search: string;
}

export type PriceChangeState = "falling" | "rising" | null | undefined;

export type Cusip = {
  key: string;
  price: number;
  volume?: number;
  movement?: number;
  timestamp: number;
  state: PriceChangeState;
};

// for use determining correct row style to apply
export type CusipMeta = {
  timer: NodeJS.Timeout | null;
  prevDisplayedPrice?: number;
  priceLastUpdated?: number;
}
