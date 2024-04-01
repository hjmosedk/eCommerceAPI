import { ecommerce } from 'ckh-typings';

const isOrderStatus = (value: any): value is ecommerce.OrderStatus => {
  return Object.values(ecommerce.OrderStatus).includes(value);
};

export default {
  isOrderStatus,
};
