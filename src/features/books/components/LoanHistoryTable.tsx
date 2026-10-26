import { Link } from 'react-router';

import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import {
  COMPACT_SKELETON_ROWS,
  LoadingState,
} from '../../../shared/components/LoadingState';
import { LOAN_STATUS, type Loan, type LoanStatus } from '../types/book';

interface LoanHistoryTableProps {
  loans: Loan[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  errorMessage?: string;
  onRetry?: () => void;
}

const LOAN_STATUS_CONFIG: Record<LoanStatus, { label: string; className: string }> = {
  [LOAN_STATUS.ACTIVE]: {
    label: 'Active',
    className: 'bg-surface-tint text-brand-600',
  },
  [LOAN_STATUS.OVERDUE]: {
    label: 'Overdue',
    className: 'bg-warn-surface text-warn-ink',
  },
  [LOAN_STATUS.RETURNED]: {
    label: 'Returned',
    className: 'bg-success-surface text-success-ink',
  },
};

const LOAN_COLUMNS = ['Member', 'Borrowed', 'Due', 'Returned', 'Status'] as const;

export function LoanHistoryTable({
  loans,
  isLoading = false,
  isError = false,
  error,
  errorMessage,
  onRetry,
}: LoanHistoryTableProps) {
  return (
    <section
      aria-labelledby="loan-history-heading"
      className="overflow-hidden rounded-card border border-border bg-surface shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <h2 id="loan-history-heading" className="m-0 text-base font-bold text-ink">
          Loan history
        </h2>
        <Link
          to="/loans"
          className="text-sm font-semibold text-brand-600 underline transition-colors hover:text-night-700"
        >
          View all loans
        </Link>
      </div>

      {isLoading && (
        <LoadingState
          label="Loading loan history..."
          variant="rows"
          rows={COMPACT_SKELETON_ROWS}
        />
      )}

      {!isLoading && isError && (
        <ErrorState
          title="Couldn't load loan history"
          error={error}
          message={errorMessage || 'Failed to load loan history'}
          retryLabel="Retry"
          onRetry={onRetry}
          className="rounded-none border-x-0 border-b-0"
        />
      )}

      {!isLoading && !isError && loans.length === 0 && (
        <EmptyState
          variant="inline"
          title="No loan history for this book."
          description="When a member borrows this book, the loan record will appear here."
        />
      )}

      {!isLoading && !isError && loans.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr className="bg-surface-row-alt text-xs font-semibold uppercase tracking-wider text-ink-muted">
                {LOAN_COLUMNS.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-6 py-3 text-left font-semibold whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const badgeConfig = LOAN_STATUS_CONFIG[loan.status] ?? {
                  label: loan.status,
                  className: 'bg-surface-row-alt text-ink-muted',
                };

                return (
                  <tr
                    key={loan.id}
                    className="border-t border-border text-sm transition-colors hover:bg-surface-row-alt"
                  >
                    <td className="px-6 py-3.5 text-left align-middle font-semibold text-ink">
                      {loan.memberName}
                    </td>
                    <td className="px-6 py-3.5 text-left align-middle tabular-nums text-ink-muted">
                      {loan.borrowedDate}
                    </td>
                    <td className="px-6 py-3.5 text-left align-middle tabular-nums text-ink-muted">
                      {loan.dueDate}
                    </td>
                    <td className="px-6 py-3.5 text-left align-middle tabular-nums text-ink-muted">
                      {loan.returnedDate ?? '—'}
                    </td>
                    <td className="px-6 py-3.5 text-left align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-normal ${badgeConfig.className}`}
                      >
                        {badgeConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
