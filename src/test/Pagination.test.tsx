import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from '../features/books/components/Pagination';

describe('Pagination', () => {
  const defaultProps = {
    page: 1,
    pageSize: 10,
    total: 25,
    onPageChange: vi.fn(),
  };

  it('renders summary text with correct item range and total count', () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText('Showing 1–10 of 25 books')).toBeInTheDocument();
  });

  it('calculates range accurately for middle and last page', () => {
    const { rerender } = render(<Pagination {...defaultProps} page={2} />);
    expect(screen.getByText('Showing 11–20 of 25 books')).toBeInTheDocument();

    rerender(<Pagination {...defaultProps} page={3} />);
    expect(screen.getByText('Showing 21–25 of 25 books')).toBeInTheDocument();
  });

  it('handles empty total gracefully (Showing 0–0 of 0 books)', () => {
    render(<Pagination {...defaultProps} total={0} />);

    expect(screen.getByText('Showing 0–0 of 0 books')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('disables Previous button on page 1 and enables Next button', () => {
    render(<Pagination {...defaultProps} page={1} />);

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();
  });

  it('disables Next button on last page and enables Previous button', () => {
    render(<Pagination {...defaultProps} page={3} />);

    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('marks current page with aria-current="page"', () => {
    render(<Pagination {...defaultProps} page={2} />);

    const page2Button = screen.getByRole('button', { name: 'Page 2' });
    expect(page2Button).toHaveAttribute('aria-current', 'page');

    const page1Button = screen.getByRole('button', { name: 'Page 1' });
    expect(page1Button).not.toHaveAttribute('aria-current');
  });

  it('calls onPageChange with page + 1 when Next is clicked', async () => {
    const handlePageChange = vi.fn();
    const user = userEvent.setup();

    render(<Pagination {...defaultProps} page={1} onPageChange={handlePageChange} />);

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with page - 1 when Previous is clicked', async () => {
    const handlePageChange = vi.fn();
    const user = userEvent.setup();

    render(<Pagination {...defaultProps} page={2} onPageChange={handlePageChange} />);

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with page number when a page number button is clicked', async () => {
    const handlePageChange = vi.fn();
    const user = userEvent.setup();

    render(<Pagination {...defaultProps} page={1} onPageChange={handlePageChange} />);

    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });
});
