export const API_ERROR_CODE = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BOOK_NOT_FOUND: 'BOOK_NOT_FOUND',
  BOOK_HAS_ACTIVE_LOANS: 'BOOK_HAS_ACTIVE_LOANS',
  ISBN_ALREADY_EXISTS: 'ISBN_ALREADY_EXISTS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  HTTP_ERROR: 'HTTP_ERROR',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId?: string;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly requestId?: string;

  constructor(status: number, detail: ApiErrorDetail) {
    super(detail.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = detail.code;
    this.details = detail.details;
    this.requestId = detail.requestId;
  }
}
