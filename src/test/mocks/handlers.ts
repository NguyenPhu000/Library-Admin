import { http, HttpResponse } from 'msw';
import { getSeedBookDetail, SEED_BOOKS, SEED_TAGS } from './data';
import type { ApiErrorResponse, PaginatedResponse } from '../../shared/types/api';
import type { BookItem } from '../../features/books/types/book';

export const handlers = [
  http.get('*/api/v1/tags', () => {
    return HttpResponse.json({ data: SEED_TAGS });
  }),

  http.get('*/api/v1/books', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase() ?? '';
    const tag = url.searchParams.get('tag') ?? '';
    const status = url.searchParams.get('status') ?? '';
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
    const limit = Math.max(1, parseInt(url.searchParams.get('limit') ?? '10', 10));

    let filtered = [...SEED_BOOKS];

    if (q) {
      filtered = filtered.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
      );
    }

    if (tag) {
      filtered = filtered.filter((b) => b.tags.includes(tag));
    }

    if (status) {
      filtered = filtered.filter((b) => b.status === status);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    const response: PaginatedResponse<BookItem> = {
      data: paginated,
      total,
      page,
      limit,
    };

    return HttpResponse.json(response);
  }),

  http.get('*/api/v1/books/:id', ({ params }) => {
    const rawId = String(params.id ?? '');
    const id = Number(rawId);
    const detail = Number.isInteger(id) ? getSeedBookDetail(id) : undefined;

    if (!detail) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'BOOK_NOT_FOUND',
          message: `Book with ID ${rawId} does not exist`,
          requestId: 'req-123',
        },
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    return HttpResponse.json(detail);
  }),
];
