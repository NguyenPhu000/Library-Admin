import { Link, useParams } from 'react-router';

import { useSetBreadcrumbDetailLabel } from '../../../components/layout/BreadcrumbContext';
import { BookInformationCard } from '../components/BookInformationCard';
import { StockBadge } from '../components/StockBadge';
import { StockCard } from '../components/StockCard';
import { TagBadge } from '../components/TagBadge';
import { useBook } from '../hooks/useBook';

export function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const parsedId = Number(bookId);
  const isValidId = Boolean(bookId) && Number.isInteger(parsedId) && parsedId > 0;

  const { data: book, isLoading, isError, error, refetch } = useBook(parsedId);
  useSetBreadcrumbDetailLabel(book?.title);

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <Link
          to="/books"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 no-underline transition-colors hover:text-night-700 hover:underline"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="fill-none stroke-current stroke-[2.25] [stroke-linecap:round] [stroke-linejoin:round]"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to books
        </Link>
      </div>

      {!isValidId && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface p-11 text-center text-ink"
        >
          <p className="m-0 font-medium">Invalid book ID.</p>
        </div>
      )}

      {isValidId && isLoading && (
        <div
          role="status"
          aria-busy="true"
          className="flex flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface p-11 text-center text-ink-muted"
        >
          <p className="m-0">Loading book details...</p>
        </div>
      )}

      {isValidId && isError && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface p-11 text-center text-ink"
        >
          <p className="m-0">
            {error instanceof Error ? error.message : 'Failed to load book details'}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-control border border-border bg-surface px-4 font-semibold text-ink transition-colors hover:bg-surface-row-alt"
          >
            Retry
          </button>
        </div>
      )}

      {isValidId && !isLoading && !isError && book && (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1
                id="book-detail-heading"
                className="m-0 font-display text-[32px] font-extrabold leading-[1.1] text-ink"
              >
                {book.title}
              </h1>
              <p className="m-0 text-sm text-ink-muted">
                {book.author} · {book.publishedYear}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {book.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
                <StockBadge status={book.status} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/books/${book.id}/edit`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-control border border-surface-tint-border bg-surface-tint px-4 font-semibold text-brand-600 no-underline transition-colors hover:bg-[#e7d6f8]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Edit
              </Link>
              <button
                type="button"
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-control border border-warn-border bg-warn-surface px-4 font-semibold text-warn-ink transition-colors hover:bg-[#fce6d2]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr]">
            <BookInformationCard book={book} />
            <StockCard book={book} />
          </div>
        </>
      )}
    </div>
  );
}
