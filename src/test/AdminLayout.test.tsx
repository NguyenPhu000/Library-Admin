import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { AdminLayout } from '../components/layout/AdminLayout';

function renderLayout(initialPath: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <AdminLayout />,
        children: [
          { path: 'books', element: <h1>Books</h1> },
          { path: 'books/new', element: <h1>Add book</h1> },
          { path: 'members', element: <h1>Members</h1> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  render(<RouterProvider router={router} />);
}

describe('AdminLayout', () => {
  it('renders the main menu with the four sections and the footer', () => {
    renderLayout('/books');

    const menu = screen.getByRole('navigation', { name: 'Main menu' });
    for (const name of ['Dashboard', 'Books', 'Members', 'Loans']) {
      expect(within(menu).getByRole('link', { name })).toBeInTheDocument();
    }
    expect(screen.getByText('v0.1 · Training project')).toBeInTheDocument();
  });

  it('marks only the current section as the active menu item', () => {
    renderLayout('/books');

    const menu = screen.getByRole('navigation', { name: 'Main menu' });
    expect(within(menu).getByRole('link', { name: 'Books' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(menu).getByRole('link', { name: 'Members' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('keeps Books active on nested book routes', () => {
    renderLayout('/books/new');

    const menu = screen.getByRole('navigation', { name: 'Main menu' });
    expect(within(menu).getByRole('link', { name: 'Books' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('renders the routed page inside the main landmark', () => {
    renderLayout('/books');

    const main = screen.getByRole('main');
    expect(within(main).getByRole('heading', { level: 1, name: 'Books' })).toBeInTheDocument();
  });

  it('shows the breadcrumb for the current route', () => {
    renderLayout('/books/new');

    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(breadcrumb).getByRole('link', { name: 'Books' })).toHaveAttribute(
      'href',
      '/books',
    );
    expect(within(breadcrumb).getByText('Add book')).toHaveAttribute('aria-current', 'page');
  });

  it('shows the user name and a sign out button', () => {
    renderLayout('/books');

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('toggles the mobile menu and closes it with Escape', async () => {
    const user = userEvent.setup();
    renderLayout('/books');

    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('closes the mobile menu after navigating', async () => {
    const user = userEvent.setup();
    renderLayout('/books');

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('link', { name: 'Members' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Members' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });
});
