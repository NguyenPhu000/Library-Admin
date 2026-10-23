import { apiClient } from '../../../shared/lib/apiClient';
import { buildQueryString } from '../../../shared/lib/buildQueryString';
import type { PaginatedResponse } from '../../../shared/types/api';
import type { BookItem, BookListParams } from '../types/book';

export async function getBooks(params?: BookListParams): Promise<PaginatedResponse<BookItem>> {
  const query = buildQueryString(params as Record<string, string | number | undefined>);
  return apiClient<PaginatedResponse<BookItem>>(`/books${query}`);
}
