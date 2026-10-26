import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { booksKeys } from '../features/books/api/booksKeys';
import { useBook } from '../features/books/hooks/useBook';
import { useBooks } from '../features/books/hooks/useBooks';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useBooks and useBook hooks', () => {
  it('useBooks uses the right query key and fetches books list', async () => {
    const params = { page: 1, limit: 10, q: 'Clean Code' };
    const expectedKey = booksKeys.list(params);

    const { result } = renderHook(() => useBooks(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(expectedKey).toEqual(['books', 'list', params]);
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data?.[0]?.title).toBe('Clean Code');
  });

  it('useBook uses the right query key and fetches a single book detail', async () => {
    const expectedKey = booksKeys.detail(2);

    const { result } = renderHook(() => useBook(2), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(expectedKey).toEqual(['books', 'detail', 2]);
    expect(result.current.data?.title).toBe('The Pragmatic Programmer');
  });
});
