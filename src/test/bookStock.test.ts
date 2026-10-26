import { describe, expect, it } from 'vitest';
import { BOOK_STATUS } from '../features/books/types/book';
import { calculateAvailableCopies, resolveBookStatus } from '../features/books/utils/bookStock';

describe('bookStock utils', () => {
  describe('calculateAvailableCopies', () => {
    it('returns positive available count when totalCopies exceeds onLoan', () => {
      expect(calculateAvailableCopies(5, 3)).toBe(2);
      expect(calculateAvailableCopies(10, 0)).toBe(10);
    });

    it('returns 0 when onLoan equals totalCopies', () => {
      expect(calculateAvailableCopies(4, 4)).toBe(0);
    });

    it('clamps to 0 when onLoan exceeds totalCopies defensively', () => {
      expect(calculateAvailableCopies(2, 5)).toBe(0);
    });
  });

  describe('resolveBookStatus', () => {
    it('returns AVAILABLE when copies are available', () => {
      expect(resolveBookStatus(5, 2)).toBe(BOOK_STATUS.AVAILABLE);
    });

    it('returns OUT_OF_STOCK when 0 copies are available', () => {
      expect(resolveBookStatus(3, 3)).toBe(BOOK_STATUS.OUT_OF_STOCK);
      expect(resolveBookStatus(0, 0)).toBe(BOOK_STATUS.OUT_OF_STOCK);
    });
  });
});
