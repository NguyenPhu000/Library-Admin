import { BOOK_STATUS, type BookStatus } from '../types/book';

/**
 * Calculates available book copies given totalCopies and onLoan.
 * Guarantees a non-negative integer.
 */
export function calculateAvailableCopies(totalCopies: number, onLoan: number): number {
  return Math.max(0, totalCopies - onLoan);
}

/**
 * Resolves stock status based on available copies.
 */
export function resolveBookStatus(totalCopies: number, onLoan: number): BookStatus {
  const available = calculateAvailableCopies(totalCopies, onLoan);
  return available > 0 ? BOOK_STATUS.AVAILABLE : BOOK_STATUS.OUT_OF_STOCK;
}
