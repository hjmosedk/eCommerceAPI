import { Ecommerce } from 'ckh-typings';

const isOrderStatus = (value: any): value is Ecommerce.OrderStatus => {
  return Object.values(Ecommerce.OrderStatus).includes(value);
};

export default {
  isOrderStatus,
};
