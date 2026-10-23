import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { appRoutes } from '../app/router/routes';

async function renderAt(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
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
    ['/dashboard', 'Dashboard'],
    ['/members', 'Members'],
    ['/loans', 'Loans'],
  ])('renders %s with heading "%s"', async (path, heading) => {
    await renderAt(path);

    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main menu' })).toBeInTheDocument();
  });
});
