import type { BookDetail } from '../types/book';

interface StockCardProps {
  book: BookDetail;
}

export function StockCard({ book }: StockCardProps) {
  return (
    <section
      aria-labelledby="book-stock-heading"
      className="flex flex-col justify-between gap-4 rounded-card border border-border bg-surface p-6 shadow-xs"
    >
      <div className="flex flex-col gap-4">
        <h2 id="book-stock-heading" className="m-0 text-base font-bold text-ink">
          Stock
        </h2>

        <dl className="m-0 grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1 rounded-[12px] bg-surface-row-alt p-4">
            <dt className="text-xs font-semibold text-ink-muted">Total copies</dt>
            <dd className="m-0 font-display text-[28px] font-extrabold leading-tight tabular-nums text-ink">
              {book.totalCopies}
            </dd>
          </div>

          <div className="flex flex-col gap-1 rounded-[12px] bg-surface-row-alt p-4">
            <dt className="text-xs font-semibold text-ink-muted">On loan</dt>
            <dd className="m-0 font-display text-[28px] font-extrabold leading-tight tabular-nums text-ink">
              {book.onLoan}
            </dd>
          </div>

          <div className="flex flex-col gap-1 rounded-[12px] bg-surface-tint p-4">
            <dt className="text-xs font-semibold text-brand-600">Available</dt>
            <dd className="m-0 font-display text-[28px] font-extrabold leading-tight tabular-nums text-brand-600">
              {book.available}
            </dd>
          </div>
        </dl>
      </div>

      <p className="m-0 text-sm text-ink-muted">
        Members are reminded 24 hours before the due date.
      </p>
    </section>
  );
}
