import { Link } from 'react-router';

interface PageHeaderProps {
  title: string;
  description: string;
  actionText?: string;
  actionTo?: string;
}

export function PageHeader({ title, description, actionText, actionTo }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[32px] font-extrabold leading-tight text-ink">
          {title}
        </h1>
        <p className="m-0 text-sm text-ink-muted">{description}</p>
      </div>

      {actionText && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-control bg-brand-600 px-[18px] font-semibold text-white no-underline transition-colors hover:bg-night-700"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          {actionText}
        </Link>
      )}
    </div>
  );
}
