import { useEffect, useId, type ReactNode } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isPending = false,
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isPending) {
        onCancel();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isPending, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/60 p-4 backdrop-blur-xs"
      onClick={() => {
        if (!isPending) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="flex w-full max-w-md flex-col gap-4 rounded-card border border-border bg-surface p-6 text-ink shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <h2 id={titleId} className="m-0 font-display text-xl font-bold text-ink">
            {title}
          </h2>
          <div id={descriptionId} className="m-0 text-sm leading-relaxed text-ink-muted">
            {description}
          </div>
        </div>

        {children}

        <div className="mt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={onCancel}
            className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-control border border-border bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:bg-surface-row-alt disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-control border border-warn-border bg-warn-surface px-4 text-sm font-semibold text-warn-ink transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
