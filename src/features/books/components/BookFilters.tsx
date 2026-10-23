interface BookFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function BookFilters({ searchQuery, onSearchChange }: BookFiltersProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-wrap items-end gap-4 rounded-card border border-border bg-surface p-5 shadow-xs"
    >
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
    </form>
  );
}
