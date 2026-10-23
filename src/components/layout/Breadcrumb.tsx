import { Link, useLocation } from 'react-router';

import { getBreadcrumbs, useBreadcrumbDetailLabel } from './breadcrumbs';

export function Breadcrumb() {
  const { pathname } = useLocation();
  const detailLabel = useBreadcrumbDetailLabel();
  const items = getBreadcrumbs(pathname, detailLabel);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="m-0 flex flex-wrap items-center gap-2 p-0 list-none text-sm text-ink-muted">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={`${index}-${item.label}`} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-ink-muted select-none">
                  /
                </span>
              )}
              {isCurrent || !item.to ? (
                <span
                  className="font-semibold text-ink"
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  className="text-ink-muted no-underline hover:text-brand-600 hover:underline"
                  to={item.to}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
