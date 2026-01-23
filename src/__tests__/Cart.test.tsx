import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Cart from '../features/cart/Cart';
import CartItem from '../features/cart/CartItem';
import CartOverview from '../features/cart/CartOverview';
import cartReducer, {
  addItem,
  clearCart,
  decreaseItemQuantity,
  deleteItem,
  increaseItemQuantity
} from '../features/cart/cartSlice';
import DeleteItem from '../features/cart/DeleteItem';
import EmptyCart from '../features/cart/EmptyCart';
import UpdateItemQuantity from '../features/cart/UpdateItemQuantity';
import userReducer from '../features/user/userSlice';
import { CartType } from '../types/cart';

// Mock data
const mockCartItems: CartType[] = [
  {
    pizzaId: 1,
    name: 'Margherita',
    quantity: 2,
    unitPrice: 12.99,
    totalPrice: 25.98,
  },
  {
    pizzaId: 2,
    name: 'Pepperoni',
    quantity: 1,
    unitPrice: 14.99,
    totalPrice: 14.99,
  },
];

const mockUser = {
  username: 'JohnDoe',
  status: 'idle' as const,
  position: { latitude: 0, longitude: 0 },
  address: '',
  error: '',
};

// Test store setup
interface CartState {
  cart: CartType[];
}

interface UserState {
  username: string;
  status: 'idle' | 'loading' | 'error';
  position: { latitude: number; longitude: number };
  address: string;
  error: string;
}

const createTestStore = (initialCartState: CartState = { cart: [] }, initialUserState: UserState = { username: '', status: 'idle' as const, position: { latitude: 0, longitude: 0 }, address: '', error: '' }) => {
  return configureStore({
    reducer: {
      cartStore: cartReducer,
      userStore: userReducer,
    },
    preloadedState: {
      cartStore: initialCartState,
      userStore: initialUserState,
    },
  });
};

// Wrapper component for testing
interface TestWrapperProps {
  children: React.ReactNode;
  store?: ReturnType<typeof createTestStore>;
}

const TestWrapper = ({ children, store = createTestStore() }: TestWrapperProps) => (
  <Provider store={store}>
    <MemoryRouter>{children}</MemoryRouter>
  </Provider>
);

describe('Cart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders EmptyCart when cart is empty', () => {
    const store = createTestStore({ cart: [] }, { ...mockUser, username: 'JohnDoe' });

    render(
      <TestWrapper store={store}>
        <Cart />
      </TestWrapper>
    );

    expect(screen.getByText(/tu carrito todavía está vacío/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver al menú/i })).toBeInTheDocument();
  });

  it('renders cart items when cart has items', () => {
    const store = createTestStore({ cart: mockCartItems }, { ...mockUser, username: 'JohnDoe' });

    render(
      <TestWrapper store={store}>
        <Cart />
      </TestWrapper>
    );

    expect(screen.getByText(/tu carrito, johndoe/i)).toBeInTheDocument();
    expect(screen.getByText('2× Margherita')).toBeInTheDocument();
    expect(screen.getByText('1× Pepperoni')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pedir/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /limpiar carrito/i })).toBeInTheDocument();
  });

  it('dispatches clearCart when clear button is clicked', () => {
    const store = createTestStore({ cart: mockCartItems }, { ...mockUser, username: 'JohnDoe' });

    render(
      <TestWrapper store={store}>
        <Cart />
      </TestWrapper>
    );

    const clearButton = screen.getByRole('button', { name: /limpiar carrito/i });
    fireEvent.click(clearButton);

    const actions = store.getState().cartStore.cart;
    expect(actions).toEqual([]);
  });
});

describe('CartItem Component', () => {
  const mockItem: CartType = {
    pizzaId: 1,
    name: 'Margherita',
    quantity: 2,
    unitPrice: 12.99,
    totalPrice: 25.98,
  };

  const store = createTestStore({ cart: [mockItem] });

  it('renders item information correctly', () => {
    render(
      <TestWrapper store={store}>
        <CartItem item={mockItem} />
      </TestWrapper>
    );

    expect(screen.getByText('2× Margherita')).toBeInTheDocument();
    expect(screen.getByText('€25.98')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // quantity display
  });

  it('renders UpdateItemQuantity and DeleteItem components', () => {
    render(
      <TestWrapper store={store}>
        <CartItem item={mockItem} />
      </TestWrapper>
    );

    // Check for quantity controls
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /borrar/i })).toBeInTheDocument();
  });
});

describe('CartOverview Component', () => {
  it('does not render when cart is empty', () => {
    const store = createTestStore({ cart: [] });

    render(
      <TestWrapper store={store}>
        <CartOverview />
      </TestWrapper>
    );

    expect(screen.queryByText(/pizzas/i)).not.toBeInTheDocument();
  });

  it('renders cart summary when cart has items', () => {
    const store = createTestStore({ cart: mockCartItems });

    render(
      <TestWrapper store={store}>
        <CartOverview />
      </TestWrapper>
    );

    expect(screen.getByText('3 pizzas')).toBeInTheDocument(); // 2 + 1
    expect(screen.getByText('€40.97')).toBeInTheDocument(); // 25.98 + 14.99
    expect(screen.getByRole('link', { name: /ir al carrito/i })).toBeInTheDocument();
  });
});

