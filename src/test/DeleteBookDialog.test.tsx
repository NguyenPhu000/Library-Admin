import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  BOOK_HAS_ACTIVE_LOANS_CODE,
  DeleteBookDialog,
} from '../features/books/components/DeleteBookDialog';
import { ApiError } from '../shared/types/api';

describe('DeleteBookDialog', () => {
  it('does not render when isOpen is false', () => {
    render(
      <DeleteBookDialog
        isOpen={false}
        bookTitle="Clean Code"
        isDeleting={false}
        error={null}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog with book title and triggers onConfirm and onCancel', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <DeleteBookDialog
        isOpen={true}
        bookTitle="Refactoring"
        isDeleting={false}
        error={null}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Delete book' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Refactoring')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);

    await user.click(within(dialog).getByRole('button', { name: 'Delete book' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('displays formatted 409 BOOK_HAS_ACTIVE_LOANS error alert inside the dialog', () => {
    const conflictError = new ApiError(409, {
      code: BOOK_HAS_ACTIVE_LOANS_CODE,
      message: 'Cannot delete book while copies are on loan',
      details: { activeLoansCount: 3 },
    });

    render(
      <DeleteBookDialog
        isOpen={true}
        bookTitle="The Pragmatic Programmer"
        isDeleting={false}
        error={conflictError}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Delete book' });
    const alert = within(dialog).getByRole('alert');
    expect(alert).toHaveTextContent('Cannot delete book while 3 copies are currently on loan');
  });
});
