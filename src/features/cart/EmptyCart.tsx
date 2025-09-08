import LinkButton from '../../ui/LinkButton';

function EmptyCart() {
  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Volver al menú</LinkButton>

      <p className="mt-7 font-semibold">
        Tu carrito todavía está vacío. Agregá algunas pizzas... 🍕
      </p>
    </div>
  );
}

export default EmptyCart;
