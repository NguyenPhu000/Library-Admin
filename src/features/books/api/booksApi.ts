import { apiClient } from '../../../shared/lib/apiClient';
import { buildQueryString } from '../../../shared/lib/buildQueryString';
import { ApiError, type PaginatedResponse } from '../../../shared/types/api';
import type {
  BookDetail,
  BookItem,
  BookListParams,
  CreateBookPayload,
  Loan,
  UpdateBookPayload,
} from '../types/book';

export async function getBooks(params?: BookListParams): Promise<PaginatedResponse<BookItem>> {
  const query = buildQueryString(params as Record<string, string | number | undefined>);
  return apiClient<PaginatedResponse<BookItem>>(`/books${query}`);
}

export async function getBookById(id: number): Promise<BookDetail> {
  return apiClient<BookDetail>(`/books/${id}`);
}

export async function getBookLoans(bookId: number): Promise<Loan[]> {
  const response = await apiClient<{ data: Loan[] } | Loan[]>(`/books/${bookId}/loans`);
  return Array.isArray(response) ? response : response.data;
}

export async function getTags(): Promise<string[]> {
  try {
    const response = await apiClient<{ data: string[] } | string[]>('/tags');
    return Array.isArray(response) ? response : response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function createBook(payload: CreateBookPayload): Promise<BookItem> {
  return apiClient<BookItem>('/books', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateBook(id: number, payload: UpdateBookPayload): Promise<BookItem> {
  return apiClient<BookItem>(`/books/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteBook(id: number): Promise<void> {
  return apiClient<void>(`/books/${id}`, {
    method: 'DELETE',
  });
}
