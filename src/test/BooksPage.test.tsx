import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { BooksPage } from '../features/books/pages/BooksPage';

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

    // Shows loading first or resolves to table
    expect(await screen.findByRole('table')).toBeInTheDocument();

    // Contains seed books mocked by MSW
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

    // Wait for the query to resolve after debounce and update the table
    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Clean Code' })).not.toBeInTheDocument();
    });

    expect(await screen.findByRole('link', { name: 'Refactoring' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'The Pragmatic Programmer' })).not.toBeInTheDocument();
  });

  it('displays empty state when search finds no matching books', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BooksPage />);

    expect(await screen.findByRole('table')).toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox', { name: /search/i });
    await user.type(searchInput, 'NonExistingSearchTerm123');

    expect(await screen.findByText('No books found.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
