export const DEFAULT_SKELETON_ROWS = 6;
export const COMPACT_SKELETON_ROWS = 3;

export type LoadingVariant = 'table' | 'rows' | 'detail' | 'form';

interface LoadingStateProps {
  label?: string;
  variant?: LoadingVariant;
  rows?: number;
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex items-center justify-between gap-6 border-t border-border px-6 py-4"
        >
          <div className="h-3.5 w-[36%] animate-pulse rounded-full bg-surface-tint" />
          <div className="h-3.5 w-[22%] animate-pulse rounded-full bg-surface-row-alt" />
          <div className="h-3.5 w-[10%] animate-pulse rounded-full bg-surface-row-alt" />
          <div className="h-7 w-[88px] animate-pulse rounded-full bg-surface-row-alt" />
        </div>
      ))}
    </>
  );
}

export function LoadingState({
  label = 'Loading...',
  variant = 'table',
  rows = DEFAULT_SKELETON_ROWS,
}: LoadingStateProps) {
  if (variant === 'rows') {
    return (
      <div role="status" aria-busy="true" aria-label={label} className="w-full">
        <span className="sr-only">{label}</span>
        <SkeletonRows count={rows} />
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={label}
        className="flex w-full flex-col gap-6"
      >
        <span className="sr-only">{label}</span>
        <div
          aria-hidden="true"
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="flex w-full max-w-md flex-col gap-3">
            <div className="h-8 w-3/4 animate-pulse rounded-full bg-surface-tint" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-surface-row-alt" />
            <div className="flex gap-2 pt-1">
              <div className="h-6 w-20 animate-pulse rounded-full bg-surface-tint" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-surface-row-alt" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-11 w-24 animate-pulse rounded-control bg-surface-tint" />
            <div className="h-11 w-24 animate-pulse rounded-control bg-surface-row-alt" />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr]"
        >
          <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6 shadow-xs">
            <div className="h-5 w-40 animate-pulse rounded-full bg-surface-tint" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="h-12 animate-pulse rounded-control bg-surface-row-alt" />
              <div className="h-12 animate-pulse rounded-control bg-surface-row-alt" />
              <div className="h-12 animate-pulse rounded-control bg-surface-row-alt" />
              <div className="h-12 animate-pulse rounded-control bg-surface-row-alt" />
            </div>
            <div className="h-16 animate-pulse rounded-control bg-surface-row-alt" />
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-card border border-border bg-surface p-6 shadow-xs">
            <div className="h-5 w-24 animate-pulse rounded-full bg-surface-tint" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-20 animate-pulse rounded-control bg-surface-row-alt" />
              <div className="h-20 animate-pulse rounded-control bg-surface-row-alt" />
              <div className="h-20 animate-pulse rounded-control bg-surface-tint" />
            </div>
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-surface-row-alt" />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="overflow-hidden rounded-card border border-border bg-surface shadow-xs"
        >
          <div className="h-11 bg-surface-row-alt" />
          <SkeletonRows count={COMPACT_SKELETON_ROWS} />
        </div>
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={label}
        className="w-full max-w-[780px] rounded-card border border-border bg-surface p-6 shadow-xs sm:p-8"
      >
        <span className="sr-only">{label}</span>
        <div aria-hidden="true" className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="h-3.5 w-20 animate-pulse rounded-full bg-surface-tint" />
            <div className="h-11 w-full animate-pulse rounded-control bg-surface-row-alt" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3.5 w-24 animate-pulse rounded-full bg-surface-tint" />
            <div className="h-11 w-full animate-pulse rounded-control bg-surface-row-alt" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-11 animate-pulse rounded-control bg-surface-row-alt" />
            <div className="h-11 animate-pulse rounded-control bg-surface-row-alt" />
          </div>
          <div className="h-24 w-full animate-pulse rounded-control bg-surface-row-alt" />
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className="overflow-hidden rounded-card border border-border bg-surface shadow-xs"
    >
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="h-11 bg-surface-row-alt" />
      <SkeletonRows count={rows} />
    </div>
  );
}
