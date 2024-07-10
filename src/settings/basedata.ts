import { systemNotification } from './entities/systemNotification.entity';

type notificationSeedingData = Omit<systemNotification, 'id'>;
export const systemNotificationMessage: notificationSeedingData[] = [
  {
    title: 'receiveOrderMessage',
    content:
      'You will put the order into received, this will reserve the order on the customers account - This is the default status',
  },
  {
    title: 'reserveOrderMessage',
    content:
      'This will place a backorder into the system - You are sill required to fulfill the order',
  },
  {
    title: 'confirmOrderMessage',
    content:
      'You will confirm the order and commit to packing and shipping the order to the customer, and the money will be withdrawn from their account.',
  },
  {
    title: 'packOrderMessage',
    content: 'The order will be marked as packed, and ready for shipment',
  },
  { title: 'shipOrderMessage', content: 'The order will be marked as shipped' },
  {
    title: 'closeOrderMessage',
    content:
      'The order will be closed, and further action will not be needed. ',
  },
];
