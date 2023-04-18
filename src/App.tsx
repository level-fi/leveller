import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Root from './components/Root';
import Profile from './pages/Profile';
import Search from './pages/Search';
import TopLGOHolder from './pages/TopLGOHolder';
import TopLP from './pages/TopLP';
import TopLVLHolder from './pages/TopLVLHolder';
import TopLyLVL from './pages/TopLyLVL';
import TopReferrer from './pages/TopReferrer';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Search />,
      },
      {
        path: 'top-lp',
        element: <TopLP />,
      },
      {
        path: 'top-lvl',
        element: <TopLVLHolder />,
      },
      {
        path: 'top-lgo',
        element: <TopLGOHolder />,
      },
      {
        path: 'top-loyalty',
        element: <TopLyLVL />,
      },
      {
        path: 'top-referrer',
        element: <TopReferrer />,
      },
      {
        path: ':address',
        element: <Profile />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
