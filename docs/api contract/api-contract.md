# Library Admin - Books API Contract

This document defines the formal API contract between the Fastify backend and the React frontend (Library Admin screens), matching the UI specification.

---

## 1. General Conventions

- **Server Host**: `http://localhost:3000`
- **API Prefix**: `/api/v1`
- **Base URL**: `http://localhost:3000/api/v1`
- **Content-Type**: `application/json; charset=utf-8`
- **Date Format**: ISO Date string (`YYYY-MM-DD`) for business dates, and ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`) for timestamps.
- **Naming**:
  - Request and response JSON keys use `camelCase`.
  - URL paths use plural nouns with `kebab-case`.

### Quick Reference (Full Endpoints)

| Method | Full URL | Action / Description |
| :--- | :--- | :--- |
| `GET` | `http://localhost:3000/api/v1/books` | **Get all books** (Search, filter by tag/status, pagination) |
| `GET` | `http://localhost:3000/api/v1/books/:id` | **Get book detail** by ID |
| `GET` | `http://localhost:3000/api/v1/books/:id/loans` | **Get loan history** for a specific book |
| `POST` | `http://localhost:3000/api/v1/books` | **Create new book** |
| `PATCH` | `http://localhost:3000/api/v1/books/:id` | **Update book** by ID |
| `DELETE` | `http://localhost:3000/api/v1/books/:id` | **Delete book** by ID (fails if `onLoan > 0`) |

---

## 2. Standard Error Format

All error responses (4xx and 5xx) must follow this consistent envelope:

```json
{
  "error": {
    "code": "STRING_ERROR_CODE",
    "message": "Human-readable description of the error",
    "details": {},
    "requestId": "req-1a2b3c4d"
  }
}
```

### Common Error Codes
| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| **400 Bad Request** | `VALIDATION_ERROR` | Request query, params, or body failed validation schema |
| **404 Not Found** | `BOOK_NOT_FOUND` | Book with the specified ID does not exist |
| **409 Conflict** | `BOOK_HAS_ACTIVE_LOANS` | Cannot delete book while copies are currently on loan |
| **409 Conflict** | `ISBN_ALREADY_EXISTS` | Book with this ISBN already exists |
| **500 Internal Server Error** | `INTERNAL_SERVER_ERROR` | Unexpected server or database error |

### Example 400 Validation Error Response (Field Details)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "title": ["Title is required"],
      "totalCopies": ["totalCopies must be greater than or equal to 1"]
    },
    "requestId": "req-1a2b3c4d"
  }
}
```

---

## 3. Data Models (Aligned with Library Admin UI)

### 3.1. Book Item (List Representation)
```typescript
interface BookItem {
  id: number;
  title: string;                   // e.g. "The Pragmatic Programmer"
  author: string;                  // e.g. "David Thomas, Andrew Hunt"
  publishedYear: number;           // e.g. 2019
  isbn: string;                    // e.g. "978-0-13-595705-9"
  publisher: string | null;        // e.g. "Addison-Wesley" or null
  edition: string | null;          // e.g. "20th Anniversary Edition" or null
  description: string | null;      // e.g. "[Short description]" or null
  totalCopies: number;             // e.g. 5
  tags: string[];                  // e.g. ["Programming", "Career"]
  status: "AVAILABLE" | "OUT_OF_STOCK" | "ARCHIVED"; // UI badge: "Available"
  addedOn: string;                 // e.g. "2026-09-12"
  createdAt: string;
  updatedAt: string;
}
```

### 3.2. Book Detail (Detail Screen & Stock Calculation)
```typescript
interface BookDetail extends BookItem {
  onLoan: number;                  // Count of active/overdue loans (e.g. 3)
  available: number;               // totalCopies - onLoan (e.g. 2)
}
```

### 3.3. Loan Item (Loan History Screen)
Matches columns: **MEMBER**, **BORROWED**, **DUE**, **RETURNED**, **STATUS**
```typescript
interface Loan {
  id: number;
  bookId: number;
  memberId: number;
  memberName: string;              // Column MEMBER, e.g. "Minh Tran"
  borrowedDate: string;            // Column BORROWED (YYYY-MM-DD), e.g. "2026-10-15"
  dueDate: string;                 // Column DUE (YYYY-MM-DD), e.g. "2026-10-29"
  returnedDate: string | null;     // Column RETURNED (YYYY-MM-DD or null for "—"), e.g. "2026-10-03"
  status: "ACTIVE" | "OVERDUE" | "RETURNED"; // Column STATUS: "Active", "Overdue", "Returned"
}
```

---

## 4. Endpoints Specification

### 4.1. `GET http://localhost:3000/api/v1/books`
**Action**: Get all books (Search, filter, and paginate books for the Library Admin table).

