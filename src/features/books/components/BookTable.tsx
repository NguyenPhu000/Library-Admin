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
    </div>
  );
}
