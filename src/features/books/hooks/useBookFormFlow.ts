import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useSetBreadcrumbDetailLabel } from '../../../components/layout/BreadcrumbContext';
import {
  BOOK_FORM_MODE,
  LOAN_STATUS,
  type BookFormMode,
  type CreateBookPayload,
  type UpdateBookPayload,
} from '../types/book';
import type { BookFormValues } from '../types/bookSchema';
import { generateDefaultIsbn } from '../utils/isbn';
import { resolveBookStatus } from '../utils/bookStock';
import { useBook } from './useBook';
import { useBookLoans } from './useBookLoans';
import { useCreateBook } from './useCreateBook';
import { useUpdateBook } from './useUpdateBook';

interface UseBookFormFlowOptions {
  mode: BookFormMode;
  bookId?: string;
}

export function useBookFormFlow({ mode, bookId }: UseBookFormFlowOptions) {
  const location = useLocation();
  const navigate = useNavigate();

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

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<BookFormValues | null>(null);

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

  const pageTitle = isEditMode ? 'Edit book' : 'Add book';

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

  function handleFormSubmit(values: BookFormValues) {
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
    const nextStatus = resolveBookStatus(pendingValues.totalCopies, 0);

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
    const nextStatus = resolveBookStatus(pendingValues.totalCopies, resolvedOnLoan);

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

  function handleCloseConfirm() {
    if (createBookMutation.isPending || updateBookMutation.isPending) {
      return;
    }
    setIsConfirmOpen(false);
  }

  const isSubmitting = isEditMode
    ? updateBookMutation.isPending
    : createBookMutation.isPending;
  const submitError = isEditMode ? updateBookMutation.error : createBookMutation.error;

  return {
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
    isCreating: createBookMutation.isPending,
    isUpdating: updateBookMutation.isPending,
    handleRetryBook,
    handleCancel,
    handleFormSubmit,
    handleConfirmCreate,
    handleConfirmEdit,
    handleCloseConfirm,
  };
}
