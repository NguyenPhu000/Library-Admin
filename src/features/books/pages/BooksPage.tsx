import { useBooks } from '../hooks/useBooks';
import { PageHeader } from '../components/PageHeader';
import { BookTable } from '../components/BookTable';
import '../components/books.css';

export function BooksPage() {
  const { data, isLoading, isError, error, refetch } = useBooks();

  return (
    <div className="books-page">
      <PageHeader
        title="Books"
        description="Manage the library catalogue: search, filter and open a book to see its loans."
        actionText="Add book"
        actionTo="/books/new"
      />

      {isLoading && (
        <div role="status" aria-busy="true" className="state-box">
          <p>Loading books...</p>
        </div>
      )}

      {isError && (
        <div role="alert" className="state-box state-box--error">
          <p>{error instanceof Error ? error.message : 'Failed to load books'}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="state-box__retry-button"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && data && data.data.length === 0 && (
        <div className="state-box state-box--empty">
          <p>No books found.</p>
        </div>
      )}

      {!isLoading && !isError && data && data.data.length > 0 && (
        <BookTable books={data.data} />
      )}
    </div>
  );
}