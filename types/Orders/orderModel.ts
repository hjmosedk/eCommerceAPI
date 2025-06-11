import { OrderStatus } from './orderStatus';
import { CustomerModel } from '../Customer/customerModel';
import { OrderItemModel } from './orderItem';
import { CurrencyType } from '../products/currencyModel';

export interface OrderModel {
  id: number;
  orderItems?: OrderItemModel[];
  orderDate: Date;
  lastChange: Date;
  customer: CustomerModel;
  orderStatus: OrderStatus;
  orderNotes: string;
  orderTotalPrice: number;
  orderCurrency: CurrencyType;
  paymentStatus: string;
  paymentId: string;
}
