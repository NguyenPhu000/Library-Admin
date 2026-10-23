import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { BookTable } from '../features/books/components/BookTable';
import type { BookItem } from '../features/books/types/book';

const MOCK_BOOKS: BookItem[] = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    publishedYear: 2008,
    isbn: '978-0-13-235088-4',
    publisher: 'Prentice Hall',
    edition: '1st Edition',
    description: null,
    totalCopies: 4,
    tags: ['Programming'],
    status: 'AVAILABLE',
    addedOn: '2026-08-10',
    createdAt: '2026-08-10T08:00:00.000Z',
    updatedAt: '2026-08-10T08:00:00.000Z',
  },
  {
    id: 2,
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    publishedYear: 2017,
    isbn: '978-1-44-937332-0',
    publisher: "O'Reilly Media",
    edition: '1st Edition',
    description: null,
    totalCopies: 0,
    tags: ['Database', 'Architecture'],
    status: 'OUT_OF_STOCK',
    addedOn: '2026-07-20',
    createdAt: '2026-07-20T08:00:00.000Z',
    updatedAt: '2026-07-20T08:00:00.000Z',
  },
];

describe('BookTable', () => {
  it('renders table headers for all 7 required columns', () => {
    render(
      <MemoryRouter>
        <BookTable books={MOCK_BOOKS} />
      </MemoryRouter>,
    );

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    const expectedColumns = ['Title', 'Author', 'Year', 'Tags', 'Stock', 'Status', 'Actions'];
    for (const column of expectedColumns) {
      expect(within(table).getByRole('columnheader', { name: column })).toBeInTheDocument();
    }
  });

  it('renders book rows with title links, author, year, stock, tags and status badges', () => {
    render(
      <MemoryRouter>
        <BookTable books={MOCK_BOOKS} />
      </MemoryRouter>,
    );

    const firstRowTitle = screen.getByRole('link', { name: 'Clean Code' });
    expect(firstRowTitle).toHaveAttribute('href', '/books/1');

    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
    expect(screen.getByText('2008')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();

    expect(screen.getByText('Designing Data-Intensive Applications')).toBeInTheDocument();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText('Architecture')).toBeInTheDocument();
  });

  it('renders View and Edit action links for each book', () => {
    render(
      <MemoryRouter>
        <BookTable books={MOCK_BOOKS} />
      </MemoryRouter>,
    );

    const viewLinks = screen.getAllByRole('link', { name: 'View' });
    const editLinks = screen.getAllByRole('link', { name: 'Edit' });

    expect(viewLinks).toHaveLength(2);
    expect(editLinks).toHaveLength(2);

    expect(viewLinks[0]).toHaveAttribute('href', '/books/1');
    expect(editLinks[0]).toHaveAttribute('href', '/books/1/edit');
    expect(viewLinks[1]).toHaveAttribute('href', '/books/2');
    expect(editLinks[1]).toHaveAttribute('href', '/books/2/edit');
  });
});
