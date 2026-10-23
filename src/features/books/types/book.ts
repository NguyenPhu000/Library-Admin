export type BookStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'ARCHIVED';

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

export type LoanStatus = 'ACTIVE' | 'OVERDUE' | 'RETURNED';

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
