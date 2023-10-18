import { OrderStatus } from '../entities/order.entity';

const isOrderStatus = (value: any): value is OrderStatus => {
  return Object.values(OrderStatus).includes(value);
};

export default {
  isOrderStatus,
};
