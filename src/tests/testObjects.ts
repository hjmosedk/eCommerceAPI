import { CurrencyType, Product } from '../products/entities/product.entity';

type newProduct = Omit<Product, 'id'>;

type wrongProduct = Partial<Product>;

export const diamondRingItem: newProduct = {
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
  quantity: 10,
  percentage: 0,
  onSale: false,
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
};

export const fakeTestProducts = [
  fakeDiamondRingItem,
  fakeCheecburgerItem,
  fakeGlovesItem,
];