- **Full URL**: `http://localhost:3000/api/v1/books`
- **Example Request**:
  - `GET http://localhost:3000/api/v1/books?q=pragmatic&tag=Programming&status=AVAILABLE&page=1&limit=10`
- **Query Parameters**:
  - `q` *(optional, string)*: Case-insensitive search on `title` or `author`.
  - `tag` *(optional, string)*: Filter books containing this tag (e.g. `Programming`).
  - `status` *(optional, string)*: Filter by status (`AVAILABLE`, `OUT_OF_STOCK`, `ARCHIVED`).
  - `page` *(optional, integer, default: 1, min: 1)*: Current page number.
  - `limit` *(optional, integer, default: 10, min: 1, max: 100)*: Items per page.

- **Response `200 OK`**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "The Pragmatic Programmer",
      "author": "David Thomas, Andrew Hunt",
      "publishedYear": 2019,
      "isbn": "978-0-13-595705-9",
      "publisher": "Addison-Wesley",
      "edition": "20th Anniversary Edition",
      "description": "[Short description of the book]",
      "totalCopies": 5,
      "tags": ["Programming", "Career"],
      "status": "AVAILABLE",
      "addedOn": "2026-09-12",
      "createdAt": "2026-09-12T08:00:00.000Z",
      "updatedAt": "2026-09-12T08:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### 4.2. `GET http://localhost:3000/api/v1/books/:id`
**Action**: Get single book detail by ID (matching Book Information & Stock cards).

- **Full URL**: `http://localhost:3000/api/v1/books/:id`
- **Example Request**:
  - `GET http://localhost:3000/api/v1/books/1`
- **URL Parameters**:
  - `id` *(required, integer)*: Book ID.

- **Response `200 OK`**:
```json
{
  "id": 1,
  "title": "The Pragmatic Programmer",
  "author": "David Thomas, Andrew Hunt",
  "publishedYear": 2019,
  "isbn": "978-0-13-595705-9",
  "publisher": "Addison-Wesley",
  "edition": "20th Anniversary Edition",
  "description": "[Short description of the book]",
  "addedOn": "2026-09-12",
  "totalCopies": 5,
  "onLoan": 3,
  "available": 2,
  "tags": ["Programming", "Career"],
  "status": "AVAILABLE",
  "createdAt": "2026-09-12T08:00:00.000Z",
  "updatedAt": "2026-09-12T08:00:00.000Z"
}
```

- **Response `404 Not Found`**:
```json
{
  "error": {
    "code": "BOOK_NOT_FOUND",
    "message": "Book with ID 999 does not exist",
    "requestId": "req-123"
  }
}
```

---

### 4.3. `GET http://localhost:3000/api/v1/books/:id/loans`
**Action**: Get loan history for a specific book (matching Loan History table).

- **Full URL**: `http://localhost:3000/api/v1/books/:id/loans`
- **Example Request**:
  - `GET http://localhost:3000/api/v1/books/1/loans`
- **URL Parameters**:
  - `id` *(required, integer)*: Book ID.

- **Response `200 OK`**:
```json
{
  "data": [
    {
      "id": 1,
      "bookId": 1,
      "memberId": 101,
      "memberName": "Minh Tran",
      "borrowedDate": "2026-10-15",
      "dueDate": "2026-10-29",
      "returnedDate": null,
      "status": "ACTIVE"
    },
    {
      "id": 2,
      "bookId": 1,
      "memberId": 102,
      "memberName": "Lan Pham",
      "borrowedDate": "2026-10-02",
      "dueDate": "2026-10-16",
      "returnedDate": null,
      "status": "OVERDUE"
    },
    {
      "id": 3,
      "bookId": 1,
      "memberId": 103,
      "memberName": "Huy Nguyen",
      "borrowedDate": "2026-10-10",
      "dueDate": "2026-10-24",
      "returnedDate": null,
      "status": "ACTIVE"
    },
    {
      "id": 4,
      "bookId": 1,
      "memberId": 104,
      "memberName": "Thao Le",
      "borrowedDate": "2026-09-20",
      "dueDate": "2026-10-04",
      "returnedDate": "2026-10-03",
      "status": "RETURNED"
    },
    {
      "id": 5,
      "bookId": 1,
      "memberId": 105,
      "memberName": "Khoa Vo",
      "borrowedDate": "2026-09-01",
      "dueDate": "2026-09-15",
      "returnedDate": "2026-09-14",
      "status": "RETURNED"
    }
  ]
}
```

