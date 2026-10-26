const ISBN_PREFIX = '978-0';
const ISBN_RANDOM_DIGITS_LENGTH = 9;

/**
 * Generates a standard default ISBN-13 format for newly added books.
 * Format: 978-0-XX-XXXXXX-X
 */
export function generateDefaultIsbn(): string {
  const digits = String(Date.now())
    .slice(-ISBN_RANDOM_DIGITS_LENGTH)
    .padStart(ISBN_RANDOM_DIGITS_LENGTH, '0');
  return `${ISBN_PREFIX}-${digits.slice(0, 2)}-${digits.slice(2, 8)}-${digits.slice(8)}`;
}
