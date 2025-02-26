import { Order } from '../../src/orders/entities/order.entity';
import { OrderDTO } from '../../src/orders/dtos/order.dto';

export const createDto = (orders: Order[]) => {
  return orders.map((order) => {
    const dto = new OrderDTO();
    (dto.id = order.id), (dto.customer = order.customer);
    dto.lastChange = order.lastChange;
    dto.orderCurrency = order.orderCurrency;
    (dto.orderDate = order.orderDate),
      (dto.orderItems = order.orderItems),
      (dto.orderNotes = order.orderNotes),
      (dto.orderStatus = order.orderStatus),
      (dto.orderTotalPrice = order.orderTotalPrice);
    return dto;
  });
};
