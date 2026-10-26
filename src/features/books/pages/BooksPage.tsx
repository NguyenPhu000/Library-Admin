import { useState } from 'react';

import { useBooks } from '../hooks/useBooks';
import { useTags } from '../hooks/useTags';
import { PageHeader } from '../components/PageHeader';
import { BookFilters } from '../components/BookFilters';
import { BookTable } from '../components/BookTable';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import {
  DEFAULT_PAGE_SIZE,
  SEARCH_DEBOUNCE_MS,
  type BookStatus,
} from '../types/book';

export function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | ''>('');
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const { data, isLoading, isError, error, refetch } = useBooks({
    q: debouncedQuery.trim() || undefined,
    tag: selectedTag || undefined,
    status: selectedStatus || undefined,
    page,
    limit: DEFAULT_PAGE_SIZE,
  });

  const { data: apiTags = [] } = useTags();
  const bookTags = Array.from(new Set(data?.data.flatMap((book) => book.tags) || []));
  const availableTags = apiTags.length > 0 ? apiTags : bookTags;

  function handleSearchChange(query: string) {
    setSearchQuery(query);
    setPage(1);
  }

  function handleTagChange(tag: string) {
    setSelectedTag(tag);
    setPage(1);
  }

  function handleStatusChange(status: BookStatus | '') {
    setSelectedStatus(status);
    setPage(1);
  }

  function handleClearFilters() {
    setSearchQuery('');
    setSelectedTag('');
    setSelectedStatus('');
    setPage(1);
  }

  function handleRetryBooks() {
    void refetch();
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
        onSearchChange={handleSearchChange}
        selectedTag={selectedTag}
        onTagChange={handleTagChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
        availableTags={availableTags}
      />

      {isLoading && <LoadingState label="Loading books..." variant="table" />}

      {isError && (
        <ErrorState
          title="Couldn't load books"
          error={error}
          onRetry={handleRetryBooks}
        />
      )}

      {!isLoading && !isError && data && data.data.length === 0 && (
        <EmptyState
          title={
            hasActiveFilters ? 'No books match your filters' : 'No books in the catalogue yet'
          }
          description={
            hasActiveFilters
              ? 'Try another title or author, or clear the filters to see every book.'
              : 'Add the first book to start building your library catalogue.'
          }
          actionLabel={hasActiveFilters ? 'Clear filters' : 'Add book'}
          actionTo={hasActiveFilters ? undefined : '/books/new'}
          onAction={hasActiveFilters ? handleClearFilters : undefined}
        />
      )}

      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <BookTable books={data.data} />
          <Pagination
            page={page}
            pageSize={DEFAULT_PAGE_SIZE}
            total={data.total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
