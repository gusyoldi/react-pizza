import { formatCurrency } from '../../utils/helpers';
import Button from './../../ui/Button';
interface CartItemProps {
  item: {
    name: string;
    quantity: number;
    totalPrice: number;
    pizzaId: number;
    unitPrice: number;
  };
}

function CartItem({ item }: CartItemProps) {
  const { name, quantity, totalPrice } = item;

  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <Button type="small">Borrar</Button>
      </div>
    </li>
  );
}

export default CartItem;
