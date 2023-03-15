import { CustomerInterface } from "../customer/customer.interface";
import { ProductInterface } from "../product/product.interface";

export interface ReceiptInterface {
  id: string;
  name: string;
  customerId: string;
  totalCost: number;
  dateCreated: string;
  dateUpdated?: string;
  productIds: string[];
  products?: ProductInterface[];
  customer?: CustomerInterface;
 }
