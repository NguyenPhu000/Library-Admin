export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, 'ellipsis', total];
  }
  if (current >= total - 2) {
    return [1, 'ellipsis', total - 3, total - 2, total - 1, total];
  }
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-surface px-4 py-3 text-ink-muted shadow-xs">
      <span className="text-[13px] text-ink-muted">
        Showing {startIndex}–{endIndex} of {total} books
      </span>

      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={isFirstPage}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-control border border-border bg-surface px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:text-ink-subtle disabled:opacity-60 enabled:cursor-pointer enabled:text-ink enabled:hover:bg-surface-row-alt"
        >
          ‹
        </button>

        {pages.map((p, index) =>
          p === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center text-sm text-ink-muted select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`inline-flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center rounded-control px-2.5 text-sm font-semibold transition-colors ${
                p === currentPage
                  ? 'border border-brand-600 bg-brand-600 text-on-dark'
                  : 'border border-border bg-surface text-ink hover:bg-surface-row-alt'
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={isLastPage}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-control border border-border bg-surface px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:text-ink-subtle disabled:opacity-60 enabled:cursor-pointer enabled:text-ink enabled:hover:bg-surface-row-alt"
        >
          ›
        </button>
      </nav>
    </div>
  );
}
