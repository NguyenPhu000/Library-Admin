import { useState } from 'react';

import { useBooks } from '../hooks/useBooks';
import { useTags } from '../hooks/useTags';
import { PageHeader } from '../components/PageHeader';
import { BookFilters } from '../components/BookFilters';
import { BookTable } from '../components/BookTable';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import type { BookStatus } from '../types/book';

export function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | ''>('');

  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data, isLoading, isError, error, refetch } = useBooks({
    q: debouncedQuery.trim() || undefined,
    tag: selectedTag || undefined,
    status: selectedStatus || undefined,
  });

  const { data: apiTags = [] } = useTags();
  const bookTags = Array.from(new Set(data?.data.flatMap((book) => book.tags) || []));
  const availableTags = apiTags.length > 0 ? apiTags : bookTags;

  function handleClearFilters() {
    setSearchQuery('');
    setSelectedTag('');
    setSelectedStatus('');
  }

  const hasActiveFilters = Boolean(searchQuery || selectedTag || selectedStatus);

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Books"
        description="Manage the library catalogue: search, filter and open a book to see its loans."
        actionText="Add book"
        actionTo="/books/new"
      />

      <BookFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onClearFilters={handleClearFilters}
        availableTags={availableTags}
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
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-control border border-border bg-surface px-4 font-semibold text-ink transition-colors hover:bg-surface-row-alt"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && data && data.data.length > 0 && (
        <BookTable books={data.data} />
      )}
    </div>
  );
}