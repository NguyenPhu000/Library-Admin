import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useBookFormFlow } from '../features/books/hooks/useBookFormFlow';
import { BOOK_FORM_MODE } from '../features/books/types/book';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <MemoryRouter initialEntries={['/books/2/edit']}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MemoryRouter>
    );
  };
}

describe('useBookFormFlow', () => {
  it('initializes in create mode with blank defaults and correct page title', () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
      <MemoryRouter initialEntries={['/books/new']}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => useBookFormFlow({ mode: BOOK_FORM_MODE.CREATE }),
      { wrapper },
    );

    expect(result.current.isEditMode).toBe(false);
    expect(result.current.pageTitle).toBe('Add book');
    expect(result.current.defaultValues).toBeUndefined();
    expect(result.current.isConfirmOpen).toBe(false);
  });

  it('prefills existing book data and computes onLoan in edit mode', async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useBookFormFlow({ mode: BOOK_FORM_MODE.EDIT, bookId: '2' }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isBookLoading).toBe(false);
    });

    expect(result.current.isEditMode).toBe(true);
    expect(result.current.pageTitle).toBe('Edit book');
    expect(result.current.book?.title).toBe('The Pragmatic Programmer');
    expect(result.current.resolvedOnLoan).toBe(3);
    expect(result.current.defaultValues?.title).toBe('The Pragmatic Programmer');
    expect(result.current.defaultValues?.totalCopies).toBe(5);
  });

  it('opens confirmation modal and captures pending values when handleFormSubmit is invoked', async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useBookFormFlow({ mode: BOOK_FORM_MODE.EDIT, bookId: '2' }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.book).toBeDefined();
    });

    act(() => {
      result.current.handleFormSubmit({
        title: 'New Book Title',
        author: 'Author Name',
        publishedYear: 2024,
        totalCopies: 6,
        tags: ['Programming'],
        description: 'New Description',
      });
    });

    expect(result.current.isConfirmOpen).toBe(true);
    expect(result.current.pendingValues?.title).toBe('New Book Title');

    act(() => {
      result.current.handleCloseConfirm();
    });

    expect(result.current.isConfirmOpen).toBe(false);
  });
});
