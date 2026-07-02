import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import TeamPage from './pages/TeamPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/team/:slug',
    element: <TeamPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}