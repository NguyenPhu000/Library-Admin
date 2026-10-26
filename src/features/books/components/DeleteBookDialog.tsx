import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { API_ERROR_CODE, ApiError } from '../../../shared/types/api';

export const BOOK_HAS_ACTIVE_LOANS_CODE = API_ERROR_CODE.BOOK_HAS_ACTIVE_LOANS;

interface DeleteBookDialogProps {
  isOpen: boolean;
  bookTitle: string;
  activeLoansCount?: number;
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
      if (typeof activeLoansCount === 'number' && activeLoansCount > 0) {
        const copyLabel = activeLoansCount === 1 ? 'copy is' : 'copies are';
        const pronoun = activeLoansCount === 1 ? 'it' : 'them';
        return `${activeLoansCount} ${copyLabel} on loan. Return ${pronoun} before deleting.`;
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
  activeLoansCount = 0,
  isDeleting,
  error,
  onConfirm,
  onCancel,
}: DeleteBookDialogProps) {
  const errorMessage = resolveDeleteErrorMessage(error);
  const hasActiveLoans = activeLoansCount > 0;
  const copyLabel = activeLoansCount === 1 ? 'copy is' : 'copies are';
  const pronoun = activeLoansCount === 1 ? 'it' : 'them';
  const activeLoansWarning = hasActiveLoans
    ? `${activeLoansCount} ${copyLabel} on loan. Return ${pronoun} before deleting.`
    : null;

  const warningMessage = errorMessage || activeLoansWarning;
  const isConfirmDisabled = hasActiveLoans || isDeleting;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete this book?"
      ariaLabel="Delete book"
      description={
        <p className="m-0">
          “<strong className="font-semibold text-ink">{bookTitle}</strong>” and its loan history will be removed. This cannot be undone.
        </p>
      }
      confirmLabel="Delete"
      confirmAriaLabel="Delete book"
      cancelLabel="Cancel"
      isPending={isDeleting}
      isConfirmDisabled={isConfirmDisabled}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {warningMessage && (
        <div
          role="alert"
          className="rounded-control border border-warn-border bg-warn-surface px-4 py-3 text-sm font-medium text-warn-ink"
        >
          {warningMessage}
        </div>
      )}
    </ConfirmDialog>
  );
}
