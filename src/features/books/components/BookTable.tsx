import { Link } from 'react-router';

import { StockBadge } from './StockBadge';
import { TagBadge } from './TagBadge';
import type { BookItem } from '../types/book';

interface BookTableProps {
  books: BookItem[];
}

export function BookTable({ books }: BookTableProps) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface shadow-xs">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="bg-surface-row-alt text-xs font-semibold uppercase tracking-wider text-ink-muted">
              <th scope="col" className="w-[26%] min-w-[200px] px-4 py-3.5 text-left font-semibold whitespace-nowrap">
                Title
              </th>
              <th scope="col" className="w-[20%] min-w-[150px] px-4 py-3.5 text-left font-semibold whitespace-nowrap">
                Author
              </th>
              <th scope="col" className="w-[8%] min-w-[70px] px-4 py-3.5 text-left font-semibold whitespace-nowrap">
                Year
              </th>
              <th scope="col" className="w-[22%] min-w-[160px] px-4 py-3.5 text-left font-semibold whitespace-nowrap">
                Tags
              </th>
              <th scope="col" className="w-[8%] min-w-[70px] px-4 py-3.5 text-right font-semibold whitespace-nowrap">
                Stock
              </th>
              <th scope="col" className="w-[10%] min-w-[110px] px-4 py-3.5 text-left font-semibold whitespace-nowrap">
                Status
              </th>
              <th scope="col" className="w-[6%] min-w-[90px] px-4 py-3.5 text-right font-semibold whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book.id}
                className="border-t border-border transition-colors hover:bg-[#faf7fd]"
              >
                <td className="px-4 py-3.5 text-left align-middle">
                  <Link
                    to={`/books/${book.id}`}
                    className="font-semibold text-brand-600 no-underline hover:text-night-700 hover:underline"
                  >
                    {book.title}
                  </Link>
                </td>
                <td className="px-4 py-3.5 text-left align-middle text-ink-muted">{book.author}</td>
                <td className="px-4 py-3.5 text-left align-middle text-ink-muted">{book.publishedYear}</td>
                <td className="px-4 py-3.5 text-left align-middle">
                  <div className="flex flex-wrap gap-1.5">
                    {book.tags.map((tag) => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right align-middle font-medium tabular-nums text-ink">
                  {book.totalCopies}
                </td>
                <td className="px-4 py-3.5 text-left align-middle">
                  <StockBadge status={book.status} />
                </td>
                <td className="px-4 py-3.5 text-right align-middle whitespace-nowrap">
                  <Link
                    to={`/books/${book.id}`}
                    className="inline-block font-semibold text-brand-600 no-underline hover:text-night-700 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    to={`/books/${book.id}/edit`}
                    className="ml-4 inline-block font-semibold text-brand-600 no-underline hover:text-night-700 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3 text-ink-muted">
        <span className="text-[13px] text-ink-muted">
          Showing 1–{books.length} of {books.length} books
        </span>
        <nav aria-label="Pagination" className="flex items-center gap-1.5">
          <button
            type="button"
            disabled
            className="inline-flex min-h-[40px] min-w-[40px] cursor-not-allowed items-center justify-center rounded-control border border-border bg-surface px-2.5 text-sm font-medium text-[#8A93A0] opacity-60 transition-colors"
            aria-label="Previous page"
          >
            ‹
          </button>
          <button
            type="button"
            aria-current="page"
            className="inline-flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center rounded-control border border-brand-600 bg-brand-600 px-2.5 text-sm font-semibold text-on-dark transition-colors"
          >
            1
          </button>
          <button
            type="button"
            disabled
            className="inline-flex min-h-[40px] min-w-[40px] cursor-not-allowed items-center justify-center rounded-control border border-border bg-surface px-2.5 text-sm font-medium text-[#8A93A0] opacity-60 transition-colors"
            aria-label="Next page"
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  );
}
