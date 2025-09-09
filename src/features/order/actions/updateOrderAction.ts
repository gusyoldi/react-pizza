import { ActionFunctionArgs } from 'react-router-dom';
import { updateOrder } from '../../../services/apiRestaurant';

export default async function updateOrderAction({
  params,
}: ActionFunctionArgs) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}
