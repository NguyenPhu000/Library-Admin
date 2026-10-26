import { describe, expect, it } from 'vitest';

import { booksKeys } from '../features/books/api/booksKeys';

describe('booksKeys', () => {
  it('generates root query key for books', () => {
    expect(booksKeys.all).toEqual(['books']);
  });

  it('generates lists key', () => {
    expect(booksKeys.lists()).toEqual(['books', 'list']);
  });

  it('generates list query key with and without params', () => {
    expect(booksKeys.list()).toEqual(['books', 'list', {}]);
    expect(booksKeys.list({ page: 1, limit: 10, q: 'test' })).toEqual([
      'books',
      'list',
      { page: 1, limit: 10, q: 'test' },
    ]);
  });

  it('generates details key and detail key with bookId', () => {
    expect(booksKeys.details()).toEqual(['books', 'detail']);
    expect(booksKeys.detail(42)).toEqual(['books', 'detail', 42]);
  });

  it('generates loans query key with bookId', () => {
    expect(booksKeys.loans(5)).toEqual(['books', 'loans', 5]);
  });

  it('generates tags query key', () => {
    expect(booksKeys.tags()).toEqual(['books', 'tags']);
  });
});
