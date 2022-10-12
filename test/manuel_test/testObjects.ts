import { Product } from 'src/products/entities/product.entity';

export const testArray: Product[] = [
  {
    id: 1,
    name: 'Diamantring',
    sku: 'DIA1',
    description: 'Dette er en ring af diamant',
    price: 5000,
    picture: 'Not implemened',
    quantity: 10,
  } as Product,
  {
    id: 2,
    name: 'Cheeseburger',
    sku: 'CHE1',
    description: 'Dette er en cheecburger',
    price: 49,
    picture: 'Not implemened',
    quantity: 10,
  } as Product,
  {
    id: 3,
    name: 'Handsker',
    sku: 'HAN1',
    description: 'Dette er et par handsker',
    price: 25,
    picture: 'Not implemened',
    quantity: 10,
  } as Product,
];
