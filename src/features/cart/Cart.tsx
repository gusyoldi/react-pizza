import { useAppSelector } from '../../store/hooks';
import Button from '../../ui/Button';
import LinkButton from '../../ui/LinkButton';
import CartItem from './CartItem';

const fakeCart = [
  {
    pizzaId: 12,
    name: 'Mediterranean',
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: 'Vegetale',
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: 'Spinach and Mushroom',
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

const Cart = () => {
  const cart = fakeCart;
  const username = useAppSelector((state) => state.user.username);

  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Volver al menú</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Tu carrito, {username}</h2>

      <ul className="mt-3 divide-y divide-stone-200 border-b">
        {cart.map((item) => (
          <CartItem key={item.pizzaId} item={item} />
        ))}
      </ul>

      <div className="mt-6 space-x-2">
        <Button type="primary" to="/order/new">
          Pedir
        </Button>
        <Button type="secondary">Limpiar carrito</Button>
      </div>
    </div>
  );
};

export default Cart;
