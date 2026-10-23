import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { LoanHistoryTable } from '../features/books/components/LoanHistoryTable';
import type { Loan } from '../features/books/types/book';

const MOCK_LOANS: Loan[] = [
  {
    id: 1,
    bookId: 2,
    memberId: 101,
    memberName: 'Minh Tran',
    borrowedDate: '2026-10-15',
    dueDate: '2026-10-29',
    returnedDate: null,
    status: 'ACTIVE',
  },
  {
    id: 2,
    bookId: 2,
    memberId: 102,
    memberName: 'Lan Pham',
    borrowedDate: '2026-10-02',
    dueDate: '2026-10-16',
    returnedDate: null,
    status: 'OVERDUE',
  },
  {
    id: 4,
    bookId: 2,
    memberId: 104,
    memberName: 'Thao Le',
    borrowedDate: '2026-09-20',
    dueDate: '2026-10-04',
    returnedDate: '2026-10-03',
    status: 'RETURNED',
  },
];

describe('LoanHistoryTable', () => {
  it('renders the section header, View all loans link, and 5 required columns', () => {
    render(
      <MemoryRouter>
        <LoanHistoryTable loans={MOCK_LOANS} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Loan history' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View all loans' })).toHaveAttribute('href', '/loans');

    const table = screen.getByRole('table');
    for (const column of ['Member', 'Borrowed', 'Due', 'Returned', 'Status']) {
      expect(within(table).getByRole('columnheader', { name: column })).toBeInTheDocument();
    }
  });

  it('renders loan rows, formats null returnedDate as "—", and shows status badges', () => {
    render(
      <MemoryRouter>
        <LoanHistoryTable loans={MOCK_LOANS} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Minh Tran')).toBeInTheDocument();
    expect(screen.getByText('2026-10-15')).toBeInTheDocument();
    expect(screen.getByText('2026-10-29')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();

    expect(screen.getByText('Lan Pham')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();

    expect(screen.getByText('Thao Le')).toBeInTheDocument();
    expect(screen.getByText('2026-10-03')).toBeInTheDocument();
    expect(screen.getByText('Returned', { selector: 'span' })).toBeInTheDocument();

    expect(screen.getAllByText('—')).toHaveLength(2);
  });

  it('renders loading state when isLoading is true', () => {
    render(
      <MemoryRouter>
        <LoanHistoryTable loans={[]} isLoading />
      </MemoryRouter>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading loan history...');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders empty state when loans list is empty', () => {
    render(
      <MemoryRouter>
        <LoanHistoryTable loans={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText('No loan history for this book.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders error state and triggers onRetry when Retry button is clicked', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    render(
      <MemoryRouter>
        <LoanHistoryTable
          loans={[]}
          isError
          errorMessage="Could not fetch loan history"
          onRetry={handleRetry}
        />
      </MemoryRouter>,
    );

    const alert = screen.getByRole('alert');
    expect(within(alert).getByText('Could not fetch loan history')).toBeInTheDocument();

    await user.click(within(alert).getByRole('button', { name: 'Retry' }));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
