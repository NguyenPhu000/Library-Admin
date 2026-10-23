import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BookFilters } from '../features/books/components/BookFilters';

describe('BookFilters', () => {
  it('renders search form with accessible role and searchbox', () => {
    render(<BookFilters searchQuery="" onSearchChange={vi.fn()} />);

    expect(screen.getByRole('search')).toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox', { name: /search/i });
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search by title or author');
    expect(searchInput).toHaveValue('');
  });

  it('renders current searchQuery value in the input', () => {
    render(<BookFilters searchQuery="Clean Code" onSearchChange={vi.fn()} />);

    const searchInput = screen.getByRole('searchbox', { name: /search/i });
    expect(searchInput).toHaveValue('Clean Code');
  });

  it('calls onSearchChange when user types in search box', async () => {
    const handleSearchChange = vi.fn();
    const user = userEvent.setup();

    render(<BookFilters searchQuery="" onSearchChange={handleSearchChange} />);

    const searchInput = screen.getByRole('searchbox', { name: /search/i });
    await user.type(searchInput, 'Refactor');

    expect(handleSearchChange).toHaveBeenCalled();
  });
});
