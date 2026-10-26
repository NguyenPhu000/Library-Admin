import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from '../shared/components/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('does not render when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Confirm action"
        description="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders danger variant by default with warn styling and Deleting pending label', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete item?"
        description="This will permanently delete the item."
        confirmLabel="Delete"
        isPending={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Deleting...' })).toBeInTheDocument();
  });

  it('renders edit variant with edit color styling and Saving pending label', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const { rerender } = render(
      <ConfirmDialog
        isOpen={true}
        variant="edit"
        title="Save changes?"
        description="Your changes will be saved."
        confirmLabel="Save changes"
        isPending={false}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole('button', { name: 'Save changes' });
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toHaveClass('text-brand-600');
    expect(confirmButton).toHaveClass('bg-surface-tint');

    await user.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);

    rerender(
      <ConfirmDialog
        isOpen={true}
        variant="edit"
        title="Save changes?"
        description="Your changes will be saved."
        confirmLabel="Save changes"
        isPending={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    expect(within(dialog).getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
  });

  it('supports custom pendingLabel', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        variant="edit"
        title="Publishing item?"
        description="Are you sure?"
        pendingLabel="Publishing..."
        isPending={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Publishing...' })).toBeInTheDocument();
  });

  it('disables confirm button when isConfirmDisabled is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        variant="edit"
        title="Save changes?"
        description="Your changes will be saved."
        confirmLabel="Save changes"
        isConfirmDisabled={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });

  it('closes when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        variant="edit"
        title="Save changes?"
        description="Your changes will be saved."
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
