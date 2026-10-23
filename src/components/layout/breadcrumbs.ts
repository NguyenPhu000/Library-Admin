export interface BreadcrumbItem {
  label: string;
  to?: string;
}

const SECTION_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  books: 'Books',
  members: 'Members',
  loans: 'Loans',
};

const NOT_FOUND_CRUMBS: BreadcrumbItem[] = [{ label: 'Not found' }];

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const [section, second, third] = segments;

  if (!section) {
    return [{ label: 'Books' }];
  }

  const sectionLabel = SECTION_LABELS[section];
  if (!sectionLabel) {
    return NOT_FOUND_CRUMBS;
  }

  if (section !== 'books' || !second) {
    return segments.length === 1 ? [{ label: sectionLabel }] : NOT_FOUND_CRUMBS;
  }

  const booksCrumb: BreadcrumbItem = { label: 'Books', to: '/books' };

  if (segments.length === 2) {
    return second === 'new'
      ? [booksCrumb, { label: 'Add book' }]
      : [booksCrumb, { label: 'Book details' }];
  }

  if (segments.length === 3 && third === 'edit' && second !== 'new') {
    return [booksCrumb, { label: 'Book details', to: `/books/${second}` }, { label: 'Edit' }];
  }

  return NOT_FOUND_CRUMBS;
}
