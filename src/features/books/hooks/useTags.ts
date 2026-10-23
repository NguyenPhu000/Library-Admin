import { useQuery } from '@tanstack/react-query';

import { getTags } from '../api/booksApi';
import { booksKeys } from '../api/booksKeys';

export function useTags() {
  return useQuery({
    queryKey: booksKeys.tags(),
    queryFn: getTags,
  });
}
