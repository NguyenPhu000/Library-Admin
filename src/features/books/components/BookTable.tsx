import { useLocation } from 'react-router';

import type { BookItem } from '../types/book';
import { BookTableRow } from './BookTableRow';

interface BookTableProps {
  books: BookItem[];
}

const BOOK_TABLE_COLUMNS = [
  { label: 'Title', className: 'w-[26%] min-w-[200px] text-left' },
  { label: 'Author', className: 'w-[20%] min-w-[150px] text-left' },
  { label: 'Year', className: 'w-[8%] min-w-[70px] text-left' },
  { label: 'Tags', className: 'w-[22%] min-w-[160px] text-left' },
  { label: 'Stock', className: 'w-[8%] min-w-[70px] text-right' },
  { label: 'Status', className: 'w-[10%] min-w-[110px] text-left' },
  { label: 'Actions', className: 'w-[6%] min-w-[90px] text-right' },
] as const;

export function BookTable({ books }: BookTableProps) {
  const location = useLocation();
  const fromPath = `${location.pathname}${location.search}`;

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface shadow-xs">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="bg-surface-row-alt text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {BOOK_TABLE_COLUMNS.map((col) => (
                <th
                  key={col.label}
                  scope="col"
                  className={`px-4 py-3.5 font-semibold whitespace-nowrap ${col.className}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <BookTableRow key={book.id} book={book} fromPath={fromPath} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
