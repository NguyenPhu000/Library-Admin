import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateBook } from '../api/booksApi';
import { booksKeys } from '../api/booksKeys';
import type { UpdateBookPayload } from '../types/book';

export interface UpdateBookVariables {
  id: number;
  payload: UpdateBookPayload;
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateBookVariables) => updateBook(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: booksKeys.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: booksKeys.tags() });
    },
  });
}
