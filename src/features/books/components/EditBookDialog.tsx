import type { ReactNode } from 'react';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';

interface EditBookDialogProps {
  isOpen: boolean;
  bookTitle: string;
  isSaving?: boolean;
  noticeMessage?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EditBookDialog({
  isOpen,
  bookTitle,
  isSaving = false,
  noticeMessage,
  onConfirm,
  onCancel,
}: EditBookDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      variant="edit"
      title="Save changes to this book?"
      ariaLabel="Confirm edit book"
      description={
        <p className="m-0">
          Are you sure you want to update “<strong className="font-semibold text-ink">{bookTitle}</strong>”? The new details and stock allocation will be saved.
        </p>
      }
      confirmLabel="Save changes"
      confirmAriaLabel="Save changes"
      cancelLabel="Cancel"
      pendingLabel="Saving..."
      isPending={isSaving}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {noticeMessage && (
        <div
          role="status"
          className="rounded-control border border-surface-tint-border bg-surface-tint px-4 py-3 text-sm font-medium text-brand-600"
        >
          {noticeMessage}
        </div>
      )}
    </ConfirmDialog>
  );
}
