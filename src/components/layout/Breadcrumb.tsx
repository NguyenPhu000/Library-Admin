import { Link, useLocation } from 'react-router';

import { getBreadcrumbs } from './breadcrumbs';

export function Breadcrumb() {
  const { pathname } = useLocation();
  const items = getBreadcrumbs(pathname);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={item.label} className="breadcrumb__item">
              {isCurrent || !item.to ? (
                <span
                  className="breadcrumb__current"
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link className="breadcrumb__link" to={item.to}>
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
