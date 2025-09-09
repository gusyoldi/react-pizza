import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Cart from './features/cart/Cart';
import Menu from './features/menu/Menu';
import menuLoader from './features/menu/menuLoader';
import createOrderAction from './features/order//actions/createOrderAction';
import updateOrderAction from './features/order/actions/updateOrderAction';
import CreateOrder from './features/order/CreateOrder';
import Order from './features/order/Order';
import orderLoader from './features/order/orderLoader';
import AppLayout from './ui/AppLayout';
import Home from './ui/Home';
import NotFound from './ui/NotFound';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu',
        element: <Menu />,
        loader: menuLoader,
        errorElement: <NotFound />,
      },
      { path: '/cart', element: <Cart /> },
      {
        path: '/order/new',
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: '/order/:orderId',
        element: <Order />,
        loader: orderLoader,
        action: updateOrderAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
