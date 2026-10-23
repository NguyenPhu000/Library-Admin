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
      mutations: {
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
  it('fetches and displays book details, stock counts, and loan history from MSW for the requested ID', async () => {
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

    const loanSection = screen.getByRole('region', { name: 'Loan history' });
    expect(await within(loanSection).findByText('Minh Tran')).toBeInTheDocument();
    expect(within(loanSection).getByText('Lan Pham')).toBeInTheDocument();
    expect(within(loanSection).getByText('Huy Nguyen')).toBeInTheDocument();
    expect(within(loanSection).getByText('Thao Le')).toBeInTheDocument();
    expect(within(loanSection).getByText('Khoa Vo')).toBeInTheDocument();
    expect(within(loanSection).getAllByText('Active')).toHaveLength(2);
    expect(within(loanSection).getByText('Overdue')).toBeInTheDocument();
    expect(within(loanSection).getAllByText('Returned', { selector: 'span' })).toHaveLength(2);

    expect(
      within(stockCard).getByText(
        '1 loan is overdue. Members are reminded 24 hours before the due date.',
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /edit/i })).toHaveAttribute('href', '/books/2/edit');
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('displays empty loan history state when a book has no loans', async () => {
    renderBookDetail('/books/3');

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Designing Data-Intensive Applications',
      }),
    ).toBeInTheDocument();

    const loanSection = screen.getByRole('region', { name: 'Loan history' });
    expect(
      await within(loanSection).findByText('No loan history for this book.'),
    ).toBeInTheDocument();
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
      http.get('*/api/v1/books/42/loans', () => {
        return HttpResponse.json({ data: [] });
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

  it('deletes a book with 0 active loans (204) and navigates back to /books', async () => {
    const user = userEvent.setup();
    renderBookDetail('/books/6');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Node.js Design Patterns' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    const dialog = screen.getByRole('dialog', { name: 'Delete book' });
    expect(within(dialog).getByText('Node.js Design Patterns')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Delete book' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Books list page' }),
    ).toBeInTheDocument();
  });

  it('blocks deletion when book has active loans (409 BOOK_HAS_ACTIVE_LOANS) and shows conflict message', async () => {
    const user = userEvent.setup();
    renderBookDetail('/books/2');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'The Pragmatic Programmer' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    const dialog = screen.getByRole('dialog', { name: 'Delete book' });
    await user.click(within(dialog).getByRole('button', { name: 'Delete book' }));

    const alert = await within(dialog).findByRole('alert');
    expect(alert).toHaveTextContent('Cannot delete book while 3 copies are currently on loan');
    expect(
      screen.getByRole('heading', { level: 1, name: 'The Pragmatic Programmer' }),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
