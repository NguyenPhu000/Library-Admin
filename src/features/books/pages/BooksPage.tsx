import { useBooks } from '../hooks/useBooks';
import { PageHeader } from '../components/PageHeader';
import { BookTable } from '../components/BookTable';

export function BooksPage() {
  const { data, isLoading, isError, error, refetch } = useBooks();

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Books"
        description="Manage the library catalogue: search, filter and open a book to see its loans."
        actionText="Add book"
        actionTo="/books/new"
      />

      {isLoading && (
        <div
          role="status"
          aria-busy="true"
          className="flex flex-col items-center justify-center gap-3 rounded-card bg-surface p-11 text-center text-ink-muted"
        >
          <p>Loading books...</p>
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface p-11 text-center text-ink"
        >
          <p>{error instanceof Error ? error.message : 'Failed to load books'}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-control border border-border bg-surface px-4 font-semibold text-ink transition-colors hover:bg-surface-row-alt"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && data && data.data.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border-dashed bg-surface p-11 text-center text-ink-muted">
          <p>No books found.</p>
        </div>
      )}

      {!isLoading && !isError && data && data.data.length > 0 && (
        <BookTable books={data.data} />
      )}
    </div>
  );
}