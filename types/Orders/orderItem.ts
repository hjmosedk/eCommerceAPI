import { OrderModel } from './orderModel';
import { ProductModel } from '../products/productModel';

export interface OrderItemModel {
  id: number;
  productId: number;
  salesQuantity: number;
  price: number;
  order?: OrderModel;
  product: ProductModel;
}
