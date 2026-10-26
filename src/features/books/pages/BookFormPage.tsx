import { useParams } from 'react-router';

import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { BookForm } from '../components/BookForm';
import { CreateBookDialog } from '../components/CreateBookDialog';
import { EditBookDialog } from '../components/EditBookDialog';
import { useBookFormFlow } from '../hooks/useBookFormFlow';
import type { BookFormMode } from '../types/book';

interface BookFormPageProps {
  mode: BookFormMode;
}

export function BookFormPage({ mode }: BookFormPageProps) {
  const { bookId } = useParams<{ bookId: string }>();

  const {
    isEditMode,
    isValidId,
    book,
    isBookLoading,
    isBookError,
    bookError,
    pageTitle,
    resolvedOnLoan,
    defaultValues,
    isSubmitting,
    submitError,
    isConfirmOpen,
    pendingValues,
    isCreating,
    isUpdating,
    handleRetryBook,
    handleCancel,
    handleFormSubmit,
    handleConfirmCreate,
    handleConfirmEdit,
    handleCloseConfirm,
  } = useBookFormFlow({ mode, bookId });

  return (
    <section aria-labelledby="book-form-heading" className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1
          id="book-form-heading"
          className="m-0 font-display text-[32px] font-extrabold leading-[1.1] text-ink"
        >
          {pageTitle}
        </h1>
        <p className="m-0 text-sm text-ink-muted">
          Fields marked * are required. The same form is used to edit a book.
        </p>
      </div>

      {!isValidId && (
        <div
          role="alert"
          className="flex max-w-[780px] flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface p-11 text-center text-ink"
        >
          <p className="m-0 font-medium">Invalid book ID.</p>
        </div>
      )}

      {isEditMode && isValidId && isBookLoading && (
        <LoadingState label="Loading book details..." variant="form" />
      )}

      {isEditMode && isValidId && isBookError && (
        <ErrorState
          title="Couldn't load book details"
          error={bookError}
          message={bookError instanceof Error ? bookError.message : 'Failed to load book details'}
          retryLabel="Retry"
          onRetry={handleRetryBook}
          className="max-w-[780px]"
        />
      )}

      {(!isEditMode || (isValidId && !isBookLoading && !isBookError && book)) && (
        <BookForm
          mode={mode}
          defaultValues={defaultValues}
          onLoan={resolvedOnLoan}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {!isEditMode && (
        <CreateBookDialog
          isOpen={isConfirmOpen}
          bookTitle={pendingValues?.title || ''}
          totalCopies={pendingValues?.totalCopies}
          isCreating={isCreating}
          onConfirm={handleConfirmCreate}
          onCancel={handleCloseConfirm}
        />
      )}

      {isEditMode && book && (
        <EditBookDialog
          isOpen={isConfirmOpen}
          bookTitle={pendingValues?.title || book.title}
          isSaving={isUpdating}
          noticeMessage="Updating this book will immediately sync stock and details across the library catalogue."
          onConfirm={handleConfirmEdit}
          onCancel={handleCloseConfirm}
        />
      )}
    </section>
  );
}
