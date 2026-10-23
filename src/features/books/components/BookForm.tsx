import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { API_ERROR_CODE, ApiError } from '../../../shared/types/api';
import { BOOK_FORM_MODE, type BookFormMode } from '../types/book';
import {
  DEFAULT_DESCRIPTION_ROWS,
  MAX_BOOK_TAGS,
  MAX_TAGS_ERROR_MESSAGE,
  MIN_CREATE_COPIES,
  MIN_EDIT_COPIES,
  createBookFormSchema,
  type BookFormInput,
  type BookFormValues,
} from '../types/bookSchema';

export interface BookFormProps {
  mode?: BookFormMode;
  defaultValues?: Partial<BookFormValues>;
  onLoan?: number;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: BookFormValues) => void | Promise<void>;
  onCancel: () => void;
}

const KNOWN_FORM_FIELDS: ReadonlyArray<keyof BookFormValues> = [
  'title',
  'author',
  'publishedYear',
  'totalCopies',
  'tags',
  'description',
];

function isKnownFormField(key: string): key is keyof BookFormValues {
  return (KNOWN_FORM_FIELDS as readonly string[]).includes(key);
}

function extractFieldErrorMessage(raw: unknown): string | null {
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw;
  }
  if (Array.isArray(raw) && typeof raw[0] === 'string' && raw[0].trim().length > 0) {
    return raw[0];
  }
  return null;
}

function extractMappedFieldErrors(
  error: unknown,
): Array<{ field: keyof BookFormValues; message: string }> {
  if (!(error instanceof ApiError)) {
    return [];
  }
  if (error.code !== API_ERROR_CODE.VALIDATION_ERROR || !error.details) {
    return [];
  }

  const mapped: Array<{ field: keyof BookFormValues; message: string }> = [];
  for (const [fieldKey, rawVal] of Object.entries(error.details)) {
    if (isKnownFormField(fieldKey)) {
      const message = extractFieldErrorMessage(rawVal);
      if (message) {
        mapped.push({ field: fieldKey, message });
      }
    }
  }
  return mapped;
}

interface FormFieldErrorProps {
  id: string;
  message: string;
}

function FormFieldError({ id, message }: FormFieldErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      className="m-0 flex items-center gap-1.5 text-xs font-medium text-warn-ink"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="shrink-0 fill-none stroke-warn-icon stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>{message}</span>
    </p>
  );
}

