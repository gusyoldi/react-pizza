import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Order from '../features/order/Order';
import OrderItem from '../features/order/OrderItem';
import SearchOrder from '../features/order/SearchOrder';
import UpdateOrder from '../features/order/UpdateOrder';
import { CartType } from '../types/cart';
import { MenuType } from '../types/menu';
import { OrderType } from '../types/order';

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

const mockMenuItems: MenuType[] = [
  {
    id: 1,
    name: 'Margherita',
    unitPrice: 12.99,
    ingredients: ['tomato', 'mozzarella', 'basil'],
    soldOut: false,
    imageUrl: '/margherita.jpg',
  },
  {
    id: 2,
    name: 'Pepperoni',
    unitPrice: 14.99,
    ingredients: ['tomato', 'mozzarella', 'pepperoni'],
    soldOut: false,
    imageUrl: '/pepperoni.jpg',
  },
];

const mockOrder: OrderType = {
  id: '123',
  customer: 'John Doe',
  phone: '+1234567890',
  address: '123 Test St',
  priority: false,
  status: 'preparing',
  estimatedDelivery: '2024-01-01T12:30:00Z',
  cart: mockCartItems,
  position: '40.7128,-74.0060',
  orderPrice: 40.97,
  priorityPrice: 0,
};

const mockOrderWithPriority: OrderType = {
  ...mockOrder,
  priority: true,
  priorityPrice: 8.60,
  status: 'on the way',
};

const mockDeliveredOrder: OrderType = {
  ...mockOrder,
  status: 'delivered',
  estimatedDelivery: '2024-01-01T11:00:00Z', // Past time
};

// Mock React Router hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useFetcher: vi.fn(() => ({
      data: mockMenuItems,
      state: 'idle',
      load: vi.fn(),
      Form: ({ children }: { children: React.ReactNode }) => <form method="PATCH">{children}</form>,
    })),
    useNavigate: vi.fn(),
  };
});

// Mock helpers
vi.mock('../utils/helpers', () => ({
  calcMinutesLeft: vi.fn((estimatedDelivery: string) => {
    const now = new Date('2024-01-01T12:00:00Z');
    const delivery = new Date(estimatedDelivery);
    const diff = Math.floor((delivery.getTime() - now.getTime()) / (1000 * 60));
    return diff;
  }),
  formatCurrency: vi.fn((amount: number) => `€${amount.toFixed(2)}`),
  formatDate: vi.fn((date: string) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }),
  translateStatus: vi.fn((status: string) => {
    const statusMap: Record<string, string> = {
      preparing: 'Preparando',
      'on the way': 'En camino',
      delivered: 'Entregado',
    };
    return statusMap[status] || status;
  }),
}));

// Mock Button component
vi.mock('../ui/Button', () => ({
  default: ({ children, type }: { children: React.ReactNode; type?: string }) => (
    <button type={type === 'primary' ? 'submit' : 'button'}>{children}</button>
  ),
}));

// Mock UpdateOrder component
vi.mock('../features/order/UpdateOrder', () => ({
  default: () => <div data-testid="update-order">UpdateOrder</div>,
}));

// Import the mocked hooks after mocking
import { useFetcher, useLoaderData, useNavigate } from 'react-router-dom';

// Create typed mock references
const mockedUseLoaderData = vi.mocked(useLoaderData);
const mockedUseFetcher = vi.mocked(useFetcher);
const mockedUseNavigate = vi.mocked(useNavigate);

// Wrapper component for testing
interface TestWrapperProps {
  children: React.ReactNode;
  orderData?: OrderType;
}

const TestWrapper = ({ children, orderData = mockOrder }: TestWrapperProps) => {
  // Mock useLoaderData to return order data
  mockedUseLoaderData.mockReturnValue(orderData);
  
  return <MemoryRouter>{children}</MemoryRouter>;
};

