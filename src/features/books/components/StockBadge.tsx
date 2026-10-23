import { BOOK_STATUS, type BookStatus } from '../types/book';

interface StockBadgeProps {
  status: BookStatus;
}

const STATUS_CONFIG: Record<BookStatus, { label: string; className: string }> = {
  [BOOK_STATUS.AVAILABLE]: {
    label: 'Available',
    className: 'bg-success-surface text-success-ink',
  },
  [BOOK_STATUS.OUT_OF_STOCK]: {
    label: 'Out of stock',
    className: 'bg-warn-surface text-warn-ink',
  },
  [BOOK_STATUS.ARCHIVED]: {
    label: 'Archived',
    className: 'bg-surface-row-alt text-ink-muted border border-border',
  },
};

export function StockBadge({ status }: StockBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-surface-row-alt text-ink-muted',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-normal ${config.className}`}
    >
      {config.label}
    </span>
  );
}
