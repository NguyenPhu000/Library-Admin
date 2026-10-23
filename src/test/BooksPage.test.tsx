import { render, screen } from '@testing-library/react';
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
});
