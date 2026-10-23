import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useSetBreadcrumbDetailLabel } from '../../../components/layout/BreadcrumbContext';
import { BookForm } from '../components/BookForm';
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
    if (isEditMode && isValidId) {
      void navigate(`/books/${parsedId}`);
      return;
    }
    void navigate('/books');
  }

  function handleSubmit(values: BookFormValues) {
    const availableCopies = values.totalCopies - (isEditMode ? resolvedOnLoan : 0);
    const nextStatus =
      availableCopies > 0 ? BOOK_STATUS.AVAILABLE : BOOK_STATUS.OUT_OF_STOCK;

    if (isEditMode) {
      if (!isValidId) {
        return;
      }
      const payload: UpdateBookPayload = {
        title: values.title,
        author: values.author,
        publishedYear: values.publishedYear,
        totalCopies: values.totalCopies,
        tags: values.tags,
        description: values.description ? values.description : null,
        status: nextStatus,
      };

      updateBookMutation.mutate(
        { id: parsedId, payload },
        {
          onSuccess: () => {
            void navigate(`/books/${parsedId}`);
          },
        },
      );
      return;
    }

    const payload: CreateBookPayload = {
      title: values.title,
      author: values.author,
      isbn: generateDefaultIsbn(),
      publishedYear: values.publishedYear,
      totalCopies: values.totalCopies,
      tags: values.tags,
      description: values.description ? values.description : null,
      status: nextStatus,
    };

    createBookMutation.mutate(payload, {
      onSuccess: (createdBook) => {
        void navigate(`/books/${createdBook.id}`);
      },
    });
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
        <div
          role="status"
          aria-busy="true"
          className="flex max-w-[780px] flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface p-11 text-center text-ink-muted"
        >
          <p className="m-0">Loading book details...</p>
        </div>
      )}

      {isEditMode && isValidId && isBookError && (
        <div
          role="alert"
          className="flex max-w-[780px] flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface p-11 text-center text-ink"
        >
          <p className="m-0">
            {bookError instanceof Error ? bookError.message : 'Failed to load book details'}
          </p>
          <button
            type="button"
            onClick={handleRetryBook}
            className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-control border border-border bg-surface px-4 font-semibold text-ink transition-colors hover:bg-surface-row-alt"
          >
            Retry
          </button>
        </div>
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
    </section>
  );
}
