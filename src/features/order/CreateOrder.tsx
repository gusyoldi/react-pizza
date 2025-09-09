import { useState } from 'react';
import { Form, useActionData, useNavigation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Button from '../../ui/Button';
import { formatCurrency } from '../../utils/helpers';
import { getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import { fetchAddress } from '../user/userSlice';

export type FormErrors = {
  phone?: string;
};

const CreateOrder = () => {
  const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const formErrors = useActionData() as FormErrors;
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useAppSelector((state) => state.userStore);
  const isLoadingAddress = addressStatus === 'loading';
  const cart = useAppSelector(getCart);
  const totalCartPrice = useAppSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.21 : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  const dispatch = useAppDispatch();

  const isAdressError = addressStatus === 'error';
  const isPhoneError = formErrors?.phone;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Hacé tu pedido:</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-24">Nombre</label>
          <input
            type="text"
            name="customer"
            defaultValue={username}
            required
            className="input grow"
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-24">Teléfono</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            {isPhoneError && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className={`mb-5 flex flex-col gap-2 sm:flex-row sm:items-center`}>
          <label className="sm:basis-24">Dirección</label>
          <div className="grow">
            <div className="relative">
              <input
                defaultValue={address}
                disabled={isLoadingAddress}
                type="text"
                name="address"
                required
                className="input w-full"
              />
              {!position.latitude && !position.longitude && (
                <span className="absolute bottom-[3px] right-[3px] z-50 md:right-[5px] md:top-auto">
                  <Button
                    disabled={isLoadingAddress}
                    type="small"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(fetchAddress());
                    }}
                  >
                    Get position
                  </Button>
                </span>
              )}
            </div>
            {isAdressError && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={String(withPriority)}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Te gustaría darle prioridad a tu orden?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude}, ${position.longitude}`
                : ''
            }
          />
          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? 'Generando pedido...'
              : `Pedir ahora por ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateOrder;
