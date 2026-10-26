import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_ERROR_MESSAGE,
  DEFAULT_ERROR_TITLE,
  DEFAULT_RETRY_LABEL,
  ErrorState,
} from '../shared/components/ErrorState';
import { ApiError } from '../shared/types/api';

describe('ErrorState', () => {
  it('renders default title and fallback message when no error is provided', () => {
    render(<ErrorState />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: DEFAULT_ERROR_TITLE })).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
  });

  it('extracts message and requestId from ApiError', () => {
    const apiError = new ApiError(500, {
      message: 'The server did not respond. Check your connection and try again.',
      code: 'INTERNAL_SERVER_ERROR',
      requestId: 'req_01HZX8',
    });

    render(<ErrorState title="Couldn't load books" error={apiError} />);

    expect(screen.getByRole('heading', { name: "Couldn't load books" })).toBeInTheDocument();
    expect(
      screen.getByText('The server did not respond. Check your connection and try again.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Request ID: req_01HZX8')).toBeInTheDocument();
  });

  it('calls onRetry when the retry button is clicked', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    render(<ErrorState onRetry={handleRetry} />);

    const retryButton = screen.getByRole('button', { name: DEFAULT_RETRY_LABEL });
    await user.click(retryButton);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
