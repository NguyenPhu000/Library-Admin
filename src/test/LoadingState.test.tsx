import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoadingState } from '../shared/components/LoadingState';

describe('LoadingState', () => {
  it('renders accessible table skeleton with status role and aria-busy without fake content', () => {
    render(<LoadingState label="Loading books..." variant="table" rows={6} />);

    const status = screen.getByRole('status', { name: 'Loading books...' });
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders detail and form variants with accessible status role', () => {
    const { rerender } = render(
      <LoadingState label="Loading book details..." variant="detail" />,
    );
    expect(screen.getByRole('status', { name: 'Loading book details...' })).toHaveAttribute(
      'aria-busy',
      'true',
    );

    rerender(<LoadingState label="Loading book form..." variant="form" />);
    expect(screen.getByRole('status', { name: 'Loading book form...' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });
});
