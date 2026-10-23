import type { BookStatus } from '../types/book';

interface StockBadgeProps {
  status: BookStatus;
}

const STATUS_CONFIG: Record<BookStatus, { label: string; className: string }> = {
  AVAILABLE: {
    label: 'Available',
    className: 'stock-badge stock-badge--available',
  },
  OUT_OF_STOCK: {
    label: 'Out of stock',
    className: 'stock-badge stock-badge--out-of-stock',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'stock-badge stock-badge--archived',
  },
};

export function StockBadge({ status }: StockBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'stock-badge',
  };

  return <span className={config.className}>{config.label}</span>;
}
