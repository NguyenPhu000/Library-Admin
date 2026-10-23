import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('test harness', () => {
  it('renders components with accessible queries', () => {
    render(<h1>Library Admin</h1>);

    expect(screen.getByRole('heading', { name: 'Library Admin' })).toBeInTheDocument();
  });
});