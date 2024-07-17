import { Ecommerce } from 'ckh-typings';
import { systemNotification } from './entities/systemNotification.entity';

type notificationSeedingData = Omit<systemNotification, 'id'>;
export const systemNotificationMessage: notificationSeedingData[] = [
  {
    title: `${Ecommerce.OrderStatus.RECEIVED}`,
    content:
      'You will put the order into received, this will reserve the order on the customers account - This is the default status',
  },
  {
    title: `${Ecommerce.OrderStatus.RESERVED}`,
    content:
      'This will place a backorder into the system - You are sill required to fulfill the order',
  },
  {
    title: `${Ecommerce.OrderStatus.CONFIRMED}`,
    content:
      'You will confirm the order and commit to packing and shipping the order to the customer, and the money will be withdrawn from their account.',
  },
  {
    title: `${Ecommerce.OrderStatus.PACKED}`,
    content: 'The order will be marked as packed, and ready for shipment',
  },
  {
    title: `${Ecommerce.OrderStatus.SHIPPED}`,
    content: 'The order will be marked as shipped',
  },
  {
    title: `${Ecommerce.OrderStatus.CLOSED}`,
    content:
      'The order will be closed, and further action will not be needed. ',
  },
];
