import { StoreInterface } from "../store/store.interface";

export interface ProductInterface {
  id: string;
  name: string;
  cost: number;
  quantity: number;
  storeId: string;
  store?: StoreInterface;
  selectedQuantity?: number;
  totalCost?: number;
}
