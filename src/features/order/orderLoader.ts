import { LoaderFunctionArgs } from 'react-router-dom';
import { getOrder } from '../../services/apiRestaurant';

export default async function orderLoader({ params }: LoaderFunctionArgs) {
  const order = await getOrder(params.orderId);
  return order;
}
