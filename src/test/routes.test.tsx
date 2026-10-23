import { render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { appRoutes } from '../app/router/routes';

async function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

describe('app routes', () => {
  it('renders / with books page', async () => {
    await renderAt('/');

    expect(await screen.findByRole('heading', { level: 1, name: 'Books' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main menu' })).toBeInTheDocument();
  });

  it.each([
    ['/books', 'Books'],
    ['/books/new', 'Add book'],
    ['/books/7', 'Eloquent JavaScript'],
    ['/books/7/edit', 'Edit book'],
  ])('renders %s with heading "%s"', async (path, heading) => {
    await renderAt(path);

    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main menu' })).toBeInTheDocument();
  });

  it('displays the loaded book title in the header breadcrumb on /books/:bookId', async () => {
    await renderAt('/books/2');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'The Pragmatic Programmer' }),
    ).toBeInTheDocument();

    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(breadcrumb).getByRole('link', { name: 'Books' })).toHaveAttribute(
      'href',
      '/books',
    );
    expect(within(breadcrumb).getByText('The Pragmatic Programmer')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