describe('UpdateItemQuantity Component', () => {
  const store = createTestStore();

  it('renders quantity controls correctly', () => {
    render(
      <TestWrapper store={store}>
        <UpdateItemQuantity itemId={1} currentQuantity={2} />
      </TestWrapper>
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
  });

  it('dispatches increaseItemQuantity when + button is clicked', () => {
    const store = createTestStore({ cart: [{ ...mockCartItems[0], pizzaId: 1 }] });

    render(
      <TestWrapper store={store}>
        <UpdateItemQuantity itemId={1} currentQuantity={2} />
      </TestWrapper>
    );

    const increaseButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(increaseButton);

    const state = store.getState().cartStore;
    const item = state.cart.find(item => item.pizzaId === 1);
    expect(item?.quantity).toBe(3);
  });

  it('dispatches decreaseItemQuantity when - button is clicked', () => {
    const store = createTestStore({ cart: [{ ...mockCartItems[0], pizzaId: 1, quantity: 2 }] });

    render(
      <TestWrapper store={store}>
        <UpdateItemQuantity itemId={1} currentQuantity={2} />
      </TestWrapper>
    );

    const decreaseButton = screen.getByRole('button', { name: '-' });
    fireEvent.click(decreaseButton);

    const state = store.getState().cartStore;
    const item = state.cart.find(item => item.pizzaId === 1);
    expect(item?.quantity).toBe(1);
  });
});

describe('DeleteItem Component', () => {
  const store = createTestStore();

  it('renders delete button correctly', () => {
    render(
      <TestWrapper store={store}>
        <DeleteItem itemId={1} />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /borrar/i })).toBeInTheDocument();
  });

  it('dispatches deleteItem when button is clicked', () => {
    const store = createTestStore({ cart: [{ ...mockCartItems[0], pizzaId: 1 }] });

    render(
      <TestWrapper store={store}>
        <DeleteItem itemId={1} />
      </TestWrapper>
    );

    const deleteButton = screen.getByRole('button', { name: /borrar/i });
    fireEvent.click(deleteButton);

    const state = store.getState().cartStore;
    expect(state.cart).toHaveLength(0);
  });
});

describe('EmptyCart Component', () => {
  it('renders empty cart message correctly', () => {
    render(
      <TestWrapper>
        <EmptyCart />
      </TestWrapper>
    );

    expect(screen.getByText(/tu carrito todavía está vacío/i)).toBeInTheDocument();
    expect(screen.getByText(/agregá algunas pizzas/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver al menú/i })).toBeInTheDocument();
  });
});

describe('Cart Redux Actions', () => {
  it('should add item to cart', () => {
    const store = createTestStore();
    const newItem: CartType = {
      pizzaId: 3,
      name: 'Four Cheese',
      quantity: 1,
      unitPrice: 16.99,
      totalPrice: 16.99,
    };

    store.dispatch(addItem(newItem));

    const state = store.getState().cartStore;
    expect(state.cart).toHaveLength(1);
    expect(state.cart[0]).toEqual(newItem);
  });

  it('should delete item from cart', () => {
    const store = createTestStore({ cart: mockCartItems });

    store.dispatch(deleteItem(1));

    const state = store.getState().cartStore;
    expect(state.cart).toHaveLength(1);
    expect(state.cart[0].pizzaId).toBe(2);
  });

  it('should increase item quantity', () => {
    const store = createTestStore({ cart: mockCartItems });

    store.dispatch(increaseItemQuantity(1));

    const state = store.getState().cartStore;
    const item = state.cart.find(item => item.pizzaId === 1);
    expect(item?.quantity).toBe(3);
    expect(item?.totalPrice).toBe(38.97); // 12.99 * 3
  });

  it('should decrease item quantity', () => {
    const store = createTestStore({ cart: mockCartItems });

    store.dispatch(decreaseItemQuantity(1));

    const state = store.getState().cartStore;
    const item = state.cart.find(item => item.pizzaId === 1);
    expect(item?.quantity).toBe(1);
    expect(item?.totalPrice).toBe(12.99);
  });

  it('should remove item when quantity decreases to 0', () => {
    const store = createTestStore({ 
      cart: [{ ...mockCartItems[0], quantity: 1, totalPrice: 12.99 }] 
    });

    store.dispatch(decreaseItemQuantity(1));

    const state = store.getState().cartStore;
    expect(state.cart).toHaveLength(0);
  });

  it('should clear cart', () => {
    const store = createTestStore({ cart: mockCartItems });

    store.dispatch(clearCart());

    const state = store.getState().cartStore;
    expect(state.cart).toHaveLength(0);
  });
});
