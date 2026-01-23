import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import userSlice from '../features/user/userSlice';
import Home from '../ui/Home';

interface UserState {
  username: string;
  status: 'idle' | 'loading' | 'error';
  position: { latitude: number; longitude: number };
  address: string;
  error: string;
}

const createTestStore = (initialState: Partial<UserState> = {}) => {
  const defaultState: UserState = {
    username: '',
    status: 'idle',
    position: { latitude: 0, longitude: 0 },
    address: '',
    error: '',
    ...initialState,
  };

  return configureStore({
    reducer: {
      userStore: userSlice,
    },
    preloadedState: {
      userStore: defaultState,
    },
  });
};

const renderWithProviders = (component: React.ReactElement, initialState: Partial<UserState> = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </Provider>
  );
};

describe('Home Component', () => {
  it('renders the main heading correctly', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('La mejor pizza.')).toBeInTheDocument();
    expect(screen.getByText('Recién hecha, directo a tu mesa')).toBeInTheDocument();
  });

  it('shows CreateUser component when username is empty', () => {
    renderWithProviders(<Home />, { username: '' });
    
    expect(screen.getByText('👋 Bienvenido! Por favor introduce tu nombre:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre completo')).toBeInTheDocument();
  });

  it('shows continue button when username exists', () => {
    const testUsername = 'John';
    renderWithProviders(<Home />, { username: testUsername });
    
    expect(screen.getByText(`Continúa con tu pedido, ${testUsername}`)).toBeInTheDocument();
  });

  it('continue button links to menu page', () => {
    renderWithProviders(<Home />, { username: 'John' });
    
    const continueButton = screen.getByRole('link', { name: /continúa con tu pedido/i });
    expect(continueButton).toHaveAttribute('href', '/menu');
  });

  it('applies correct CSS classes', () => {
    renderWithProviders(<Home />);
    
    const container = screen.getByText('La mejor pizza.').closest('div');
    expect(container).toHaveClass('my-10', 'px-4', 'text-center', 'sm:my-16');
    
    const heading = screen.getByText('La mejor pizza.');
    expect(heading).toHaveClass('mb-8', 'text-xl', 'font-semibold', 'text-stone-700', 'md:text-3xl');
    
    const yellowText = screen.getByText('Recién hecha, directo a tu mesa');
    expect(yellowText).toHaveClass('text-yellow-500');
  });
});