- **Response `404 Not Found`** (when book doesn't exist):
```json
{
  "error": {
    "code": "BOOK_NOT_FOUND",
    "message": "Book with ID 999 does not exist",
    "requestId": "req-124"
  }
}
```

---

### 4.4. `POST http://localhost:3000/api/v1/books`
**Action**: Create a new book record.

- **Full URL**: `http://localhost:3000/api/v1/books`
- **Request Body**:
```json
{
  "title": "The Pragmatic Programmer",
  "author": "David Thomas, Andrew Hunt",
  "isbn": "978-0-13-595705-9",
  "publishedYear": 2019,
  "publisher": "Addison-Wesley",
  "edition": "20th Anniversary Edition",
  "description": "[Short description of the book]",
  "totalCopies": 5,
  "tags": ["Programming", "Career"],
  "status": "AVAILABLE"
}
```

- **Validation Rules**:
  - `title`: required, string, min 1, max 255.
  - `author`: required, string, min 1, max 255.
  - `isbn`: required, string, unique.
  - `publishedYear`: required, integer, 1000 - 2100.
  - `publisher`: optional, string, max 255.
  - `edition`: optional, string, max 255.
  - `description`: optional, string.
  - `totalCopies`: required, integer, min 1.
  - `tags`: optional, array of strings.
  - `status`: optional (default: `"AVAILABLE"`), enum `AVAILABLE` | `OUT_OF_STOCK` | `ARCHIVED`.

- **Response `201 Created`**: Returns created BookItem.
- **Response `400 Bad Request`**: Validation error.
- **Response `409 Conflict`**: If ISBN already exists (`ISBN_ALREADY_EXISTS`).

---

### 4.5. `PATCH http://localhost:3000/api/v1/books/:id`
**Action**: Update an existing book record.

- **Full URL**: `http://localhost:3000/api/v1/books/:id`
- **Example Request**:
  - `PATCH http://localhost:3000/api/v1/books/1`
- **URL Parameters**:
  - `id` *(required, integer)*: Book ID.

- **Request Body** *(All fields optional)*:
```json
{
  "title": "The Pragmatic Programmer (Special Edition)",
  "totalCopies": 6,
  "publisher": "Addison-Wesley Professional",
  "edition": "Special Anniversary Edition",
  "status": "AVAILABLE"
}
```

- **Business Logic Constraint**:
  - `totalCopies` must NOT be updated to a number lower than the count of currently active/overdue loans (`onLoan`).

- **Response `200 OK`**: Updated Book object.
- **Response `400 Bad Request`**: Validation failure or `totalCopies < onLoan`.
- **Response `404 Not Found`**: When book does not exist.

---

### 4.6. `DELETE http://localhost:3000/api/v1/books/:id`
**Action**: Delete a book by ID.

- **Full URL**: `http://localhost:3000/api/v1/books/:id`
- **Example Request**:
  - `DELETE http://localhost:3000/api/v1/books/1`
- **URL Parameters**:
  - `id` *(required, integer)*: Book ID.

- **Business Logic Constraint**:
  - If `onLoan > 0` (there are active loans with `status IN ('ACTIVE', 'OVERDUE')` or `returnedDate IS NULL`), deletion **must fail**.

- **Response `204 No Content`**: Deletion successful (empty body).
- **Response `409 Conflict`**:
```json
{
  "error": {
    "code": "BOOK_HAS_ACTIVE_LOANS",
    "message": "Cannot delete book while 3 copies are currently on loan",
    "details": {
      "activeLoansCount": 3
    },
    "requestId": "req-456"
  }
}
```
- **Response `404 Not Found`**: When book does not exist.
