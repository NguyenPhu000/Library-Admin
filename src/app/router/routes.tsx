import { Navigate, type RouteObject, createBrowserRouter } from 'react-router';

import { AdminLayout } from '../../components/layout/AdminLayout';
import { BookDetailPage } from '../../features/books/pages/BookDetailPage';
import { BookFormPage } from '../../features/books/pages/BookFormPage';
import { BooksPage } from '../../features/books/pages/BooksPage';
import { NotFoundPage } from '../../features/books/pages/NotFoundPage';
import { PlaceholderPage } from '../../shared/components/PlaceholderPage';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/books" replace /> },
      { path: 'dashboard', element: <PlaceholderPage title="Dashboard" /> },
      { path: 'books', element: <BooksPage /> },
      { path: 'books/new', element: <BookFormPage mode="create" /> },
      { path: 'books/:bookId', element: <BookDetailPage /> },
      { path: 'books/:bookId/edit', element: <BookFormPage mode="edit" /> },
      { path: 'members', element: <PlaceholderPage title="Members" /> },
      { path: 'loans', element: <PlaceholderPage title="Loans" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(appRoutes);