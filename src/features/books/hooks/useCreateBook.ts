import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBook } from '../api/booksApi';
import { booksKeys } from '../api/booksKeys';
import type { CreateBookPayload } from '../types/book';

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookPayload) => createBook(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: booksKeys.tags() });
    },
  });
}
