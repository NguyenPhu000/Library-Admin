import { memo } from 'react';
import { Link } from 'react-router';

import type { BookItem } from '../types/book';
import { StockBadge } from './StockBadge';
import { TagBadge } from './TagBadge';

interface BookTableRowProps {
  book: BookItem;
  fromPath: string;
}

export const BookTableRow = memo(function BookTableRow({
  book,
  fromPath,
}: BookTableRowProps) {
  return (
    <tr className="border-t border-border transition-colors hover:bg-surface-row-alt">
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
          state={{ from: fromPath }}
          className="ml-4 inline-block font-semibold text-brand-600 no-underline hover:text-night-700 hover:underline"
        >
          Edit
        </Link>
      </td>
    </tr>
  );
});
