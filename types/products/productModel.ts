import { CurrencyType } from './currencyModel';

export interface ProductModel {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: CurrencyType;
  image: string;
  quantity: number;
  percentage: number;
  onSale: boolean;
  isPublic: boolean;
}