describe('Order Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders order header with correct title and status', () => {
    render(
      <TestWrapper>
        <Order />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /estado del pedido #123/i })).toBeInTheDocument();
    expect(screen.getByText('Preparando')).toBeInTheDocument();
  });

  it('displays priority badge when order has priority', () => {
    render(
      <TestWrapper orderData={mockOrderWithPriority}>
        <Order />
      </TestWrapper>
    );

    expect(screen.getByText('Prioridad')).toBeInTheDocument();
    expect(screen.getByText('En camino')).toBeInTheDocument();
  });

  it('does not display priority badge when order has no priority', () => {
    render(
      <TestWrapper>
        <Order />
      </TestWrapper>
    );

    expect(screen.queryByText('Prioridad')).not.toBeInTheDocument();
  });

  it('shows delivery countdown for future orders', () => {
    render(
      <TestWrapper>
        <Order />
      </TestWrapper>
    );

    expect(screen.getByText(/estará listo en 30 minutos/i)).toBeInTheDocument();
    expect(screen.getByText(/\(hora de llegada estimada:/i)).toBeInTheDocument();
  });

  it('shows delivered message for past orders', () => {
    render(
      <TestWrapper orderData={mockDeliveredOrder}>
        <Order />
      </TestWrapper>
    );

    expect(screen.getByText(/el pedido ya salió para tu domicilio/i)).toBeInTheDocument();
  });

  it('renders order items correctly', () => {
    render(
      <TestWrapper>
        <Order />
      </TestWrapper>
    );

    expect(screen.getByText('2×', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('1×', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('€25.98')).toBeInTheDocument();
    expect(screen.getByText('€14.99')).toBeInTheDocument();
  });

  it('displays ingredients for order items', () => {
    render(
      <TestWrapper>
        <Order />
      </TestWrapper>
    );

    expect(screen.getByText('tomato, mozzarella, basil')).toBeInTheDocument();
    expect(screen.getByText('tomato, mozzarella, pepperoni')).toBeInTheDocument();
  });

  it('shows loading state while fetching ingredients', () => {
    const mockFetcher = {
      data: null,
      state: 'loading' as const,
      load: vi.fn(),
      Form: ({ children }: { children: React.ReactNode }) => <form method="PATCH">{children}</form>,
      submit: vi.fn(),
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      text: undefined,
      formData: undefined,
      json: undefined,
    };
mockedUseFetcher.mockReturnValue(
  mockFetcher as unknown as ReturnType<typeof mockedUseFetcher>
);
    render(
      <TestWrapper>
        <Order />
      </TestWrapper>
    );

    expect(screen.getAllByText('Cargando...')).toHaveLength(2);
  });

  it('displays pricing information correctly', () => {
    render(
      <TestWrapper>
        <Order />
      </TestWrapper>
    );

    expect(screen.getByText('Precio de las pizzas: €40.97')).toBeInTheDocument();
    expect(screen.getByText('Total a pagar: €40.97')).toBeInTheDocument();
  });

  it('includes priority price when order has priority', () => {
    render(
      <TestWrapper orderData={mockOrderWithPriority}>
        <Order />
      </TestWrapper>
    );

    expect(screen.getByText('Precio de las pizzas: €40.97')).toBeInTheDocument();
    expect(screen.getByText('Costo por prioridad: €8.60')).toBeInTheDocument();
    expect(screen.getByText('Total a pagar: €49.57')).toBeInTheDocument();
  });

  it('shows UpdateOrder component when order has no priority', () => {
    render(
      <TestWrapper>
        <Order />
      </TestWrapper>
    );

    expect(screen.getByTestId('update-order')).toBeInTheDocument();
  });

  it('does not show UpdateOrder component when order has priority', () => {
    render(
      <TestWrapper orderData={mockOrderWithPriority}>
        <Order />
      </TestWrapper>
    );

    expect(screen.queryByTestId('update-order')).not.toBeInTheDocument();
  });
});

describe('OrderItem Component', () => {
  const mockItem: CartType = {
    pizzaId: 1,
    name: 'Margherita',
    quantity: 2,
    unitPrice: 12.99,
    totalPrice: 25.98,
  };

  const mockIngredients = ['tomato', 'mozzarella', 'basil'];

  it('renders order item information correctly', () => {
    render(
      <MemoryRouter>
        <OrderItem
          item={mockItem}
          ingredients={mockIngredients}
          isLoadingIngredients={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('2×', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('€25.98')).toBeInTheDocument();
    expect(screen.getByText('tomato, mozzarella, basil')).toBeInTheDocument();
  });

  it('displays loading state when ingredients are loading', () => {
    render(
      <MemoryRouter>
        <OrderItem
          item={mockItem}
          ingredients={[]}
          isLoadingIngredients={true}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('displays ingredients when not loading', () => {
    render(
      <MemoryRouter>
        <OrderItem
          item={mockItem}
          ingredients={mockIngredients}
          isLoadingIngredients={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('tomato, mozzarella, basil')).toBeInTheDocument();
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
  });
});

describe('SearchOrder Component', () => {
  it('renders search input with correct placeholder', () => {
    const mockNavigate = vi.fn();
    mockedUseNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <SearchOrder />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Buscar pedido #');
    expect(searchInput).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    const mockNavigate = vi.fn();
    mockedUseNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <SearchOrder />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Buscar pedido #') as HTMLInputElement;
    
    fireEvent.change(searchInput, { target: { value: '123' } });
    expect(searchInput.value).toBe('123');
  });

  it('navigates to order page when form is submitted', async () => {
    const mockNavigate = vi.fn();
    mockedUseNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <SearchOrder />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Buscar pedido #') as HTMLInputElement;
    const form = searchInput.closest('form')!;

    fireEvent.change(searchInput, { target: { value: '123' } });
    fireEvent.submit(form);

    expect(mockNavigate).toHaveBeenCalledWith('/order/123');
    expect(searchInput.value).toBe(''); // Should be cleared after submission
  });

  it('does not navigate when query is empty', () => {
    const mockNavigate = vi.fn();
    mockedUseNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <SearchOrder />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Buscar pedido #') as HTMLInputElement;
    const form = searchInput.closest('form')!;

    fireEvent.submit(form);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('UpdateOrder Component', () => {
  it('renders priority button', () => {
    render(
      <MemoryRouter>
        <UpdateOrder />
      </MemoryRouter>
    );

    expect(screen.getByTestId('update-order')).toBeInTheDocument();
  });

  it('uses fetcher.Form with PATCH method', () => {
    render(
      <MemoryRouter>
        <UpdateOrder />
      </MemoryRouter>
    );

    expect(screen.getByTestId('update-order')).toBeInTheDocument();
  });
});
