// Test ID: IIDSAT

import { useFetcher, useLoaderData } from 'react-router-dom';

import { useEffect } from 'react';
import { MenuType } from '../../types/menu';
import { OrderType } from '../../types/order';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
  translateStatus,
} from '../../utils/helpers';
import OrderItem from './OrderItem';
import UpdateOrder from './UpdateOrder';

function Order() {
  const order = useLoaderData() as OrderType;
  const fetcher = useFetcher();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === 'idle') fetcher.load('/menu');
  }, [fetcher]);

  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Estado del pedido #{id}</h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50">
              Prioridad
            </span>
          )}
          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-green-50">
            {translateStatus(status)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Estará listo en ${calcMinutesLeft(estimatedDelivery)} minutos 😃`
            : 'El pedido ya salió para tu domicilio 🛵'}
        </p>
        <p className="text-xs text-stone-500">
          (Hora de llegada estimada: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-y divide-stone-200 border-b border-t">
        {cart.map((item) => (
          <OrderItem
            key={item.pizzaId}
            item={item}
            ingredients={
              fetcher?.data?.find((el: MenuType) => el.id === item.pizzaId)
                ?.ingredients ?? []
            }
            isLoadingIngredients={fetcher.state === 'loading'}
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Precio de las pizzas: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            Costo por prioridad: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          Total a pagar: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>
      {!priority && <UpdateOrder />}
    </div>
  );
}

export default Order;
