import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';

import { BookDetailPage } from '../features/books/pages/BookDetailPage';
import type { BookDetail } from '../features/books/types/book';
import { server } from './mocks/server';

function renderBookDetail(initialEntry = '/books/2') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/books" element={<h1>Books list page</h1>} />
          <Route path="/books/:bookId" element={<BookDetailPage />} />
          <Route path="/books/:bookId/edit" element={<h1>Edit book page</h1>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('BookDetailPage', () => {
  it('fetches and displays book details, stock counts, tags, and actions for the requested ID', async () => {
    renderBookDetail('/books/2');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'The Pragmatic Programmer' }),
    ).toBeInTheDocument();

    expect(screen.getByText('David Thomas, Andrew Hunt · 2019')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('Career')).toBeInTheDocument();
    expect(screen.getAllByText('Available')).toHaveLength(2);

    const infoCard = screen.getByRole('region', { name: 'Book information' });
    expect(within(infoCard).getByText('978-0-13-595705-9')).toBeInTheDocument();
    expect(within(infoCard).getByText('Addison-Wesley')).toBeInTheDocument();
    expect(within(infoCard).getByText('20th Anniversary Edition')).toBeInTheDocument();
    expect(within(infoCard).getByText('2026-09-12')).toBeInTheDocument();
    expect(
      within(infoCard).getByText('Your journey to mastery in software development.'),
    ).toBeInTheDocument();

    const stockCard = screen.getByRole('region', { name: 'Stock' });
    expect(within(stockCard).getByText('Total copies')).toBeInTheDocument();
    expect(within(stockCard).getByText('5')).toBeInTheDocument();
    expect(within(stockCard).getByText('On loan')).toBeInTheDocument();
    expect(within(stockCard).getByText('3')).toBeInTheDocument();
    expect(within(stockCard).getByText('Available')).toBeInTheDocument();
    expect(within(stockCard).getByText('2')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /edit/i })).toHaveAttribute('href', '/books/2/edit');
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('displays em-dash (—) fallback when optional book fields are null or empty', async () => {
    const sparseBook: BookDetail = {
      id: 42,
      title: 'Minimalist Book',
      author: 'Jane Doe',
      publishedYear: 2024,
      isbn: '978-0-00-000000-0',
      publisher: null,
      edition: null,
      description: null,
      totalCopies: 1,
      onLoan: 0,
      available: 1,
      tags: [],
      status: 'AVAILABLE',
      addedOn: '2026-10-01',
      createdAt: '2026-10-01T00:00:00.000Z',
      updatedAt: '2026-10-01T00:00:00.000Z',
    };

    server.use(
      http.get('*/api/v1/books/42', () => {
        return HttpResponse.json(sparseBook);
      }),
    );

    renderBookDetail('/books/42');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Minimalist Book' }),
    ).toBeInTheDocument();

    const infoCard = screen.getByRole('region', { name: 'Book information' });
    const dashes = within(infoCard).getAllByText('—');
    expect(dashes).toHaveLength(3);
  });

  it('navigates back to the books list when "Back to books" is clicked', async () => {
    const user = userEvent.setup();
    renderBookDetail('/books/2');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'The Pragmatic Programmer' }),
    ).toBeInTheDocument();

    const backLink = screen.getByRole('link', { name: /back to books/i });
    expect(backLink).toHaveAttribute('href', '/books');

    await user.click(backLink);

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Books list page' }),
    ).toBeInTheDocument();
  });

  it('shows an error alert with Retry when the book ID is not found (404)', async () => {
    renderBookDetail('/books/999');

    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('Book with ID 999 does not exist')).toBeInTheDocument();
    expect(within(alert).getByRole('button', { name: /retry/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to books/i })).toBeInTheDocument();
  });
});
