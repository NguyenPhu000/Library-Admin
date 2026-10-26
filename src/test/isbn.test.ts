import { describe, expect, it } from 'vitest';
import { generateDefaultIsbn } from '../features/books/utils/isbn';

describe('generateDefaultIsbn', () => {
  it('generates a valid ISBN-13 format starting with 978-0', () => {
    const isbn = generateDefaultIsbn();
    expect(isbn).toMatch(/^978-0-\d{2}-\d{6}-\d{1}$/);
  });

  it('generates a string of length 17', () => {
    const isbn = generateDefaultIsbn();
    expect(isbn).toHaveLength(17);
  });
});
