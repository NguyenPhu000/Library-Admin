import { Link } from 'react-router';

import { StockBadge } from './StockBadge';
import { TagBadge } from './TagBadge';
import type { BookItem } from '../types/book';

interface BookTableProps {
  books: BookItem[];
}

export function BookTable({ books }: BookTableProps) {
  return (
    <div className="book-table-card">
      <div className="book-table-scroll">
        <table className="book-table">
          <thead>
            <tr>
              <th scope="col" className="book-table__th--left book-table__th--title">
                Title
              </th>
              <th scope="col" className="book-table__th--left book-table__th--author">
                Author
              </th>
              <th scope="col" className="book-table__th--left book-table__th--year">
                Year
              </th>
              <th scope="col" className="book-table__th--left book-table__th--tags">
                Tags
              </th>
              <th scope="col" className="book-table__th--right book-table__th--stock">
                Stock
              </th>
              <th scope="col" className="book-table__th--left book-table__th--status">
                Status
              </th>
              <th scope="col" className="book-table__th--right book-table__th--actions">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="book-table__row">
                <td className="book-table__cell--title">
                  <Link to={`/books/${book.id}`} className="book-table__title-link">
                    {book.title}
                  </Link>
                </td>
                <td className="book-table__cell--muted">{book.author}</td>
                <td className="book-table__cell--muted">{book.publishedYear}</td>
                <td className="book-table__cell--tags">
                  <div className="book-table__tags-list">
                    {book.tags.map((tag) => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                </td>
                <td className="book-table__cell--stock">{book.totalCopies}</td>
                <td className="book-table__cell--status">
                  <StockBadge status={book.status} />
                </td>
                <td className="book-table__cell--actions">
                  <Link to={`/books/${book.id}`} className="book-table__action-link">
                    View
                  </Link>
                  <Link to={`/books/${book.id}/edit`} className="book-table__action-link">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="book-table__pagination">
        <span className="book-table__summary">
          Showing 1–{books.length} of {books.length} books
        </span>
        <nav aria-label="Pagination" className="book-table__pagination-nav">
          <button
            type="button"
            disabled
            className="book-table__page-btn"
            aria-label="Previous page"
          >
            ‹
          </button>
          <button
            type="button"
            aria-current="page"
            className="book-table__page-btn book-table__page-btn--active"
          >
            1
          </button>
          <button
            type="button"
            disabled
            className="book-table__page-btn"
            aria-label="Next page"
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  );
}
