import type { ReactNode } from 'react';
import { Link } from 'react-router';

export type EmptyStateVariant = 'card' | 'inline';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  icon?: ReactNode;
  variant?: EmptyStateVariant;
}

function DefaultSearchIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  icon,
  variant = 'card',
}: EmptyStateProps) {
  const containerClassName =
    variant === 'inline'
      ? 'flex flex-col items-center justify-center gap-2 border-t border-border px-6 py-10 text-center'
      : 'flex flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface px-6 py-12 text-center shadow-xs';

  return (
    <div className={containerClassName}>
      {variant === 'card' && (
        <div
          aria-hidden="true"
          className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-surface-tint text-brand-600"
        >
          {icon ?? <DefaultSearchIcon />}
        </div>
      )}

      <p className="m-0 font-display text-lg font-bold text-ink">{title}</p>

      {description && (
        <p className="m-0 max-w-md text-sm leading-relaxed text-ink-muted">{description}</p>
      )}

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-1 inline-flex min-h-11 items-center justify-center rounded-control border border-surface-tint-border bg-surface-tint px-4 text-sm font-semibold text-brand-600 no-underline transition-colors hover:bg-surface-row-alt hover:text-night-700"
        >
          {actionLabel}
        </Link>
      )}

      {actionLabel && !actionTo && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-control border border-surface-tint-border bg-surface-tint px-4 text-sm font-semibold text-brand-600 transition-colors hover:bg-surface-row-alt hover:text-night-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
