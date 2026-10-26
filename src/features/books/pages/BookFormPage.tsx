import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import { useSetBreadcrumbDetailLabel } from '../../../components/layout/BreadcrumbContext';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { BookForm } from '../components/BookForm';
import { CreateBookDialog } from '../components/CreateBookDialog';
import { EditBookDialog } from '../components/EditBookDialog';
import { useBook } from '../hooks/useBook';
import { useBookLoans } from '../hooks/useBookLoans';
import { useCreateBook } from '../hooks/useCreateBook';
import { useUpdateBook } from '../hooks/useUpdateBook';
import {
  BOOK_FORM_MODE,
  BOOK_STATUS,
  LOAN_STATUS,
  type BookFormMode,
  type CreateBookPayload,
  type UpdateBookPayload,
} from '../types/book';
import type { BookFormValues } from '../types/bookSchema';

interface BookFormPageProps {
  mode: BookFormMode;
}

const ISBN_PREFIX = '978-0';
const ISBN_RANDOM_DIGITS_LENGTH = 9;

function generateDefaultIsbn(): string {
  const digits = String(Date.now())
    .slice(-ISBN_RANDOM_DIGITS_LENGTH)
    .padStart(ISBN_RANDOM_DIGITS_LENGTH, '0');
  return `${ISBN_PREFIX}-${digits.slice(0, 2)}-${digits.slice(2, 8)}-${digits.slice(8)}`;
}

export function BookFormPage({ mode }: BookFormPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();

  const isEditMode = mode === BOOK_FORM_MODE.EDIT;
  const parsedId = Number(bookId);
  const isValidId = !isEditMode || (Boolean(bookId) && Number.isInteger(parsedId) && parsedId > 0);

  const {
    data: book,
    isLoading: isBookLoading,
    isError: isBookError,
    error: bookError,
    refetch: refetchBook,
  } = useBook(isEditMode && isValidId ? parsedId : 0);

  const { data: loans = [] } = useBookLoans(isEditMode && isValidId ? parsedId : 0);

  useSetBreadcrumbDetailLabel(isEditMode ? book?.title : undefined);

  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();

  const resolvedOnLoan = useMemo(() => {
    if (!isEditMode || !book) {
      return 0;
    }
    if (typeof book.onLoan === 'number') {
      return book.onLoan;
    }
    return loans.filter(
      (loan) => loan.status === LOAN_STATUS.ACTIVE || loan.status === LOAN_STATUS.OVERDUE,
    ).length;
  }, [book, isEditMode, loans]);

  const defaultValues = useMemo<Partial<BookFormValues> | undefined>(() => {
    if (!isEditMode || !book) {
      return undefined;
    }
    return {
      title: book.title,
      author: book.author,
      publishedYear: book.publishedYear,
      totalCopies: book.totalCopies,
      tags: book.tags,
      description: book.description ?? '',
    };
  }, [book, isEditMode]);

  const title = isEditMode ? 'Edit book' : 'Add book';

  function handleRetryBook() {
    void refetchBook();
  }

  function handleCancel() {
    const fromPath = (location.state as { from?: string } | null)?.from;
    if (fromPath) {
      void navigate(fromPath);
      return;
    }

    if (
      typeof window !== 'undefined' &&
      window.history.state &&
      typeof window.history.state.idx === 'number' &&
      window.history.state.idx > 0
    ) {
      navigate(-1);
      return;
    }

    if (isEditMode && isValidId) {
      void navigate(`/books/${parsedId}`);
      return;
    }
    void navigate('/books');
  }

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<BookFormValues | null>(null);

  function handleSubmit(values: BookFormValues) {
    if (isEditMode && !isValidId) {
      return;
    }
    setPendingValues(values);
    setIsConfirmOpen(true);
  }

  function handleConfirmCreate() {
    if (!pendingValues) {
      return;
    }
    const availableCopies = pendingValues.totalCopies;
    const nextStatus =
      availableCopies > 0 ? BOOK_STATUS.AVAILABLE : BOOK_STATUS.OUT_OF_STOCK;

    const payload: CreateBookPayload = {
      title: pendingValues.title,
      author: pendingValues.author,
      isbn: generateDefaultIsbn(),
      publishedYear: pendingValues.publishedYear,
      totalCopies: pendingValues.totalCopies,
      tags: pendingValues.tags,
      description: pendingValues.description ? pendingValues.description : null,
      status: nextStatus,
    };

    createBookMutation.mutate(payload, {
      onSuccess: (createdBook) => {
        setIsConfirmOpen(false);
        void navigate(`/books/${createdBook.id}`);
      },
      onError: () => {
        setIsConfirmOpen(false);
      },
    });
  }

  function handleConfirmEdit() {
    if (!pendingValues || !isValidId) {
      return;
    }
    const availableCopies = pendingValues.totalCopies - resolvedOnLoan;
    const nextStatus =
      availableCopies > 0 ? BOOK_STATUS.AVAILABLE : BOOK_STATUS.OUT_OF_STOCK;

    const payload: UpdateBookPayload = {
      title: pendingValues.title,
      author: pendingValues.author,
      publishedYear: pendingValues.publishedYear,
      totalCopies: pendingValues.totalCopies,
      tags: pendingValues.tags,
      description: pendingValues.description ? pendingValues.description : null,
      status: nextStatus,
    };

    updateBookMutation.mutate(
      { id: parsedId, payload },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          void navigate(`/books/${parsedId}`);
        },
        onError: () => {
          setIsConfirmOpen(false);
        },
      },
    );
  }

  const isSubmitting = isEditMode
    ? updateBookMutation.isPending
    : createBookMutation.isPending;
  const submitError = isEditMode ? updateBookMutation.error : createBookMutation.error;

  return (
    <section aria-labelledby="book-form-heading" className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1
          id="book-form-heading"
          className="m-0 font-display text-[32px] font-extrabold leading-[1.1] text-ink"
        >
          {title}
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
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!isEditMode && (
        <CreateBookDialog
          isOpen={isConfirmOpen}
          bookTitle={pendingValues?.title || ''}
          totalCopies={pendingValues?.totalCopies}
          isCreating={createBookMutation.isPending}
          onConfirm={handleConfirmCreate}
          onCancel={() => {
            if (!createBookMutation.isPending) {
              setIsConfirmOpen(false);
            }
          }}
        />
      )}

      {isEditMode && book && (
        <EditBookDialog
          isOpen={isConfirmOpen}
          bookTitle={pendingValues?.title || book.title}
          isSaving={updateBookMutation.isPending}
          noticeMessage="Updating this book will immediately sync stock and details across the library catalogue."
          onConfirm={handleConfirmEdit}
          onCancel={() => {
            if (!updateBookMutation.isPending) {
              setIsConfirmOpen(false);
            }
          }}
        />
      )}
    </section>
  );
}
