import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import cartReducer from '../features/cart/cartSlice';
import CreateOrder from '../features/order/CreateOrder';
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
  address: '123 Test St',
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

const createTestStore = (
  initialCartState: CartState = { cart: [] },
  initialUserState: UserState = { username: '', status: 'idle' as const, position: { latitude: 0, longitude: 0 }, address: '', error: '' }
) => {
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

// Mock React Router hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useActionData: vi.fn(() => null),
    useNavigation: vi.fn(() => ({ state: 'idle' })),
    Form: ({ children }: { children: React.ReactNode }) => <form>{children}</form>,
  };
});

// Mock fetchAddress
vi.mock('../features/user/userSlice', async () => {
  const actual = await vi.importActual('../features/user/userSlice');
  return {
    ...actual,
    fetchAddress: vi.fn(),
  };
});

describe('CreateOrder Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders EmptyCart when cart is empty', () => {
    const store = createTestStore({ cart: [] }, mockUser);

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    expect(screen.getByText(/tu carrito todavía está vacío/i)).toBeInTheDocument();
  });

  it('renders order form when cart has items', () => {
    const store = createTestStore({ cart: mockCartItems }, mockUser);

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /hacé tu pedido:/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('JohnDoe')).toBeInTheDocument(); // Name input
    expect(screen.getAllByRole('textbox')[1]).toBeInTheDocument(); // Phone input
    expect(screen.getByDisplayValue('123 Test St')).toBeInTheDocument(); // Address input
    expect(screen.getByLabelText(/te gustaría darle prioridad/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pedir ahora por/i })).toBeInTheDocument();
  });

  it('pre-fills user name from Redux store', () => {
    const store = createTestStore({ cart: mockCartItems }, mockUser);

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    const nameInput = screen.getByDisplayValue('JohnDoe');
    expect(nameInput).toBeInTheDocument();
  });

  it('pre-fills address from user store', () => {
    const store = createTestStore({ cart: mockCartItems }, mockUser);

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    const addressInput = screen.getByDisplayValue('123 Test St');
    expect(addressInput).toBeInTheDocument();
  });

  it('allows user to input their data', () => {
    const store = createTestStore({ cart: mockCartItems }, mockUser);

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    // Test name input
    const nameInput = screen.getByDisplayValue('JohnDoe');
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    expect((nameInput as HTMLInputElement).value).toBe('Jane Smith');

    // Test phone input
    const phoneInput = screen.getAllByRole('textbox')[1]; // Second textbox is phone
    fireEvent.change(phoneInput, { target: { value: '+5491123456789' } });
    expect((phoneInput as HTMLInputElement).value).toBe('+5491123456789');

    // Test address input
    const addressInput = screen.getByDisplayValue('123 Test St');
    fireEvent.change(addressInput, { target: { value: '456 New Street' } });
    expect((addressInput as HTMLInputElement).value).toBe('456 New Street');
  });

  it('updates total price when priority is selected', () => {
    const store = createTestStore({ cart: mockCartItems }, mockUser);

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    const priorityCheckbox = screen.getByLabelText(/te gustaría darle prioridad/i);
    const orderButton = screen.getByRole('button', { name: /pedir ahora por/i });

    // Initial price without priority
    expect(orderButton.textContent).toContain('€40.97'); // 25.98 + 14.99

    // With priority (21% extra)
    fireEvent.click(priorityCheckbox);
    expect(orderButton.textContent).toContain('€49.57'); // 40.97 + (40.97 * 0.21)
  });

  it('toggles priority checkbox correctly', () => {
    const store = createTestStore({ cart: mockCartItems }, mockUser);

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    const priorityCheckbox = screen.getByLabelText(/te gustaría darle prioridad/i) as HTMLInputElement;

    // Initially unchecked
    expect(priorityCheckbox.checked).toBe(false);

    // Check it
    fireEvent.click(priorityCheckbox);
    expect(priorityCheckbox.checked).toBe(true);

    // Uncheck it
    fireEvent.click(priorityCheckbox);
    expect(priorityCheckbox.checked).toBe(false);
  });

  it('displays correct cart summary', () => {
    const store = createTestStore({ cart: mockCartItems }, mockUser);

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    // The cart items are included as hidden input
    const cartInput = screen.getByDisplayValue(JSON.stringify(mockCartItems));
    expect(cartInput).toBeInTheDocument();
    expect(cartInput.getAttribute('name')).toBe('cart');
  });

  it('includes position data when available', () => {
    const store = createTestStore({ cart: mockCartItems }, {
      ...mockUser,
      position: { latitude: 40.7128, longitude: -74.0060 },
    });

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    const positionInput = screen.getAllByDisplayValue('40.7128, -74.006')[0];
    expect(positionInput).toBeInTheDocument();
    expect(positionInput.getAttribute('name')).toBe('position');
  });

  it('shows empty position when no coordinates available', () => {
    const store = createTestStore({ cart: mockCartItems }, {
      ...mockUser,
      position: { latitude: 0, longitude: 0 },
    });

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    const positionInput = screen.getAllByDisplayValue('')[1]; // Second empty input is position (hidden)
    expect(positionInput).toBeInTheDocument();
    expect(positionInput.getAttribute('name')).toBe('position');
  });

  it('validates required fields', () => {
    const store = createTestStore({ cart: mockCartItems }, mockUser);

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    const nameInput = screen.getByDisplayValue('JohnDoe');
    const phoneInput = screen.getAllByRole('textbox')[1]; // Second textbox is phone
    const addressInput = screen.getByDisplayValue('123 Test St');

    // Check that fields have required attribute
    expect(nameInput).toHaveAttribute('required');
    expect(phoneInput).toHaveAttribute('required');
    expect(addressInput).toHaveAttribute('required');
  });
});

describe('Form Data Preparation', () => {
  it('correctly prepares form data structure', () => {
    const store = createTestStore({ cart: mockCartItems }, mockUser);

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    // Fill form with test data
    const nameInput = screen.getByDisplayValue('JohnDoe');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    const phoneInput = screen.getAllByRole('textbox')[1]; // Second textbox is phone
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } });
    
    const addressInput = screen.getByDisplayValue('123 Test St');
    fireEvent.change(addressInput, { target: { value: '123 Test St' } });
    fireEvent.click(screen.getByLabelText(/te gustaría darle prioridad/i));

    // Verify hidden inputs contain correct data
    const cartInput = screen.getByDisplayValue(JSON.stringify(mockCartItems));
    expect(cartInput).toBeInTheDocument();

    const priorityInput = screen.getByDisplayValue('true');
    expect(priorityInput).toBeInTheDocument();
  });

  it('handles priority checkbox value correctly', () => {
    const store = createTestStore({ cart: mockCartItems }, mockUser);

    render(
      <TestWrapper store={store}>
        <CreateOrder />
      </TestWrapper>
    );

    const priorityCheckbox = screen.getByLabelText(/te gustaría darle prioridad/i) as HTMLInputElement;

    // When unchecked, value should be 'false'
    expect(priorityCheckbox.value).toBe('false');

    // When checked, value should be 'true'
    fireEvent.click(priorityCheckbox);
    expect(priorityCheckbox.value).toBe('true');
  });
});
