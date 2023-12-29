import { CurrencyType, Product } from '../src/products/entities/product.entity';
import { Order, OrderStatus } from '../src/orders/entities/order.entity';
import { Customer } from 'src/orders/entities/customer.entity';
import { OrderItem } from '../src/orders/entities/orderItem.entity';
import { OrderItemsListDto } from 'src/orders/dtos/order-items-list.dto';

type newProduct = Omit<Product, 'id'>;

type wrongProduct = Partial<Product>;

type newOrder = Omit<Order, 'id'>;

export const diamondRingItem: newProduct = {
  name: 'Diamond Ring',
  sku: 'RNG-1',
  description: 'This is a diamond ring - This is some placeholder text!',
  category: 'Jewelry',
  price: 250000,
  currency: CurrencyType.DKK,
  image: '66de3cfd-3830-47d2-8ce3-bd622a6dbcf4',
  quantity: 0,
  percentage: 0,
  onSale: false,
  isPublic: true,
  orderItems: [],
};

export const cheecburgerItem: newProduct = {
  name: 'Cheeseburger',
  sku: 'CHE-1',
  description: 'This is a cheeseburger with a some text',
  category: 'Food',
  price: 4900,
  currency: CurrencyType.DKK,
  image: 'f1e4fce4-dc0a-4e70-a284-874180510703',
  quantity: 10,
  percentage: 0,
  onSale: false,
  isPublic: true,
  orderItems: [],
};

export const glovesItem: newProduct = {
  name: 'Gloves',
  sku: 'GLV-1',
  description: 'This is a pair of gloves, they are on sale',
  category: 'Clothes',
  price: 100000,
  currency: CurrencyType.DKK,
  image: '860c9cc3-9714-4cb5-a00f-e27f1a90d397',
  quantity: 10,
  percentage: 20,
  onSale: true,
  isPublic: false,
  orderItems: [],
};

export const goldWatchItem: newProduct = {
  name: 'Gold Watch',
  sku: 'GLW-1',
  description: 'This is a golden watch to be used for checking the clock',
  category: 'Jewelry',
  price: 350000,
  currency: CurrencyType.DKK,
  image: '7c130b1d-1a71-4511-8637-266224cf1db5',
  quantity: 10,
  percentage: 20,
  onSale: true,
  isPublic: true,
  orderItems: [],
};

export const testProducts: newProduct[] = [
  diamondRingItem,
  glovesItem,
  cheecburgerItem,
];

export const wrongGlove: wrongProduct = {
  name: 'Gold Watch',
  category: 'Jewelry',
  price: 350000,
  currency: CurrencyType.DKK,
  image: '7c130b1d-1a71-4511-8637-266224cf1db5',
  quantity: 10,
  percentage: 20,
  onSale: true,
  isPublic: true,
  orderItems: [],
};

export const fakeDiamondRingItem: Product = {
  id: 1,
  name: 'Diamond Ring',
  sku: 'RNG-1',
  description: 'This is a diamond ring - This is some placeholder text!',
  category: 'Jewelry',
  price: 250000,
  currency: CurrencyType.DKK,
  image: '66de3cfd-3830-47d2-8ce3-bd622a6dbcf4',
  quantity: 5,
  percentage: 0,
  onSale: false,
  isPublic: false,
  orderItems: [],
};

export const fakeCheecburgerItem: Product = {
  id: 2,
  name: 'Cheeseburger',
  sku: 'CHE-1',
  description: 'This is a cheeseburger with a some text',
  category: 'Food',
  price: 4900,
  currency: CurrencyType.DKK,
  image: 'f1e4fce4-dc0a-4e70-a284-874180510703',
  quantity: 0,
  percentage: 0,
  onSale: false,
  isPublic: true,
  orderItems: [],
};

export const fakeGlovesItem: Product = {
  id: 3,
  name: 'Gloves',
  sku: 'GLV-1',
  description: 'This is a pair of gloves, they are on sale',
  category: 'Clothes',
  price: 100000,
  currency: CurrencyType.DKK,
  image: '860c9cc3-9714-4cb5-a00f-e27f1a90d397',
  quantity: 10,
  percentage: 20,
  onSale: true,
  isPublic: true,
  orderItems: [],
};

export const fakeGoldWatchItem: Product = {
  id: 4,
  name: 'Gold Watch',
  sku: 'GLW-1',
  description: 'This is a golden watch to be used for checking the clock',
  category: 'Jewelry',
  price: 350000,
  currency: CurrencyType.DKK,
  image: '7c130b1d-1a71-4511-8637-266224cf1db5',
  quantity: 10,
  percentage: 20,
  onSale: true,
  isPublic: false,
  orderItems: [],
};

export const fakeTestProducts = [
  fakeDiamondRingItem,
  fakeCheecburgerItem,
  fakeGlovesItem,
];

export const FakeCustomer: Customer = {
  personalInformation: {
    firstName: 'Test',
    middleName: 'T.',
    lastName: 'TestGuy',
    email: 'Test@test.dk',
    phone: '123456789',
  },
  shippingAddress: {
    address: 'TestStreet',
    address2nd: 'TestTest',
    city: 'Test Town',
    country: 'Denmark',
    zipCode: 4000,
  },
  billingAddress: {
    address: 'TestStreet',
    address2nd: 'TestTest',
    city: 'Test Town',
    country: 'Denmark',
    zipCode: 4000,
  },
};

export const fakeOrderWithReceivedStatus: Order = {
  id: 1,
  orderItems: [],
  orderDate: new Date(Date.now()),
  lastChange: new Date(Date.now()),
  customer: FakeCustomer,
  orderStatus: OrderStatus.RECEIVED,
  orderNotes: null,
};

export const fakeOrderWithConfirmedStatus: Order = {
  id: 2,
  orderItems: [],
  orderDate: new Date(Date.now()),
  lastChange: new Date(Date.now()),
  customer: FakeCustomer,
  orderStatus: OrderStatus.CONFIRMED,
  orderNotes: null,
};

export const fakeDiamondRingOrderItem: OrderItem = {
  id: 25,
  productId: fakeDiamondRingItem.id,
  orderedQuantity: 1,
  salesPrice: fakeDiamondRingItem.price,
  product: fakeDiamondRingItem,
  order: fakeOrderWithReceivedStatus,
};

export const fakeCheecburgerOrderItem: OrderItem = {
  id: 1,
  productId: fakeCheecburgerItem.id,
  orderedQuantity: 1,
  salesPrice: fakeCheecburgerItem.price,
  product: fakeCheecburgerItem,
  order: fakeOrderWithReceivedStatus,
};

fakeOrderWithReceivedStatus.orderItems = [
  fakeDiamondRingOrderItem,
  fakeCheecburgerOrderItem,
];

fakeOrderWithConfirmedStatus.orderItems = [
  fakeDiamondRingOrderItem,
  fakeCheecburgerOrderItem,
];

export const FakeOrderList: Order[] = [
  fakeOrderWithReceivedStatus,
  fakeOrderWithConfirmedStatus,
];

export const FakeDiamondCartItem: OrderItemsListDto = {
  orderedQuantity: 1,
  productId: 1,
  salesPrice: 250000,
};

export const fakeNewOrder: newOrder = fakeOrderWithReceivedStatus;

export const fakeCart: OrderItemsListDto[] = [FakeDiamondCartItem];
