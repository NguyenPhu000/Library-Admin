import { describe, expect, it } from 'vitest';

import { buildQueryString } from '../shared/lib/buildQueryString';

describe('buildQueryString', () => {
  it('returns empty string when params is undefined or null', () => {
    expect(buildQueryString()).toBe('');
    expect(buildQueryString(undefined)).toBe('');
  });

  it('builds a query string with valid key-value pairs', () => {
    const result = buildQueryString({
      q: 'clean code',
      page: 1,
      limit: 10,
    });
    expect(result).toBe('?q=clean+code&page=1&limit=10');
  });

  it('omits undefined, null, and empty string values', () => {
    const result = buildQueryString({
      q: '',
      tag: undefined,
      status: null,
      page: 2,
    });
    expect(result).toBe('?page=2');
  });

  it('returns empty string when all params are empty, null or undefined', () => {
    const result = buildQueryString({
      q: '',
      tag: undefined,
      status: null,
    });
    expect(result).toBe('');
  });
});
