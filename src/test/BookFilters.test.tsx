import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BookFilters } from '../features/books/components/BookFilters';

describe('BookFilters', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    selectedTag: '',
    onTagChange: vi.fn(),
    selectedStatus: '' as const,
    onStatusChange: vi.fn(),
    onClearFilters: vi.fn(),
    availableTags: ['Programming', 'JavaScript', 'Career', 'Architecture'],
  };

  it('renders search form with accessible role and searchbox', () => {
    render(<BookFilters {...defaultProps} />);

    expect(screen.getByRole('search')).toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox', { name: /search/i });
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search by title or author');
    expect(searchInput).toHaveValue('');
  });

  it('renders current searchQuery value in the input', () => {
    render(<BookFilters {...defaultProps} searchQuery="Clean Code" />);

    const searchInput = screen.getByRole('searchbox', { name: /search/i });
    expect(searchInput).toHaveValue('Clean Code');
  });

  it('calls onSearchChange when user types in search box', async () => {
    const handleSearchChange = vi.fn();
    const user = userEvent.setup();

    render(<BookFilters {...defaultProps} onSearchChange={handleSearchChange} />);

    const searchInput = screen.getByRole('searchbox', { name: /search/i });
    await user.type(searchInput, 'Refactor');

    expect(handleSearchChange).toHaveBeenCalled();
  });

  it('renders Tag and Status dropdowns with options', () => {
    render(<BookFilters {...defaultProps} />);

    const tagSelect = screen.getByRole('combobox', { name: /tag/i });
    expect(tagSelect).toBeInTheDocument();
    expect(tagSelect).toHaveValue('');

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    expect(statusSelect).toBeInTheDocument();
    expect(statusSelect).toHaveValue('');

    expect(screen.getByRole('option', { name: 'All tags' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Programming' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Available' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Out of stock' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Archived' })).toBeInTheDocument();
  });

  it('calls onTagChange when user selects a tag', async () => {
    const handleTagChange = vi.fn();
    const user = userEvent.setup();

    render(<BookFilters {...defaultProps} onTagChange={handleTagChange} />);

    const tagSelect = screen.getByRole('combobox', { name: /tag/i });
    await user.selectOptions(tagSelect, 'JavaScript');

    expect(handleTagChange).toHaveBeenCalledWith('JavaScript');
  });

  it('calls onStatusChange when user selects a status', async () => {
    const handleStatusChange = vi.fn();
    const user = userEvent.setup();

    render(<BookFilters {...defaultProps} onStatusChange={handleStatusChange} />);

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    await user.selectOptions(statusSelect, 'OUT_OF_STOCK');

    expect(handleStatusChange).toHaveBeenCalledWith('OUT_OF_STOCK');
  });

  it('calls onClearFilters when user clicks Clear filters button', async () => {
    const handleClearFilters = vi.fn();
    const user = userEvent.setup();

    render(<BookFilters {...defaultProps} onClearFilters={handleClearFilters} />);

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    await user.click(clearButton);

    expect(handleClearFilters).toHaveBeenCalledTimes(1);
  });
});
