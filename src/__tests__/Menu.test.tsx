import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import cartReducer from '../features/cart/cartSlice';
import Menu from '../features/menu/Menu';
import MenuItem from '../features/menu/MenuItem';
import { MenuType } from '../types/menu';

// Mock data
const mockPizzas: MenuType[] = [
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
    soldOut: true,
    imageUrl: '/pepperoni.jpg',
  },
  {
    id: 3,
    name: 'Four Cheese',
    unitPrice: 16.99,
    ingredients: ['mozzarella', 'gorgonzola', 'parmesan', 'ricotta'],
    soldOut: false,
    imageUrl: '/four-cheese.jpg',
  },
];

// Test store setup
const createTestStore = (initialCartState = {}) => {
  return configureStore({
    reducer: {
      cartStore: cartReducer,
    },
    preloadedState: {
      cartStore: {
        cart: [],
        ...initialCartState,
      },
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

// Mock useLoaderData hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

const mockedUseLoaderData = vi.mocked(await import('react-router-dom').then(m => m.useLoaderData));

describe('Menu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the menu heading', () => {
    mockedUseLoaderData.mockReturnValue(mockPizzas);

    render(
      <TestWrapper>
        <Menu />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /menu/i })).toBeInTheDocument();
  });

  it('displays the correct number of pizza items', () => {
    mockedUseLoaderData.mockReturnValue(mockPizzas);

    render(
      <TestWrapper>
        <Menu />
      </TestWrapper>
    );

    const pizzaItems = screen.getAllByRole('listitem');
    expect(pizzaItems).toHaveLength(mockPizzas.length);
  });

  it('displays pizza names correctly', () => {
    mockedUseLoaderData.mockReturnValue(mockPizzas);

    render(
      <TestWrapper>
        <Menu />
      </TestWrapper>
    );

    mockPizzas.forEach((pizza) => {
      expect(screen.getByText(pizza.name)).toBeInTheDocument();
    });
  });

  it('handles empty menu gracefully', () => {
    mockedUseLoaderData.mockReturnValue([]);

    render(
      <TestWrapper>
        <Menu />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /menu/i })).toBeInTheDocument();
    const pizzaItems = screen.queryAllByRole('listitem');
    expect(pizzaItems).toHaveLength(0);
  });
});

describe('MenuItem Component', () => {
  const mockStore = createTestStore();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays pizza information correctly', () => {
    const pizza = mockPizzas[0]; // Margherita

    render(
      <TestWrapper store={mockStore}>
        <MenuItem pizza={pizza} />
      </TestWrapper>
    );

    expect(screen.getByText(pizza.name)).toBeInTheDocument();
    expect(screen.getByText(pizza.ingredients.join(', '))).toBeInTheDocument();
    expect(screen.getByText('€12.99')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: pizza.name })).toBeInTheDocument();
  });

  it('shows "Sin stock" for sold out pizzas', () => {
    const pizza = mockPizzas[1]; // Pepperoni (sold out)

    render(
      <TestWrapper store={mockStore}>
        <MenuItem pizza={pizza} />
      </TestWrapper>
    );

    expect(screen.getByText('Sin stock')).toBeInTheDocument();
    expect(screen.queryByText('Agregar al carrito')).not.toBeInTheDocument();
  });

  it('shows "Agregar al carrito" button for available pizzas', () => {
    const pizza = mockPizzas[0]; // Margherita (available)

    render(
      <TestWrapper store={mockStore}>
        <MenuItem pizza={pizza} />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /agregar al carrito/i })).toBeInTheDocument();
    expect(screen.queryByText('Sin stock')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes to sold out pizza images', () => {
    const pizza = mockPizzas[1]; // Pepperoni (sold out)

    render(
      <TestWrapper store={mockStore}>
        <MenuItem pizza={pizza} />
      </TestWrapper>
    );

    const img = screen.getByRole('img', { name: pizza.name });
    expect(img).toHaveClass('opacity-70', 'grayscale');
  });

  it('displays ingredients correctly formatted', () => {
    const pizza = mockPizzas[2]; // Four Cheese

    render(
      <TestWrapper store={mockStore}>
        <MenuItem pizza={pizza} />
      </TestWrapper>
    );

    const ingredientsText = screen.getByText(pizza.ingredients.join(', '));
    expect(ingredientsText).toBeInTheDocument();
    expect(ingredientsText).toHaveClass('text-sm', 'capitalize', 'italic', 'text-stone-500');
  });

  it('shows cart controls when pizza is in cart', () => {
    const pizza = mockPizzas[0]; // Margherita
    const storeWithCartItem = createTestStore({
      cart: [
        {
          pizzaId: pizza.id,
          name: pizza.name,
          quantity: 2,
          unitPrice: pizza.unitPrice,
          totalPrice: pizza.unitPrice * 2,
        },
      ],
    });

    render(
      <TestWrapper store={storeWithCartItem}>
        <MenuItem pizza={pizza} />
      </TestWrapper>
    );

    // Should show quantity controls and delete button
    expect(screen.queryByText('Agregar al carrito')).not.toBeInTheDocument();
    // These components should be rendered (UpdateItemQuantity and DeleteItem)
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
