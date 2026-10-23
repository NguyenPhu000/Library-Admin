import { Link } from 'react-router';

interface PageHeaderProps {
  title: string;
  description: string;
  actionText?: string;
  actionTo?: string;
}

export function PageHeader({ title, description, actionText, actionTo }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header__titles">
        <h1 className="page-header__title">{title}</h1>
        <p className="page-header__description">{description}</p>
      </div>

      {actionText && actionTo && (
        <Link to={actionTo} className="page-header__action">
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
