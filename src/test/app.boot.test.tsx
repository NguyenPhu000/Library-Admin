import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '../app/App';

describe('app boot', () => {
  it('renders the admin shell and books page', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Library Admin' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Books' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Books' })).toBeInTheDocument();
  });
});
