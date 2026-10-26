import type { ReactNode } from 'react';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';

interface CreateBookDialogProps {
  isOpen: boolean;
  bookTitle: string;
  totalCopies?: number;
  isCreating?: boolean;
  noticeMessage?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CreateBookDialog({
  isOpen,
  bookTitle,
  totalCopies,
  isCreating = false,
  noticeMessage,
  onConfirm,
  onCancel,
}: CreateBookDialogProps) {
  const defaultNotice =
    typeof totalCopies === 'number'
      ? `A new catalogue entry and initial stock of ${totalCopies} ${totalCopies === 1 ? 'copy' : 'copies'} will be registered.`
      : 'A new catalogue entry will be created and made immediately available in the library.';

  return (
    <ConfirmDialog
      isOpen={isOpen}
      variant="edit"
      title="Add this book to catalogue?"
      ariaLabel="Confirm create book"
      description={
        <p className="m-0">
          Are you sure you want to add “<strong className="font-semibold text-ink">{bookTitle}</strong>” to the library catalogue?
        </p>
      }
      confirmLabel="Create book"
      confirmAriaLabel="Create book"
      cancelLabel="Cancel"
      pendingLabel="Creating..."
      isPending={isCreating}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <div
        role="status"
        className="rounded-control border border-surface-tint-border bg-surface-tint px-4 py-3 text-sm font-medium text-brand-600"
      >
        {noticeMessage ?? defaultNotice}
      </div>
    </ConfirmDialog>
  );
}
