import { z } from 'zod';

import { BOOK_FORM_MODE, type BookFormMode } from './book';

export const MIN_TEXT_LENGTH = 1;
export const MAX_TEXT_LENGTH = 255;
export const MIN_PUBLISHED_YEAR = 1450;
export const MAX_PUBLISHED_YEAR = new Date().getFullYear();
export const MIN_CREATE_COPIES = 1;
export const MIN_EDIT_COPIES = 0;
export const MAX_BOOK_TAGS = 5;
export const DEFAULT_DESCRIPTION_ROWS = 4;

export const YEAR_RANGE_ERROR_MESSAGE = `Year must be between ${MIN_PUBLISHED_YEAR} and ${MAX_PUBLISHED_YEAR}`;
export const MAX_TAGS_ERROR_MESSAGE = `Up to ${MAX_BOOK_TAGS} tags allowed`;

export interface BookFormSchemaOptions {
  mode?: BookFormMode;
  onLoan?: number;
}

function parseRequiredNumber(val: number | string): number {
  if (typeof val === 'number') {
    return val;
  }
  const trimmed = val.trim();
  if (trimmed === '') {
    return Number.NaN;
  }
  return Number(trimmed);
}

export function createBookFormSchema(options: BookFormSchemaOptions = {}) {
  const { mode = BOOK_FORM_MODE.CREATE, onLoan = 0 } = options;
  const minRequiredCopies =
    mode === BOOK_FORM_MODE.CREATE ? MIN_CREATE_COPIES : MIN_EDIT_COPIES;

  return z.object({
    title: z
      .string()
      .trim()
      .min(MIN_TEXT_LENGTH, 'Title is required')
      .max(MAX_TEXT_LENGTH, `Title must be at most ${MAX_TEXT_LENGTH} characters`),
    author: z
      .string()
      .trim()
      .min(MIN_TEXT_LENGTH, 'Author is required')
      .max(MAX_TEXT_LENGTH, `Author must be at most ${MAX_TEXT_LENGTH} characters`),
    publishedYear: z
      .union([z.number(), z.string()])
      .transform(parseRequiredNumber)
      .pipe(
        z
          .number({
            error: YEAR_RANGE_ERROR_MESSAGE,
          })
          .int(YEAR_RANGE_ERROR_MESSAGE)
          .min(MIN_PUBLISHED_YEAR, YEAR_RANGE_ERROR_MESSAGE)
          .max(MAX_PUBLISHED_YEAR, YEAR_RANGE_ERROR_MESSAGE),
      ),
    totalCopies: z
      .union([z.number(), z.string()])
      .transform(parseRequiredNumber)
      .pipe(
        z
          .number({
            error: 'Stock is required',
          })
          .int('Stock must be a whole number')
          .min(
            minRequiredCopies,
            minRequiredCopies === MIN_CREATE_COPIES
              ? `Stock must be at least ${MIN_CREATE_COPIES}`
              : 'Stock cannot be negative',
          )
          .refine((val) => val >= onLoan, {
            message: `Stock cannot be less than copies currently on loan (${onLoan})`,
          }),
      ),
    tags: z
      .array(z.string().trim().min(MIN_TEXT_LENGTH))
      .max(MAX_BOOK_TAGS, MAX_TAGS_ERROR_MESSAGE),
    description: z.string().trim(),
  });
}

export const bookFormSchema = createBookFormSchema();

export type BookFormValues = z.output<typeof bookFormSchema>;
export type BookFormInput = z.input<typeof bookFormSchema>;
