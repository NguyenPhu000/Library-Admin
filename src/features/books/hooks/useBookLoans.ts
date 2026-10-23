import { useQuery } from '@tanstack/react-query';

import { getBookLoans } from '../api/booksApi';
import { booksKeys } from '../api/booksKeys';

export function useBookLoans(bookId: number) {
  return useQuery({
    queryKey: booksKeys.loans(bookId),
    queryFn: () => getBookLoans(bookId),
    enabled: Number.isInteger(bookId) && bookId > 0,
  });
}
