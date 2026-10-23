import { useQuery } from '@tanstack/react-query';

import { getBookById } from '../api/booksApi';
import { booksKeys } from '../api/booksKeys';

export function useBook(id: number) {
  return useQuery({
    queryKey: booksKeys.detail(id),
    queryFn: () => getBookById(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}
