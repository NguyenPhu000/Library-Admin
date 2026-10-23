import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteBook } from '../api/booksApi';
import { booksKeys } from '../api/booksKeys';

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: booksKeys.detail(id) });
      queryClient.removeQueries({ queryKey: booksKeys.loans(id) });
      void queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
    },
  });
}
