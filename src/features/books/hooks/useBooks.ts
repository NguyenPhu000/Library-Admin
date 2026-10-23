import { useQuery } from '@tanstack/react-query';

import { getBooks } from '../api/booksApi';
import { booksKeys } from '../api/booksKeys';
import type { BookListParams } from '../types/book';

export function useBooks(params?: BookListParams) {
  return useQuery({
    queryKey: booksKeys.list(params),
    queryFn: () => getBooks(params),
  });
}
