import { apiClient } from '../../../shared/lib/apiClient';
import { buildQueryString } from '../../../shared/lib/buildQueryString';
import type { PaginatedResponse } from '../../../shared/types/api';
import type { BookItem, BookListParams } from '../types/book';

export async function getBooks(params?: BookListParams): Promise<PaginatedResponse<BookItem>> {
  const query = buildQueryString(params as Record<string, string | number | undefined>);
  return apiClient<PaginatedResponse<BookItem>>(`/books${query}`);
}

export async function getTags(): Promise<string[]> {
  const response = await apiClient<{ data: string[] } | string[]>('/tags');
  return Array.isArray(response) ? response : response.data;
}

