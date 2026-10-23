export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, string[]>;
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
  readonly details?: Record<string, string[]>;
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