export function BookForm({
  mode = BOOK_FORM_MODE.CREATE,
  defaultValues,
  onLoan = 0,
  isSubmitting = false,
  submitError,
  onSubmit,
  onCancel,
}: BookFormProps) {
  const [tagDraft, setTagDraft] = useState('');

  const schema = useMemo(
    () => createBookFormSchema({ mode, onLoan }),
    [mode, onLoan],
  );

  const initialFormValues = useMemo<BookFormInput>(
    () => ({
      title: defaultValues?.title ?? '',
      author: defaultValues?.author ?? '',
      publishedYear: defaultValues?.publishedYear ?? '',
      totalCopies:
        defaultValues?.totalCopies ??
        (mode === BOOK_FORM_MODE.CREATE ? MIN_CREATE_COPIES : MIN_EDIT_COPIES),
      tags: defaultValues?.tags ?? [],
      description: defaultValues?.description ?? '',
    }),
    [defaultValues, mode],
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<BookFormInput, unknown, BookFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialFormValues,
    mode: 'onTouched',
  });

  useEffect(() => {
    reset(initialFormValues);
  }, [initialFormValues, reset]);

  const mappedServerErrors = useMemo(
    () => extractMappedFieldErrors(submitError),
    [submitError],
  );

  useEffect(() => {
    for (const item of mappedServerErrors) {
      setError(item.field, { type: 'server', message: item.message });
    }
  }, [mappedServerErrors, setError]);

  const watchedTags = useWatch({ control, name: 'tags' });
  const tags = useMemo(
    () => (Array.isArray(watchedTags) ? watchedTags : []),
    [watchedTags],
  );

  function handleAddTag(rawTag: string) {
    const trimmed = rawTag.trim();
    if (!trimmed) {
      return;
    }

    const hasExistingTag = tags.some(
      (existing) => existing.toLowerCase() === trimmed.toLowerCase(),
    );
    if (hasExistingTag) {
      setTagDraft('');
      return;
    }

    if (tags.length >= MAX_BOOK_TAGS) {
      setError('tags', {
        type: 'manual',
        message: MAX_TAGS_ERROR_MESSAGE,
      });
      return;
    }

    clearErrors('tags');
    setValue('tags', [...tags, trimmed], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setTagDraft('');
  }

  function handleRemoveTag(tagToRemove: string) {
    clearErrors('tags');
    setValue(
      'tags',
      tags.filter((tag) => tag !== tagToRemove),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  }

  function handleTagInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (errors.tags) {
      clearErrors('tags');
    }
    setTagDraft(event.target.value);
  }

  function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      handleAddTag(tagDraft);
      return;
    }

    if (event.key === 'Backspace' && tagDraft === '' && tags.length > 0) {
      const lastTag = tags[tags.length - 1];
      if (lastTag) {
        handleRemoveTag(lastTag);
      }
    }
  }

  function handleFormSubmit(values: BookFormValues) {
    const pendingTag = tagDraft.trim();
    let finalTags = values.tags;

    if (pendingTag) {
      const hasExistingTag = finalTags.some(
        (existing) => existing.toLowerCase() === pendingTag.toLowerCase(),
      );
      if (!hasExistingTag) {
        if (finalTags.length >= MAX_BOOK_TAGS) {
          setError('tags', {
            type: 'manual',
            message: MAX_TAGS_ERROR_MESSAGE,
          });
          return;
        }
        finalTags = [...finalTags, pendingTag];
      }
      setTagDraft('');
    }

    void onSubmit({
      ...values,
      tags: finalTags,
    });
  }

  const bannerErrorMessage = useMemo(() => {
    if (!submitError || mappedServerErrors.length > 0) {
      return null;
    }
    if (submitError instanceof ApiError) {
      return submitError.message;
    }
    if (submitError instanceof Error) {
      return submitError.message;
    }
    return 'Failed to save book. Please check your input and try again.';
  }, [mappedServerErrors.length, submitError]);

  function getInputClassName(hasError: boolean): string {
    const base =
      'min-h-[44px] w-full rounded-control bg-surface px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-subtle';
    if (hasError) {
      return `${base} border-[1.5px] border-warn-icon focus:border-warn-icon`;
    }
    return `${base} border border-border focus:border-brand-600`;
  }

  return (
    <div className="w-full max-w-[780px] rounded-card border border-border bg-surface p-6 shadow-xs sm:p-8">
      <form
        onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
        noValidate
        className="flex flex-col gap-5"
      >
        {bannerErrorMessage && (
          <div
            role="alert"
            className="rounded-control border border-warn-border bg-warn-surface px-4 py-3 text-sm font-medium text-warn-ink"
          >
            {bannerErrorMessage}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="book-title" className="text-[13px] font-semibold text-ink">
            Title <span aria-hidden="true">*</span>
          </label>
          <input
            id="book-title"
            type="text"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'book-title-error' : undefined}
            className={getInputClassName(Boolean(errors.title))}
            {...register('title')}
          />
          {errors.title?.message && (
            <FormFieldError id="book-title-error" message={errors.title.message} />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="book-author" className="text-[13px] font-semibold text-ink">
            Author <span aria-hidden="true">*</span>
          </label>
          <input
            id="book-author"
            type="text"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={Boolean(errors.author)}
            aria-describedby={errors.author ? 'book-author-error' : undefined}
            className={getInputClassName(Boolean(errors.author))}
            {...register('author')}
          />
          {errors.author?.message && (
            <FormFieldError id="book-author-error" message={errors.author.message} />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="book-year" className="text-[13px] font-semibold text-ink">
              Year <span aria-hidden="true">*</span>
            </label>
            <input
              id="book-year"
              type="number"
              inputMode="numeric"
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={Boolean(errors.publishedYear)}
              aria-describedby={errors.publishedYear ? 'book-year-error' : undefined}
              className={getInputClassName(Boolean(errors.publishedYear))}
              {...register('publishedYear')}
            />
            {errors.publishedYear?.message && (
              <FormFieldError id="book-year-error" message={errors.publishedYear.message} />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="book-stock" className="text-[13px] font-semibold text-ink">
              Stock <span aria-hidden="true">*</span>
            </label>
            <input
              id="book-stock"
              type="number"
              inputMode="numeric"
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={Boolean(errors.totalCopies)}
              aria-describedby={
                errors.totalCopies ? 'book-stock-error book-stock-help' : 'book-stock-help'
              }
              className={getInputClassName(Boolean(errors.totalCopies))}
              {...register('totalCopies')}
            />
            {errors.totalCopies?.message && (
              <FormFieldError id="book-stock-error" message={errors.totalCopies.message} />
            )}
            <p id="book-stock-help" className="m-0 text-xs text-ink-muted">
              Total copies the library owns
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="book-tags-input" className="text-[13px] font-semibold text-ink">
            Tags
          </label>
          <div
            className={`flex min-h-[44px] flex-wrap items-center gap-2 rounded-control bg-surface px-3 py-1.5 transition-colors ${
              errors.tags
                ? 'border-[1.5px] border-warn-icon'
                : 'border border-border focus-within:border-brand-600'
            }`}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-tint px-2.5 py-0.5 text-xs font-semibold text-brand-600"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Remove ${tag}`}
                  className="inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-xs font-bold leading-none text-brand-600 hover:text-night-700 disabled:cursor-not-allowed"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              id="book-tags-input"
              type="text"
              value={tagDraft}
              disabled={isSubmitting}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag and press Enter"
              aria-invalid={Boolean(errors.tags)}
              aria-describedby={
                errors.tags ? 'book-tags-error book-tags-help' : 'book-tags-help'
              }
              className="min-w-[180px] flex-1 border-0 bg-transparent py-1 text-sm text-ink outline-none placeholder:text-ink-subtle"
            />
          </div>
          {errors.tags?.message && (
            <FormFieldError id="book-tags-error" message={errors.tags.message} />
          )}
          <p id="book-tags-help" className="m-0 text-xs text-ink-muted">
            Up to {MAX_BOOK_TAGS} tags
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="book-description" className="text-[13px] font-semibold text-ink">
            Description
          </label>
          <textarea
            id="book-description"
            rows={DEFAULT_DESCRIPTION_ROWS}
            disabled={isSubmitting}
            placeholder="Short description shown on the detail page"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'book-description-error' : undefined}
            className="w-full resize-y rounded-control border border-border bg-surface p-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-brand-600"
            {...register('description')}
          />
          {errors.description?.message && (
            <FormFieldError id="book-description-error" message={errors.description.message} />
          )}
        </div>

        <div className="mt-1 flex items-center justify-end gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-control border border-border bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:bg-surface-row-alt disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-control border border-brand-600 bg-brand-600 px-5 text-sm font-semibold text-on-dark transition-colors hover:bg-night-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save book'}
          </button>
        </div>
      </form>
    </div>
  );
}
