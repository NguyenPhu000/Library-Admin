import type { BookStatus } from '../types/book';

interface BookFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
  selectedStatus: BookStatus | '';
  onStatusChange: (status: BookStatus | '') => void;
  onClearFilters: () => void;
  availableTags?: string[];
}

export function BookFilters({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  selectedStatus,
  onStatusChange,
  onClearFilters,
  availableTags = [],
}: BookFiltersProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-wrap items-end gap-4 rounded-card border border-border bg-surface p-5 shadow-xs"
    >
      {/* Search Input */}
      <label className="flex flex-1 min-w-[280px] flex-col gap-1.5 text-[13px] font-semibold text-ink">
        Search
        <div className="flex min-h-[44px] items-center gap-2 rounded-control border border-border bg-surface px-3 text-ink-muted transition-colors focus-within:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0 text-ink-muted"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or author"
            className="flex-1 min-w-0 border-0 bg-transparent font-sans text-sm font-normal text-ink outline-none placeholder:text-ink-muted"
          />
        </div>
      </label>

      {/* Tag Select */}
      <label className="flex flex-[1_1_160px] min-w-[140px] flex-col gap-1.5 text-[13px] font-semibold text-ink">
        Tag
        <div className="relative">
          <select
            aria-label="Tag"
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="min-h-[44px] w-full appearance-none rounded-control border border-border bg-surface pl-3 pr-8 font-sans text-sm font-normal text-ink outline-none transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600 cursor-pointer"
          >
            <option value="">All tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </label>

      {/* Status Select */}
      <label className="flex flex-[1_1_160px] min-w-[140px] flex-col gap-1.5 text-[13px] font-semibold text-ink">
        Status
        <div className="relative">
          <select
            aria-label="Status"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as BookStatus | '')}
            className="min-h-[44px] w-full appearance-none rounded-control border border-border bg-surface pl-3 pr-8 font-sans text-sm font-normal text-ink outline-none transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600 cursor-pointer"
          >
            <option value="">All</option>
            <option value="AVAILABLE">Available</option>
            <option value="OUT_OF_STOCK">Out of stock</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </label>

      {/* Clear Filters Button */}
      <button
        type="button"
        onClick={onClearFilters}
        className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-control border border-surface-tint-border bg-surface-tint px-4 font-sans text-sm font-semibold text-brand-600 transition-colors hover:bg-surface-row-alt hover:text-night-700"
      >
        Clear filters
      </button>
    </form>
  );
}
