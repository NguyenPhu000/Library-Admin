import { apiClient } from '../../../shared/lib/apiClient';
import { buildQueryString } from '../../../shared/lib/buildQueryString';
import { ApiError, type PaginatedResponse } from '../../../shared/types/api';
import {
  BOOK_STATUS,
  DEFAULT_PAGE_SIZE,
  type BookDetail,
  type BookItem,
  type BookListParams,
  type CreateBookPayload,
  type Loan,
  type UpdateBookPayload,
} from '../types/book';

function normalizeBookItem(raw: BookItem): BookItem {
  const totalCopies = typeof raw.totalCopies === 'number' ? raw.totalCopies : 0;
  const tags = Array.isArray(raw.tags) ? raw.tags.filter((t): t is string => typeof t === 'string') : [];
  const status =
    raw.status ?? (totalCopies > 0 ? BOOK_STATUS.AVAILABLE : BOOK_STATUS.OUT_OF_STOCK);

  return {
    ...raw,
    publisher: raw.publisher ?? null,
    edition: raw.edition ?? null,
    description: raw.description ?? null,
    totalCopies,
    tags,
    status,
  };
}

function normalizeBookDetail(raw: BookDetail | { data: BookDetail }): BookDetail {
  const unwrapped = 'data' in raw && raw.data && typeof raw.data === 'object' ? raw.data : (raw as BookDetail);
  const item = normalizeBookItem(unwrapped);
  const onLoan = typeof unwrapped.onLoan === 'number' ? unwrapped.onLoan : 0;
  const available =
    typeof unwrapped.available === 'number'
      ? unwrapped.available
      : Math.max(0, item.totalCopies - onLoan);

  return {
    ...item,
    onLoan,
    available,
  };
}

export async function getBooks(params?: BookListParams): Promise<PaginatedResponse<BookItem>> {
  const query = buildQueryString(params as Record<string, string | number | undefined>);
  const response = await apiClient<PaginatedResponse<BookItem> | BookItem[] | undefined>(
    `/books${query}`,
  );

  const requestedPage = params?.page ?? 1;
  const requestedLimit = params?.limit ?? DEFAULT_PAGE_SIZE;

  if (!response) {
    return {
      data: [],
      total: 0,
      page: requestedPage,
      limit: requestedLimit,
    };
  }

  if (Array.isArray(response)) {
    const normalizedItems = response.map(normalizeBookItem);
    return {
      data: normalizedItems,
      total: normalizedItems.length,
      page: requestedPage,
      limit: requestedLimit,
    };
  }

  const rawItems = Array.isArray(response.data) ? response.data : [];
  const normalizedItems = rawItems.map(normalizeBookItem);

  return {
    data: normalizedItems,
    total: typeof response.total === 'number' ? response.total : normalizedItems.length,
    page: typeof response.page === 'number' ? response.page : requestedPage,
    limit: typeof response.limit === 'number' ? response.limit : requestedLimit,
  };
}

export async function getBookById(id: number): Promise<BookDetail> {
  const response = await apiClient<BookDetail | { data: BookDetail }>(`/books/${id}`);
  return normalizeBookDetail(response);
}

export async function getBookLoans(bookId: number): Promise<Loan[]> {
  const response = await apiClient<{ data?: Loan[] | null } | Loan[] | undefined>(
    `/books/${bookId}/loans`,
  );
  if (!response) {
    return [];
  }
  if (Array.isArray(response)) {
    return response;
  }
  return Array.isArray(response.data) ? response.data : [];
}

export async function getTags(): Promise<string[]> {
  try {
    const response = await apiClient<{ data?: string[] | null } | string[] | undefined>('/tags');
    if (!response) {
      return [];
    }
    const rawTags = Array.isArray(response) ? response : response.data;
    return Array.isArray(rawTags) ? rawTags.filter((t): t is string => typeof t === 'string') : [];
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function createBook(payload: CreateBookPayload): Promise<BookItem> {
  const response = await apiClient<BookItem | { data: BookItem }>('/books', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const unwrapped =
    'data' in response && response.data && typeof response.data === 'object'
      ? response.data
      : (response as BookItem);
  return normalizeBookItem(unwrapped);
}

export async function updateBook(id: number, payload: UpdateBookPayload): Promise<BookItem> {
  const response = await apiClient<BookItem | { data: BookItem }>(`/books/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  const unwrapped =
    'data' in response && response.data && typeof response.data === 'object'
      ? response.data
      : (response as BookItem);
  return normalizeBookItem(unwrapped);
}

export async function deleteBook(id: number): Promise<void> {
  return apiClient<void>(`/books/${id}`, {
    method: 'DELETE',
  });
}
