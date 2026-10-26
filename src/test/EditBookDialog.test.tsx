import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { EditBookDialog } from '../features/books/components/EditBookDialog';

describe('EditBookDialog', () => {
  it('does not render when isOpen is false', () => {
    render(
      <EditBookDialog
        isOpen={false}
        bookTitle="Refactoring"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders edit dialog with title, description, and triggers onConfirm and onCancel', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <EditBookDialog
        isOpen={true}
        bookTitle="The Pragmatic Programmer"
        isSaving={false}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Confirm edit book' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('The Pragmatic Programmer')).toBeInTheDocument();

    const saveButton = within(dialog).getByRole('button', { name: 'Save changes' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveClass('text-brand-600');

    await user.click(saveButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders optional notice message in edit tint callout', () => {
    render(
      <EditBookDialog
        isOpen={true}
        bookTitle="Clean Architecture"
        noticeMessage="Updating stock will notify 2 queued members."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Confirm edit book' });
    const notice = within(dialog).getByRole('status');
    expect(notice).toHaveTextContent('Updating stock will notify 2 queued members.');
    expect(notice).toHaveClass('bg-surface-tint');
    expect(notice).toHaveClass('text-brand-600');
  });

  it('shows Saving... when isSaving is true', () => {
    render(
      <EditBookDialog
        isOpen={true}
        bookTitle="Clean Architecture"
        isSaving={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Confirm edit book' });
    expect(within(dialog).getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
  });
});
