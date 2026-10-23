import type { BookDetail } from '../types/book';

interface BookInformationCardProps {
  book: BookDetail;
}

function formatFieldValue(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '—';
}

export function BookInformationCard({ book }: BookInformationCardProps) {
  const rows = [
    { label: 'ISBN', value: formatFieldValue(book.isbn) },
    { label: 'Publisher', value: formatFieldValue(book.publisher) },
    { label: 'Edition', value: formatFieldValue(book.edition) },
    { label: 'Added on', value: formatFieldValue(book.addedOn) },
    { label: 'Description', value: formatFieldValue(book.description), isMuted: true },
  ];

  return (
    <section
      aria-labelledby="book-information-heading"
      className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6 shadow-xs"
    >
      <h2 id="book-information-heading" className="m-0 text-base font-bold text-ink">
        Book information
      </h2>

      <dl className="m-0 flex flex-col gap-3 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 gap-1 sm:grid-cols-[130px_1fr] sm:items-baseline sm:gap-4"
          >
            <dt className="font-medium text-ink-muted">{row.label}</dt>
            <dd
              className={`m-0 break-words ${
                row.isMuted ? 'text-ink-muted' : 'font-medium text-ink'
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
