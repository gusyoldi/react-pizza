import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Button from '../../ui/Button';
import LinkButton from '../../ui/LinkButton';
import { getUsername } from '../user/userSlice';
import CartItem from './CartItem';
import { clearCart, getCart } from './cartSlice';
import EmptyCart from './EmptyCart';

const Cart = () => {
  const cart = useAppSelector(getCart);
  const username = useAppSelector(getUsername);
  const dispatch = useAppDispatch();

  if (!cart.length) return <EmptyCart />;

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
        <Button onClick={() => dispatch(clearCart())} type="secondary">
          Limpiar carrito
        </Button>
      </div>
    </div>
  );
};

export default Cart;
