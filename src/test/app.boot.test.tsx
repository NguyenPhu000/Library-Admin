import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '../app/App';

describe('app boot', () => {
  it('renders the admin shell and books page', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Books' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main menu' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Books' })).toHaveAttribute('aria-current', 'page');
  });
});
