import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CreateBookDialog } from '../features/books/components/CreateBookDialog';

describe('CreateBookDialog', () => {
  it('does not render when isOpen is false', () => {
    render(
      <CreateBookDialog
        isOpen={false}
        bookTitle="Refactoring UI"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders create dialog with title, book title, and triggers onConfirm and onCancel', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <CreateBookDialog
        isOpen={true}
        bookTitle="Refactoring UI"
        totalCopies={4}
        isCreating={false}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Confirm create book' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Refactoring UI')).toBeInTheDocument();

    const notice = within(dialog).getByRole('status');
    expect(notice).toHaveTextContent('initial stock of 4 copies will be registered');

    const createButton = within(dialog).getByRole('button', { name: 'Create book' });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveClass('text-brand-600');

    await user.click(createButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders custom notice message when provided', () => {
    render(
      <CreateBookDialog
        isOpen={true}
        bookTitle="Refactoring UI"
        noticeMessage="Custom creation warning or info note."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Confirm create book' });
    expect(within(dialog).getByRole('status')).toHaveTextContent(
      'Custom creation warning or info note.',
    );
  });

  it('shows Creating... when isCreating is true', () => {
    render(
      <CreateBookDialog
        isOpen={true}
        bookTitle="Refactoring UI"
        isCreating={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Confirm create book' });
    expect(within(dialog).getByRole('button', { name: 'Creating...' })).toBeInTheDocument();
  });
});
