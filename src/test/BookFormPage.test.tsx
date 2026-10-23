import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { RouterProvider, createMemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { appRoutes } from '../app/router/routes';
import { API_ERROR_CODE } from '../shared/types/api';
import { server } from './mocks/server';

function renderFormRoute(initialPath: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const router = createMemoryRouter(appRoutes, {
    initialEntries: [initialPath],
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return router;
}

describe('BookFormPage', () => {
  it('creates a new book via POST /api/v1/books and navigates to its detail page', async () => {
    const user = userEvent.setup();
    renderFormRoute('/books/new');

    expect(await screen.findByRole('heading', { level: 1, name: 'Add book' })).toBeInTheDocument();
    expect(
      screen.getByText('Fields marked * are required. The same form is used to edit a book.'),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/title/i), 'Patterns of Enterprise Application Architecture');
    await user.type(screen.getByLabelText(/author/i), 'Martin Fowler');
    await user.type(screen.getByLabelText(/year/i), '2002');

    const stockInput = screen.getByLabelText(/stock/i);
    await user.clear(stockInput);
    await user.type(stockInput, '3');

    await user.type(screen.getByLabelText(/tags/i), 'Architecture{Enter}Enterprise{Enter}');
    await user.type(
      screen.getByLabelText(/description/i),
      'Guide to enterprise software patterns.',
    );

    await user.click(screen.getByRole('button', { name: 'Save book' }));

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Patterns of Enterprise Application Architecture',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Guide to enterprise software patterns.')).toBeInTheDocument();
  });

  it('displays server error message when creating a book fails with 409 conflict', async () => {
    server.use(
      http.post('*/api/v1/books', () => {
        return HttpResponse.json(
          {
            error: {
              code: API_ERROR_CODE.ISBN_ALREADY_EXISTS,
              message: 'Book with this ISBN already exists',
              requestId: 'req-conflict',
            },
          },
          { status: 409 },
        );
      }),
    );

    const user = userEvent.setup();
    renderFormRoute('/books/new');

    await user.type(screen.getByLabelText(/title/i), 'Duplicate Book');
    await user.type(screen.getByLabelText(/author/i), 'Author Name');
    await user.type(screen.getByLabelText(/year/i), '2020');

    await user.click(screen.getByRole('button', { name: 'Save book' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Book with this ISBN already exists',
    );
  });

  it('maps 400 VALIDATION_ERROR field details onto the corresponding form field', async () => {
    server.use(
      http.post('*/api/v1/books', () => {
        return HttpResponse.json(
          {
            error: {
              code: API_ERROR_CODE.VALIDATION_ERROR,
              message: 'Request validation failed',
              details: {
                title: ['A book with this title already exists in the catalogue'],
              },
              requestId: 'req-val-400',
            },
          },
          { status: 400 },
        );
      }),
    );

    const user = userEvent.setup();
    renderFormRoute('/books/new');

    await user.type(screen.getByLabelText(/title/i), 'Clean Code');
    await user.type(screen.getByLabelText(/author/i), 'Robert C. Martin');
    await user.type(screen.getByLabelText(/year/i), '2008');

    await user.click(screen.getByRole('button', { name: 'Save book' }));

    expect(
      await screen.findByText('A book with this title already exists in the catalogue'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('prefills existing book data on /books/:bookId/edit and updates the book via PATCH', async () => {
    const user = userEvent.setup();
    renderFormRoute('/books/2/edit');

    expect(await screen.findByRole('heading', { level: 1, name: 'Edit book' })).toBeInTheDocument();

    const titleInput = await screen.findByDisplayValue('The Pragmatic Programmer');
    expect(titleInput).toBeInTheDocument();
    expect(screen.getByDisplayValue('David Thomas, Andrew Hunt')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2019')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('Career')).toBeInTheDocument();

    await user.clear(titleInput);
    await user.type(titleInput, 'The Pragmatic Programmer (2nd Edition)');

    await user.click(screen.getByRole('button', { name: 'Save book' }));

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'The Pragmatic Programmer (2nd Edition)',
      }),
    ).toBeInTheDocument();
  });
});
