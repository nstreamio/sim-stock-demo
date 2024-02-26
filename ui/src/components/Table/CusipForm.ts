import { Form, Item } from "@swim/structure";
import { Cusip } from "./Table.types";

export class CusipForm extends Form<Cusip | undefined> {
  constructor() {
    super();
  }

  // Item to JS object
  override cast(item: Item): Cusip | undefined {
    if (
      item.isDefinite() &&
      item.getAttr("update").get("key").toString() &&
      item.get("timestamp").isDefinite() &&
      item.get("price").isDefinite() &&
      item.get("volume").isDefinite() &&
      item.get("movement").isDefinite()
    ) {
      return {
        key: item.getAttr("update").get("key").toString(),
        price: item.get("price").numberValue(0),
        volume: item.get("volume").numberValue(),
        movement: item.get("movement").numberValue(),
        timestamp: item.get("timestamp").numberValue(0),
        state: null,
      };
    }

    return undefined;
  }

  // JS object to Item
  override mold(object: Cusip, item?: Item): Item {
    let result = Item.fromLike(object);
    if (item !== void 0) {
      result = item.concat(object);
    }
    return result;
  }
}
