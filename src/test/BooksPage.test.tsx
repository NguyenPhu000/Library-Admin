import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { BooksPage } from '../features/books/pages/BooksPage';
import { server } from './mocks/server';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('BooksPage', () => {
  it('renders the page header with Add book action', () => {
    renderWithProviders(<BooksPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Books' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /add book/i })).toHaveAttribute('href', '/books/new');
  });

  it('fetches books through MSW mock and displays the books table', async () => {
    renderWithProviders(<BooksPage />);

    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Clean Code' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'The Pragmatic Programmer' })).toBeInTheDocument();
  });

  it('filters books table when user searches by title or author', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BooksPage />);

    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Clean Code' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'The Pragmatic Programmer' })).toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox', { name: /search/i });
    await user.type(searchInput, 'Martin Fowler');

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Clean Code' })).not.toBeInTheDocument();
    });

    expect(await screen.findByRole('link', { name: 'Refactoring' })).toBeInTheDocument();
  });

  it('displays filter empty state when search finds no matching books', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BooksPage />);

    expect(await screen.findByRole('table')).toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox', { name: /search/i });
    await user.type(searchInput, 'Non-existent Book Title XYZ');

    expect(await screen.findByText('No books match your filters')).toBeInTheDocument();
    expect(
      screen.getByText('Try another title or author, or clear the filters to see every book.'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /clear filters/i }).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('displays catalogue empty state with Add book CTA when the catalogue has 0 books and no filters are active', async () => {
    server.use(
      http.get('*/api/v1/books', () => {
        return HttpResponse.json({
          data: [],
          total: 0,
          page: 1,
          limit: 10,
        });
      }),
    );

    renderWithProviders(<BooksPage />);

    expect(await screen.findByText('No books in the catalogue yet')).toBeInTheDocument();
    expect(
      screen.getByText('Add the first book to start building your library catalogue.'),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /add book/i }).length).toBeGreaterThanOrEqual(2);
  });

  it('filters books table when user selects a tag', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BooksPage />);

    expect(await screen.findByRole('table')).toBeInTheDocument();

    const tagSelect = screen.getByRole('combobox', { name: /tag/i });
    await user.selectOptions(tagSelect, 'Database');

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Clean Code' })).not.toBeInTheDocument();
    });

    expect(
      await screen.findByRole('link', { name: 'Designing Data-Intensive Applications' }),
    ).toBeInTheDocument();
  });

  it('filters books table when user selects a status', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BooksPage />);

    expect(await screen.findByRole('table')).toBeInTheDocument();

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    await user.selectOptions(statusSelect, 'OUT_OF_STOCK');

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Clean Code' })).not.toBeInTheDocument();
    });

    expect(
      await screen.findByRole('link', { name: 'Designing Data-Intensive Applications' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Eloquent JavaScript' })).toBeInTheDocument();
  });

  it('resets filters and restores the full books table when Clear filters is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BooksPage />);

    expect(await screen.findByRole('table')).toBeInTheDocument();

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    await user.selectOptions(statusSelect, 'OUT_OF_STOCK');

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Clean Code' })).not.toBeInTheDocument();
    });

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    await user.click(clearButton);

    expect(await screen.findByRole('link', { name: 'Clean Code' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'The Pragmatic Programmer' })).toBeInTheDocument();
    expect(statusSelect).toHaveValue('');
  });

  it('renders pagination component showing item range and page controls', async () => {
    renderWithProviders(<BooksPage />);

    expect(await screen.findByRole('table')).toBeInTheDocument();

    expect(screen.getByText('Showing 1–8 of 8 books')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
  });

  it('resets page to 1 when search or filters change', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BooksPage />);

    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Showing 1–8 of 8 books')).toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox', { name: /search/i });
    await user.type(searchInput, 'Clean Code');

    expect(await screen.findByText('Showing 1–1 of 1 books')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
  });

  it('displays error state with Request ID and retries fetching books when Try again is clicked', async () => {
    const user = userEvent.setup();
    let shouldFail = true;

    server.use(
      http.get('*/api/v1/books', () => {
        if (shouldFail) {
          shouldFail = false;
          return HttpResponse.json(
            {
              error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'The server did not respond. Check your connection and try again.',
                requestId: 'req_01HZX8',
              },
            },
            { status: 500 },
          );
        }

        return HttpResponse.json({
          data: [
            {
              id: 1,
              title: 'Clean Code',
              author: 'Robert C. Martin',
              isbn: '978-0-13-235088-4',
              publishedYear: 2008,
              totalCopies: 5,
              status: 'AVAILABLE',
              tags: ['Software', 'Craft'],
              description: null,
              createdAt: '2026-01-10T09:00:00.000Z',
              updatedAt: '2026-01-10T09:00:00.000Z',
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        });
      }),
    );

    renderWithProviders(<BooksPage />);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: "Couldn't load books" })).toBeInTheDocument();
    expect(
      screen.getByText('The server did not respond. Check your connection and try again.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Request ID: req_01HZX8')).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: 'Try again' });
    await user.click(retryButton);

    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Clean Code' })).toBeInTheDocument();
  });
});
