import { redirect } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import store from '../../store/store';
import { OrderType } from '../../types/order';
import { clearCart } from '../cart/cartSlice';
import { FormErrors } from './CreateOrder';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

export default async function createOrderAction({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart as string),
    priority: data.priority === 'true',
  } as OrderType;

  const errors: FormErrors = {};
  if (!isValidPhone(order.phone))
    errors.phone = 'Por favor ingresa un número de teléfono válido';

  if (Object.keys(errors).length > 0) return errors;
  const newOrder = await createOrder(order);

  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}
