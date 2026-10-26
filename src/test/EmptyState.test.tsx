import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { EmptyState } from '../shared/components/EmptyState';

describe('EmptyState', () => {
  it('renders filter empty state with Clear filters button and triggers onAction', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(
      <MemoryRouter>
        <EmptyState
          title="No books match your filters"
          description="Try another title or author, or clear the filters to see every book."
          actionLabel="Clear filters"
          onAction={handleClear}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('No books match your filters')).toBeInTheDocument();
    expect(
      screen.getByText('Try another title or author, or clear the filters to see every book.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('renders catalogue empty state with Add book link when actionTo is provided', () => {
    render(
      <MemoryRouter>
        <EmptyState
          title="No books in the catalogue yet"
          description="Add the first book to start building your library catalogue."
          actionLabel="Add book"
          actionTo="/books/new"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('No books in the catalogue yet')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Add book' });
    expect(link).toHaveAttribute('href', '/books/new');
  });
});
