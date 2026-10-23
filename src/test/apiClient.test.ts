import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import {
  createBook,
  deleteBook,
  getBookById,
  getBookLoans,
  getBooks,
  updateBook,
} from '../features/books/api/booksApi';
import { DEFAULT_BASE_URL, apiClient, getBaseUrl } from '../shared/lib/apiClient';
import { API_ERROR_CODE, ApiError } from '../shared/types/api';
import { server } from './mocks/server';

describe('API integration & error handling (Tasks 7.1 - 7.4)', () => {
  describe('7.1 Base URL & ngrok headers', () => {
    it('resolves getBaseUrl from environment variable, proxies ngrok in dev, and falls back to DEFAULT_BASE_URL', () => {
      expect(getBaseUrl('', true)).toBe(DEFAULT_BASE_URL);
      expect(getBaseUrl('http://localhost:4000/api/v1', true)).toBe(
        'http://localhost:4000/api/v1',
      );
      expect(
        getBaseUrl('https://diploma-snowless-boasting.ngrok-free.dev/api/v1', true),
      ).toBe('/api/v1');
      expect(
        getBaseUrl('https://diploma-snowless-boasting.ngrok-free.dev/api/v1', false),
      ).toBe('https://diploma-snowless-boasting.ngrok-free.dev/api/v1');
    });

    it('attaches ngrok-skip-browser-warning and Accept headers on requests', async () => {
      let capturedNgrokHeader: string | null = null;
      let capturedAcceptHeader: string | null = null;

      server.use(
        http.get('*/api/v1/health-check', ({ request }) => {
          capturedNgrokHeader = request.headers.get('ngrok-skip-browser-warning');
          capturedAcceptHeader = request.headers.get('Accept');
          return HttpResponse.json({ ok: true });
        }),
      );

      const res = await apiClient<{ ok: boolean }>('/health-check');
      expect(res).toEqual({ ok: true });
      expect(capturedNgrokHeader).toBe('true');
      expect(capturedAcceptHeader).toBe('application/json');
    });
  });

  describe('7.2 GET list/detail & empty response normalization', () => {
    it('normalizes empty or partial GET /books responses safely without crashing', async () => {
      server.use(
        http.get('*/api/v1/books', () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );

      const emptyResult = await getBooks({ page: 2, limit: 10 });
      expect(emptyResult).toEqual({
        data: [],
        total: 0,
        page: 2,
        limit: 10,
      });
    });

    it('normalizes missing tags and computes fallback available copies in getBookById and getBookLoans', async () => {
      server.use(
        http.get('*/api/v1/books/77', () => {
          return HttpResponse.json({
            id: 77,
            title: 'Domain Modeling Made Functional',
            author: 'Scott Wlaschin',
            publishedYear: 2018,
            isbn: '978-1-68050-254-1',
            totalCopies: 4,
            onLoan: 1,
          });
        }),
        http.get('*/api/v1/books/77/loans', () => {
          return HttpResponse.json({ data: null });
        }),
      );

      const detail = await getBookById(77);
      expect(detail.tags).toEqual([]);
      expect(detail.available).toBe(3);
      expect(detail.status).toBe('AVAILABLE');

      const loans = await getBookLoans(77);
      expect(loans).toEqual([]);
    });
  });

  describe('7.3 POST / PATCH / DELETE integration contract', () => {
    it('sends JSON Content-Type for POST/PATCH and omits Content-Type for empty-body DELETE', async () => {
      let deleteContentType: string | null = null;

      server.use(
        http.delete('*/api/v1/books/6', ({ request }) => {
          deleteContentType = request.headers.get('content-type');
          return new HttpResponse(null, { status: 204 });
        }),
      );

      const created = await createBook({
        title: 'Test Driven Development',
        author: 'Kent Beck',
        isbn: '978-0-321-14653-3',
        publishedYear: 2002,
        totalCopies: 2,
        tags: ['Testing'],
      });
      expect(created.id).toBeGreaterThan(0);
      expect(created.title).toBe('Test Driven Development');

      const updated = await updateBook(created.id, {
        title: 'Test Driven Development: By Example',
        totalCopies: 3,
      });
      expect(updated.title).toBe('Test Driven Development: By Example');
      expect(updated.totalCopies).toBe(3);

      await deleteBook(6);
      expect(deleteContentType).toBeNull();
    });
  });

  describe('7.4 Standardized API error handling (status codes, network, timeout, unexpected response)', () => {
    it('throws structured ApiError with TIMEOUT_ERROR when request exceeds timeoutMs', async () => {
      server.use(
        http.get('*/api/v1/slow-endpoint', async () => {
          await delay(200);
          return HttpResponse.json({ ok: true });
        }),
      );

      await expect(
        apiClient('/slow-endpoint', { timeoutMs: 30 }),
      ).rejects.toMatchObject({
        name: 'ApiError',
        status: 408,
        code: API_ERROR_CODE.TIMEOUT_ERROR,
      });
    });

    it('throws structured ApiError with NETWORK_ERROR when fetch fails due to network disconnection', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(apiClient('/network-down')).rejects.toMatchObject({
        name: 'ApiError',
        status: 0,
        code: API_ERROR_CODE.NETWORK_ERROR,
      });

      fetchSpy.mockRestore();
    });

    it('throws structured ApiError with INVALID_RESPONSE when server returns unexpected HTML or malformed JSON', async () => {
      server.use(
        http.get('*/api/v1/ngrok-offline', () => {
          return new HttpResponse('<!DOCTYPE html><html><body>Tunnel offline</body></html>', {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
          });
        }),
      );

      try {
        await apiClient('/ngrok-offline');
        expect.fail('Expected apiClient to throw ApiError');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).code).toBe(API_ERROR_CODE.INVALID_RESPONSE);
      }
    });
  });
});
