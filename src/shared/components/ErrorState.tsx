import { ApiError } from '../types/api';

export const DEFAULT_ERROR_TITLE = "Couldn't load books";
export const DEFAULT_ERROR_MESSAGE =
  'The server did not respond. Check your connection and try again.';
export const DEFAULT_RETRY_LABEL = 'Try again';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: unknown;
  requestId?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

function resolveErrorMessage(error: unknown, fallbackMessage?: string): string {
  if (typeof fallbackMessage === 'string' && fallbackMessage.trim().length > 0) {
    return fallbackMessage.trim();
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.trim();
  }
  return DEFAULT_ERROR_MESSAGE;
}

function resolveRequestId(error: unknown, explicitRequestId?: string): string | undefined {
  if (typeof explicitRequestId === 'string' && explicitRequestId.trim().length > 0) {
    return explicitRequestId.trim();
  }
  if (error instanceof ApiError && typeof error.requestId === 'string' && error.requestId.trim()) {
    return error.requestId.trim();
  }
  return undefined;
}

export function ErrorState({
  title = DEFAULT_ERROR_TITLE,
  message,
  error,
  requestId,
  retryLabel = DEFAULT_RETRY_LABEL,
  onRetry,
  className = '',
}: ErrorStateProps) {
  const resolvedMessage = resolveErrorMessage(error, message);
  const resolvedRequestId = resolveRequestId(error, requestId);

  return (
    <div
      role="alert"
      className={`flex w-full flex-col items-center justify-center gap-3 rounded-card border border-warn-border bg-warn-surface p-11 text-center text-warn-ink ${className}`.trim()}
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-surface shadow-2xs"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="fill-none stroke-warn-icon stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <h2 className="m-0 font-display text-xl font-extrabold leading-tight text-warn-ink">
        {title}
      </h2>

      <p className="m-0 max-w-md text-sm leading-relaxed text-warn-ink">
        <span>{resolvedMessage}</span>
        {resolvedRequestId && (
          <>
            {' '}
            <span className="font-mono text-xs">Request ID: {resolvedRequestId}</span>
          </>
        )}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-control border border-brand-600 bg-brand-600 px-5 text-sm font-semibold text-on-dark transition-colors hover:bg-night-700"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
