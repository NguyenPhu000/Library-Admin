import { describe, expect, it } from 'vitest';

import { getBreadcrumbs } from '../components/layout/breadcrumbs';

describe('getBreadcrumbs', () => {
  it('returns Books for the root path', () => {
    expect(getBreadcrumbs('/')).toEqual([{ label: 'Books' }]);
  });

  it('returns a single current crumb for top-level sections', () => {
    expect(getBreadcrumbs('/books')).toEqual([{ label: 'Books' }]);
    expect(getBreadcrumbs('/members')).toEqual([{ label: 'Members' }]);
  });

  it('returns Books / Add book for the create route', () => {
    expect(getBreadcrumbs('/books/new')).toEqual([
      { label: 'Books', to: '/books' },
      { label: 'Add book' },
    ]);
  });

  it('returns Books / Book details for the detail route', () => {
    expect(getBreadcrumbs('/books/12')).toEqual([
      { label: 'Books', to: '/books' },
      { label: 'Book details' },
    ]);
  });

  it('returns Books / Book details / Edit for the edit route', () => {
    expect(getBreadcrumbs('/books/12/edit')).toEqual([
      { label: 'Books', to: '/books' },
      { label: 'Book details', to: '/books/12' },
      { label: 'Edit' },
    ]);
  });

  it('returns Not found for unknown paths', () => {
    expect(getBreadcrumbs('/nope')).toEqual([{ label: 'Not found' }]);
    expect(getBreadcrumbs('/books/12/edit/extra')).toEqual([{ label: 'Not found' }]);
    expect(getBreadcrumbs('/members/1')).toEqual([{ label: 'Not found' }]);
  });
});
