import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BookForm } from '../features/books/components/BookForm';

const FORM_TEST_TIMEOUT_MS = 15_000;

describe('BookForm', { timeout: FORM_TEST_TIMEOUT_MS }, () => {
  it('renders required fields, helper texts, and action buttons', () => {
    render(<BookForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();

    expect(screen.getByText('Total copies the library owns')).toBeInTheDocument();
    expect(screen.getByText('Up to 5 tags')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save book' })).toBeInTheDocument();
  });

  it('shows validation errors next to fields when submitted with invalid values including year out of range', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<BookForm onSubmit={handleSubmit} onCancel={vi.fn()} />);

    const yearInput = screen.getByLabelText(/year/i);
    await user.clear(yearInput);
    await user.type(yearInput, '3019');

    await user.click(screen.getByRole('button', { name: 'Save book' }));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Author is required')).toBeInTheDocument();
    expect(screen.getByText('Year must be between 1450 and 2026')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('allows adding and removing tags with Enter and enforces up to 5 tags', async () => {
    const user = userEvent.setup();
    render(<BookForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    const tagInput = screen.getByLabelText(/tags/i);

    await user.type(tagInput, 'Programming{Enter}');
    await user.type(tagInput, 'Career{Enter}');

    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('Career')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove Programming' }));
    expect(screen.queryByText('Programming')).not.toBeInTheDocument();

    await user.type(tagInput, 'Tag2{Enter}Tag3{Enter}Tag4{Enter}Tag5{Enter}Tag6{Enter}');
    expect(await screen.findByText('Up to 5 tags allowed')).toBeInTheDocument();
  });

  it('validates that stock cannot be less than copies currently on loan in edit mode', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <BookForm
        mode="edit"
        onLoan={3}
        defaultValues={{
          title: 'The Pragmatic Programmer',
          author: 'David Thomas, Andrew Hunt',
          publishedYear: 2019,
          totalCopies: 5,
          tags: ['Programming'],
          description: 'Mastery in software development.',
        }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />,
    );

    const stockInput = screen.getByLabelText(/stock/i);
    await user.clear(stockInput);
    await user.type(stockInput, '2');

    await user.click(screen.getByRole('button', { name: 'Save book' }));

    expect(
      await screen.findByText('Stock cannot be less than copies currently on loan (3)'),
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form values when all fields are valid', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<BookForm onSubmit={handleSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/title/i), 'Clean Architecture');
    await user.type(screen.getByLabelText(/author/i), 'Robert C. Martin');
    await user.type(screen.getByLabelText(/year/i), '2017');

    const stockInput = screen.getByLabelText(/stock/i);
    await user.clear(stockInput);
    await user.type(stockInput, '4');

    await user.type(screen.getByLabelText(/tags/i), 'Architecture{Enter}');
    await user.type(screen.getByLabelText(/description/i), 'A craftsman guide to software structure.');

    await user.click(screen.getByRole('button', { name: 'Save book' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      publishedYear: 2017,
      totalCopies: 4,
      tags: ['Architecture'],
      description: 'A craftsman guide to software structure.',
    });
  });
});
