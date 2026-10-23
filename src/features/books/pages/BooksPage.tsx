import { useState } from 'react';

import { useBooks } from '../hooks/useBooks';
import { useTags } from '../hooks/useTags';
import { useDeleteBook } from '../hooks/useDeleteBook';
import { PageHeader } from '../components/PageHeader';
import { BookFilters } from '../components/BookFilters';
import { BookTable } from '../components/BookTable';
import { Pagination } from '../components/Pagination';
import { DeleteBookDialog } from '../components/DeleteBookDialog';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import {
  DEFAULT_PAGE_SIZE,
  SEARCH_DEBOUNCE_MS,
  type BookItem,
  type BookStatus,
} from '../types/book';

export function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | ''>('');
  const [page, setPage] = useState(1);
  const [bookToDelete, setBookToDelete] = useState<BookItem | null>(null);

  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const { data, isLoading, isError, error, refetch } = useBooks({
    q: debouncedQuery.trim() || undefined,
    tag: selectedTag || undefined,
    status: selectedStatus || undefined,
    page,
    limit: DEFAULT_PAGE_SIZE,
  });

  const deleteBookMutation = useDeleteBook();

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

  function handleOpenDeleteDialog(book: BookItem) {
    deleteBookMutation.reset();
    setBookToDelete(book);
  }

  function handleCloseDeleteDialog() {
    if (deleteBookMutation.isPending) {
      return;
    }
    deleteBookMutation.reset();
    setBookToDelete(null);
  }

  function handleConfirmDelete() {
    if (!bookToDelete) {
      return;
    }
    deleteBookMutation.mutate(bookToDelete.id, {
      onSuccess: () => {
        setBookToDelete(null);
      },
    });
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
        <>
          <BookTable books={data.data} onDelete={handleOpenDeleteDialog} />
          <Pagination
            page={page}
            pageSize={DEFAULT_PAGE_SIZE}
            total={data.total}
            onPageChange={setPage}
          />
        </>
      )}

      <DeleteBookDialog
        isOpen={Boolean(bookToDelete)}
        bookTitle={bookToDelete?.title ?? ''}
        isDeleting={deleteBookMutation.isPending}
        error={deleteBookMutation.error}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
      />
    </div>
  );
}
