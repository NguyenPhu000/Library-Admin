import { Link } from 'react-router';

import type { Loan, LoanStatus } from '../types/book';

interface LoanHistoryTableProps {
  loans: Loan[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

const LOAN_STATUS_CONFIG: Record<LoanStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-surface-tint text-brand-600',
  },
  OVERDUE: {
    label: 'Overdue',
    className: 'bg-warn-surface text-warn-ink',
  },
  RETURNED: {
    label: 'Returned',
    className: 'bg-success-surface text-success-ink',
  },
};

const LOAN_COLUMNS = ['Member', 'Borrowed', 'Due', 'Returned', 'Status'] as const;

export function LoanHistoryTable({
  loans,
  isLoading = false,
  isError = false,
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
        <div
          role="status"
          aria-busy="true"
          className="border-t border-border px-6 py-10 text-center text-sm text-ink-muted"
        >
          <p className="m-0">Loading loan history...</p>
        </div>
      )}

      {!isLoading && isError && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 border-t border-border px-6 py-10 text-center text-sm text-ink"
        >
          <p className="m-0">{errorMessage || 'Failed to load loan history'}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-control border border-border bg-surface px-4 font-semibold text-ink transition-colors hover:bg-surface-row-alt"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && loans.length === 0 && (
        <div className="border-t border-border px-6 py-10 text-center text-sm text-ink-muted">
          <p className="m-0">No loan history for this book.</p>
        </div>
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
                    className="border-t border-border text-sm transition-colors hover:bg-[#faf7fd]"
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
