export const BOOK_STATUS = {
  AVAILABLE: 'AVAILABLE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  ARCHIVED: 'ARCHIVED',
} as const;

export type BookStatus = (typeof BOOK_STATUS)[keyof typeof BOOK_STATUS];

export const BOOK_STATUS_OPTIONS: ReadonlyArray<{ value: BookStatus; label: string }> = [
  { value: BOOK_STATUS.AVAILABLE, label: 'Available' },
  { value: BOOK_STATUS.OUT_OF_STOCK, label: 'Out of stock' },
  { value: BOOK_STATUS.ARCHIVED, label: 'Archived' },
];

export const LOAN_STATUS = {
  ACTIVE: 'ACTIVE',
  OVERDUE: 'OVERDUE',
  RETURNED: 'RETURNED',
} as const;

export type LoanStatus = (typeof LOAN_STATUS)[keyof typeof LOAN_STATUS];

export const BOOK_FORM_MODE = {
  CREATE: 'create',
  EDIT: 'edit',
} as const;

export type BookFormMode = (typeof BOOK_FORM_MODE)[keyof typeof BOOK_FORM_MODE];

export const DEFAULT_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 300;

export interface BookItem {
  id: number;
  title: string;
  author: string;
  publishedYear: number;
  isbn: string;
  publisher: string | null;
  edition: string | null;
  description: string | null;
  totalCopies: number;
  tags: string[];
  status: BookStatus;
  addedOn: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookDetail extends BookItem {
  onLoan: number;
  available: number;
}

export interface Loan {
  id: number;
  bookId: number;
  memberId: number;
  memberName: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate: string | null;
  status: LoanStatus;
}

export interface BookListParams {
  q?: string;
  tag?: string;
  status?: BookStatus | '';
  page?: number;
  limit?: number;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  publisher?: string | null;
  edition?: string | null;
  description?: string | null;
  totalCopies: number;
  tags?: string[];
  status?: BookStatus;
}

export interface UpdateBookPayload {
  title?: string;
  author?: string;
  isbn?: string;
  publishedYear?: number;
  publisher?: string | null;
  edition?: string | null;
  description?: string | null;
  totalCopies?: number;
  tags?: string[];
  status?: BookStatus;
}
