import { Navigate, createBrowserRouter } from 'react-router';

import { AdminLayout } from '../../components/layout/AdminLayout';
import { BooksPage } from '../../features/books/pages/BooksPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/books" replace /> },
      { path: 'books', element: <BooksPage /> },
    ],
  },
]);