import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebounce } from '../shared/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately on mount', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('updates debounced value only after the specified delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 300 },
    });

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 300 });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('second');
  });

  it('cancels previous timer when value changes rapidly', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'ab' });
    act(() => {
      vi.advanceTimersByTime(150);
    });

    rerender({ value: 'abc' });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('abc');
  });
});
