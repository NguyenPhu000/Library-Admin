import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { ApiError } from '../../../shared/types/api';

export const BOOK_HAS_ACTIVE_LOANS_CODE = 'BOOK_HAS_ACTIVE_LOANS';

interface DeleteBookDialogProps {
  isOpen: boolean;
  bookTitle: string;
  isDeleting: boolean;
  error: unknown;
  onConfirm: () => void;
  onCancel: () => void;
}

function resolveDeleteErrorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }

  if (error instanceof ApiError) {
    if (error.code === BOOK_HAS_ACTIVE_LOANS_CODE) {
      const activeLoansCount = error.details?.activeLoansCount;
      if (
        typeof activeLoansCount === 'number' &&
        activeLoansCount > 0 &&
        !error.message.includes(String(activeLoansCount))
      ) {
        const copyLabel = activeLoansCount === 1 ? 'copy is' : 'copies are';
        return `Cannot delete book while ${activeLoansCount} ${copyLabel} currently on loan`;
      }
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Failed to delete book. Please try again.';
}

export function DeleteBookDialog({
  isOpen,
  bookTitle,
  isDeleting,
  error,
  onConfirm,
  onCancel,
}: DeleteBookDialogProps) {
  const errorMessage = resolveDeleteErrorMessage(error);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete book"
      description={
        <p className="m-0">
          Are you sure you want to delete <strong className="font-semibold text-ink">{bookTitle}</strong>? This action cannot be undone.
        </p>
      }
      confirmLabel="Delete book"
      cancelLabel="Cancel"
      isPending={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {errorMessage && (
        <div
          role="alert"
          className="rounded-control border border-warn-border bg-warn-surface px-3.5 py-2.5 text-sm font-medium text-warn-ink"
        >
          {errorMessage}
        </div>
      )}
    </ConfirmDialog>
  );
}
