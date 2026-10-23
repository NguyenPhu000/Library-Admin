import type { BookListParams } from '../types/book';

export const booksKeys = {
  all: ['books'] as const,
  lists: () => [...booksKeys.all, 'list'] as const,
  list: (params?: BookListParams) => [...booksKeys.lists(), params ?? {}] as const,
  details: () => [...booksKeys.all, 'detail'] as const,
  detail: (id: number) => [...booksKeys.details(), id] as const,
  loans: (id: number) => [...booksKeys.all, 'loans', id] as const,
  tags: () => [...booksKeys.all, 'tags'] as const,
};
