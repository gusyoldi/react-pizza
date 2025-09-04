import { CartType } from './cart';

export type OrderType = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  priority: boolean;
  status: 'preparing' | 'on the way' | 'delivered';
  estimatedDelivery: string;
  cart: CartType[];
  position: string;
  orderPrice: number;
  priorityPrice: number;
};

export type OrderFormDataType = {
  customer: string;
  phone: string;
  address: string;
  cart: string;
  priority?: string;
};
