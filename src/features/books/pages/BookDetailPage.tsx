import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { useSetBreadcrumbDetailLabel } from '../../../components/layout/BreadcrumbContext';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { BookInformationCard } from '../components/BookInformationCard';
import { DeleteBookDialog } from '../components/DeleteBookDialog';
import { LoanHistoryTable } from '../components/LoanHistoryTable';
import { StockBadge } from '../components/StockBadge';
import { StockCard } from '../components/StockCard';
import { TagBadge } from '../components/TagBadge';
import { useBook } from '../hooks/useBook';
import { useBookLoans } from '../hooks/useBookLoans';
import { useDeleteBook } from '../hooks/useDeleteBook';
import { LOAN_STATUS, type BookDetail } from '../types/book';
import { calculateAvailableCopies } from '../utils/bookStock';

export function BookDetailPage() {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const parsedId = Number(bookId);
  const isValidId = Boolean(bookId) && Number.isInteger(parsedId) && parsedId > 0;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: book, isLoading, isError, error, refetch } = useBook(parsedId);
  const {
    data: loans = [],
    isLoading: isLoansLoading,
    isError: isLoansError,
    error: loansError,
    refetch: refetchLoans,
  } = useBookLoans(parsedId);
  const deleteBookMutation = useDeleteBook();

  useSetBreadcrumbDetailLabel(book?.title);

  const overdueCount = useMemo(
    () => loans.filter((loan) => loan.status === LOAN_STATUS.OVERDUE).length,
    [loans],
  );

  const resolvedBook = useMemo<BookDetail | undefined>(() => {
    if (!book) {
      return undefined;
    }
    const activeLoansCount = loans.filter(
      (loan) => loan.status === LOAN_STATUS.ACTIVE || loan.status === LOAN_STATUS.OVERDUE,
    ).length;
    const onLoan = typeof book.onLoan === 'number' ? book.onLoan : activeLoansCount;
    const available =
      typeof book.available === 'number'
        ? book.available
        : calculateAvailableCopies(book.totalCopies, onLoan);

    return {
      ...book,
      onLoan,
      available,
    };
  }, [book, loans]);

  function handleRetryBook() {
    void refetch();
  }

  function handleRetryLoans() {
    void refetchLoans();
  }

  function handleOpenDeleteDialog() {
    deleteBookMutation.reset();
    setIsDeleteDialogOpen(true);
  }

  function handleCloseDeleteDialog() {
    if (deleteBookMutation.isPending) {
      return;
    }
    deleteBookMutation.reset();
    setIsDeleteDialogOpen(false);
  }

  function handleConfirmDelete() {
    if (!resolvedBook || resolvedBook.onLoan > 0) {
      return;
    }
    deleteBookMutation.mutate(resolvedBook.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        void navigate('/books');
      },
    });
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <Link
          to="/books"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 no-underline transition-colors hover:text-night-700 hover:underline"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="fill-none stroke-current stroke-[2.25] [stroke-linecap:round] [stroke-linejoin:round]"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to books
        </Link>
      </div>

      {!isValidId && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface p-11 text-center text-ink"
        >
          <p className="m-0 font-medium">Invalid book ID.</p>
        </div>
      )}

      {isValidId && isLoading && (
        <LoadingState label="Loading book details..." variant="detail" />
      )}

      {isValidId && isError && (
        <ErrorState
          title="Couldn't load book details"
          error={error}
          message={error instanceof Error ? error.message : 'Failed to load book details'}
          retryLabel="Retry"
          onRetry={handleRetryBook}
        />
      )}

      {isValidId && !isLoading && !isError && resolvedBook && (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1
                id="book-detail-heading"
                className="m-0 font-display text-[32px] font-extrabold leading-[1.1] text-ink"
              >
                {resolvedBook.title}
              </h1>
              <p className="m-0 text-sm text-ink-muted">
                {resolvedBook.author} · {resolvedBook.publishedYear}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {resolvedBook.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
                <StockBadge status={resolvedBook.status} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/books/${resolvedBook.id}/edit`}
                state={{ from: `/books/${resolvedBook.id}` }}
                className="inline-flex min-h-11 items-center gap-2 rounded-control border border-surface-tint-border bg-surface-tint px-4 font-semibold text-brand-600 no-underline transition-colors hover:bg-surface-row-alt hover:text-night-700"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Edit
              </Link>
              <button
                type="button"
                onClick={handleOpenDeleteDialog}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-control border border-warn-border bg-warn-surface px-4 font-semibold text-warn-ink transition-colors hover:opacity-90"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr]">
            <BookInformationCard book={resolvedBook} />
            <StockCard book={resolvedBook} overdueCount={overdueCount} />
          </div>

          <LoanHistoryTable
            loans={loans}
            isLoading={isLoansLoading}
            isError={isLoansError}
            error={loansError}
            errorMessage={
              loansError instanceof Error ? loansError.message : 'Failed to load loan history'
            }
            onRetry={handleRetryLoans}
          />

          <DeleteBookDialog
            isOpen={isDeleteDialogOpen}
            bookTitle={resolvedBook.title}
            activeLoansCount={resolvedBook.onLoan}
            isDeleting={deleteBookMutation.isPending}
            error={deleteBookMutation.error}
            onConfirm={handleConfirmDelete}
            onCancel={handleCloseDeleteDialog}
          />
        </>
      )}
    </div>
  );
}
