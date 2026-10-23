import { http, HttpResponse } from 'msw';
import {
  addSeedBook,
  getSeedBookDetail,
  getSeedBookLoans,
  removeSeedBook,
  SEED_BOOKS,
  SEED_TAGS,
  updateSeedBook,
} from './data';
import {
  API_ERROR_CODE,
  type ApiErrorResponse,
  type PaginatedResponse,
} from '../../shared/types/api';
import type {
  BookItem,
  CreateBookPayload,
  UpdateBookPayload,
} from '../../features/books/types/book';

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
          code: API_ERROR_CODE.BOOK_NOT_FOUND,
          message: `Book with ID ${rawId} does not exist`,
          requestId: 'req-123',
        },
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    return HttpResponse.json(detail);
  }),

  http.get('*/api/v1/books/:id/loans', ({ params }) => {
    const rawId = String(params.id ?? '');
    const id = Number(rawId);
    const detail = Number.isInteger(id) ? getSeedBookDetail(id) : undefined;

    if (!detail) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: API_ERROR_CODE.BOOK_NOT_FOUND,
          message: `Book with ID ${rawId} does not exist`,
          requestId: 'req-124',
        },
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    return HttpResponse.json({
      data: getSeedBookLoans(id),
    });
  }),

  http.post('*/api/v1/books', async ({ request }) => {
    const body = (await request.json()) as CreateBookPayload;
    const duplicateIsbn = SEED_BOOKS.some((b) => b.isbn === body.isbn);

    if (duplicateIsbn) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: API_ERROR_CODE.ISBN_ALREADY_EXISTS,
          message: 'Book with this ISBN already exists',
          requestId: 'req-post-409',
        },
      };
      return HttpResponse.json(errorResponse, { status: 409 });
    }

    const created = addSeedBook(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch('*/api/v1/books/:id', async ({ params, request }) => {
    const rawId = String(params.id ?? '');
    const id = Number(rawId);
    const detail = Number.isInteger(id) ? getSeedBookDetail(id) : undefined;

    if (!detail) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: API_ERROR_CODE.BOOK_NOT_FOUND,
          message: `Book with ID ${rawId} does not exist`,
          requestId: 'req-patch-404',
        },
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    const body = (await request.json()) as UpdateBookPayload;
    if (typeof body.totalCopies === 'number' && body.totalCopies < detail.onLoan) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: API_ERROR_CODE.VALIDATION_ERROR,
          message: `Total copies cannot be less than currently on loan (${detail.onLoan})`,
          details: {
            totalCopies: [
              `Stock cannot be less than copies currently on loan (${detail.onLoan})`,
            ],
          },
          requestId: 'req-patch-400',
        },
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    const updated = updateSeedBook(id, body);
    return HttpResponse.json(updated);
  }),

  http.delete('*/api/v1/books/:id', async ({ params, request }) => {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const rawBody = await request.text();
      if (!rawBody.trim()) {
        return HttpResponse.json(
          {
            error: {
              code: 'FST_ERR_CTP_EMPTY_JSON_BODY',
              message: "Body cannot be empty when content-type is set to 'application/json'",
            },
          },
          { status: 400 },
        );
      }
    }

    const rawId = String(params.id ?? '');
    const id = Number(rawId);
    const detail = Number.isInteger(id) ? getSeedBookDetail(id) : undefined;

    if (!detail) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: API_ERROR_CODE.BOOK_NOT_FOUND,
          message: `Book with ID ${rawId} does not exist`,
          requestId: 'req-125',
        },
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    if (detail.onLoan > 0) {
      const copyWord = detail.onLoan === 1 ? 'copy is' : 'copies are';
      const errorResponse: ApiErrorResponse = {
        error: {
          code: API_ERROR_CODE.BOOK_HAS_ACTIVE_LOANS,
          message: `Cannot delete book while ${detail.onLoan} ${copyWord} currently on loan`,
          details: {
            activeLoansCount: detail.onLoan,
          },
          requestId: 'req-456',
        },
      };
      return HttpResponse.json(errorResponse, { status: 409 });
    }

    removeSeedBook(id);
    return new HttpResponse(null, { status: 204 });
  }),
];
