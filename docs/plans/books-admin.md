# Plan — Library Admin UI (Books Management Feature)

- **Trạng thái:** Completed (Hoàn thành 100% các giai đoạn, pipeline xanh 110 tests, sẵn sàng nghiệm thu & demo)
- **Chuẩn quy trình:** `.cursor/skills/react-training-workflow/SKILL.md` & `Training-React.pptx` (Jackson Tran)
- **API Contract:** [`docs/api-contract.md`](../api-contract.md)
- **UI Design Specification:** [`docs/ui-spec.md`](../ui-spec.md) (tham chiếu `Main.dc.html`)
- **Quy tắc làm việc:** Mỗi task nhỏ hoàn thành trong ≤ 1 giờ, tương ứng **1 commit Conventional Commit** trên branch `feat/Books`, chạy xanh `lint + typecheck + test` trước khi commit.

---

## 1. Mục tiêu (Goal)

Xây dựng hoàn chỉnh phân hệ **Quản lý Sách (Admin Books Management)** trong ứng dụng Library Admin theo tiêu chuẩn đào tạo React chuyên nghiệp:
1. **Admin Layout Shell:** Sidebar cố định, Header chứa Breadcrumb động và User profile, chuyển đổi responsive.
2. **Danh sách sách (`/books`):** Bảng 7 cột chuẩn, tìm kiếm từ khóa (`q`), lọc nhãn (`tag`), lọc trạng thái (`status`), phân trang tương tác, đủ 4 trạng thái UI (Loading Skeleton, Empty State, Error State kèm nút Retry, Success Table).
3. **Chi tiết sách (`/books/:bookId`):** Thẻ thông tin sách, Thẻ số liệu tồn kho (`totalCopies`, `onLoan`, `available`), Bảng lịch sử mượn trả (`LoanHistoryTable`).
4. **Biểu mẫu Thêm mới & Chỉnh sửa (`/books/new` & `/books/:bookId/edit`):** Sử dụng React Hook Form + Zod, validate phía client và map lỗi từ server (400 validation, 409 ISBN duplicate, 400 totalCopies < onLoan).
5. **Xóa sách có xác nhận (`DeleteBookDialog`):** Modal xác nhận, xử lý chặn xóa an toàn khi sách có bản sao đang được mượn (409 Conflict - `BOOK_HAS_ACTIVE_LOANS`).
6. **Mạng & Kiểm thử:** Mocking bằng MSW khớp 100% API Contract, bộ test Vitest + React Testing Library kiểm tra hành vi thực tế của người dùng.

---

## 2. Phạm vi (Scope)

### Trong phạm vi (In-Scope)
- Toàn bộ giao diện và luồng nghiệp vụ sách: List, Detail, Create Form, Edit Form, Delete Dialog.
- Shared components & Design tokens theo file đặc tả [`docs/ui-spec.md`](../ui-spec.md).
- Quản lý server state bằng TanStack Query v5 (query keys có cấu trúc, cache invalidation sau mutate).
- Quản lý form bằng React Hook Form + Zod resolver.
- Đầy đủ 3 trạng thái bắt buộc: **Loading, Empty, Error** trên từng màn hình.
- Unit test & Integration test cho từng component và hook nghiệp vụ.

### Ngoài phạm vi (Out-of-Scope)
- Tích hợp backend thật qua ngrok (thực hiện ở bước cuối cùng sau khi BE cung cấp URL và CORS).
- Phân hệ Members, Loans, Dashboard (chỉ đặt link placeholder trong Sidebar).
- Chức năng xác thực (Auth login/register - nút Sign Out chỉ là UI placeholder).
- Import file Excel, tải ảnh bìa.

---

## 3. Cây phân rã Component (Component Tree)

```
App
└─ AppProviders
   ├─ QueryClientProvider (queryClient)
   └─ RouterProvider
      └─ AdminLayout
         ├─ Sidebar (Brand {be}, Nav items: Dashboard, Books [active], Members, Loans, Footer)
         ├─ Header (Breadcrumb, Avatar AU, Admin User, SignOutButton)
         └─ <Outlet />
            ├─ BooksPage (/books)
            │  ├─ PageHeader (Title "Books", Subtitle, Link CTA "Add book")
            │  ├─ BookFilters (Search input, Tag select, Status select, Clear filters button)
            │  ├─ BookTable (7 columns: Title, Author, Year, Tags, Stock, Status, Actions)
            │  │  ├─ TagBadge (pill)
            │  │  └─ StockBadge (Available / Out of stock / Archived)
            │  ├─ Pagination ("Showing X–Y of Z books", Prev, Next, Page buttons)
            │  └─ LoadingSkeleton | EmptyState | ErrorState (+ Retry button)
            │
            ├─ BookDetailPage (/books/:bookId)
            │  ├─ PageHeader (Title, Subtitle, Button "Edit", Button "Delete")
            │  ├─ BookInformationCard (ISBN, Publisher, Edition, Year, Added Date, Tags, Description)
            │  ├─ StockCard (Total copies, On loan, Available - tabular numbers)
            │  ├─ LoanHistoryTable (Columns: Member, Borrowed, Due, Returned, Status badge)
            │  │  └─ EmptyState ("No loan history")
            │  └─ DeleteBookDialog (Confirm modal, 409 error banner)
            │
            ├─ BookFormPage (/books/new & /books/:bookId/edit)
            │  ├─ PageHeader (Title "Add Book" / "Edit Book", Subtitle)
            │  └─ BookForm (RHF + Zod: title, author, isbn, year, copies, publisher, edition, tags, status, desc)
            │     └─ FormFieldError (Inline error text)
            │
            └─ NotFoundPage (*)
```

---

## 4. Kế hoạch triển khai chi tiết từng Task nhỏ (Actionable Tasks)

Mỗi task được thiết kế để hoàn thành độc lập, kiểm tra ngay bằng lệnh `npm test` hoặc quan sát browser, sau đó commit theo chuẩn Conventional Commits.

---

### GIAI ĐOẠN 1: BỘ LỌC, PHÂN TRANG & HOÀN THIỆN TRẠNG THÁI DANH SÁCH (BOOKS LIST)

#### Task 1.1: Tạo Hook quản lý Bộ lọc & Phân trang (`useBookFilters`)
- **Mục tiêu:** Quản lý state của ô tìm kiếm `q`, `tag`, `status`, `page`, `limit` (đồng bộ hoặc tính toán debounce cho search).
- **Files tạo/sửa:**
  - `src/features/books/hooks/useBookFilters.ts`
  - `src/test/useBookFilters.test.ts`
- **Nghiệp vụ:**
  - Gõ search có debounce 300ms.
  - Khi đổi `q`, `tag`, `status` thì tự động reset `page = 1`.
  - Hàm `clearFilters()` reset toàn bộ về giá trị mặc định.
- **Verification:** Chạy `npm test src/test/useBookFilters.test.ts` pass.
- **Commit:** `feat(books): add useBookFilters hook with debounce and reset logic`

#### Task 1.2: Xây dựng Component `BookFilters`
- **Mục tiêu:** Render thanh tìm kiếm và bộ lọc chuẩn giao diện [`docs/ui-spec.md`](../ui-spec.md) (§3.2).
- **Files tạo/sửa:**
  - `src/features/books/components/BookFilters.tsx`
  - `src/test/BookFilters.test.tsx`
- **Nghiệp vụ:**
  - Form `role="search"`, ô Search có icon kính lúp, select Tag (`All tags`, `Programming`, `JavaScript`,...), select Status (`All`, `Available`, `Out of stock`).
  - Nút `Clear filters` bấm vào kích hoạt hàm reset.
- **Verification:** Unit test kiểm tra tương tác người dùng bằng `getByRole('searchbox')`, `getByRole('combobox')`, `getByRole('button', { name: /clear filters/i })`.
- **Commit:** `feat(books): create BookFilters component with accessible inputs`

#### Task 1.3: Xây dựng Component `Pagination` tương tác
- **Mục tiêu:** Tách và hoàn thiện thanh phân trang độc lập, hỗ trợ chuyển trang trước/sau và bấm số trang.
- **Files tạo/sửa:**
  - `src/features/books/components/Pagination.tsx`
  - `src/test/Pagination.test.tsx`
- **Nghiệp vụ:**
  - Hiển thị dòng text chuẩn `Showing {start}-{end} of {total} books`.
  - Nút `<` có `aria-label="Previous page"` (disable ở trang 1).
  - Nút `>` có `aria-label="Next page"` (disable ở trang cuối).
  - Nút trang hiện tại có `aria-current="page"`.
- **Verification:** Test click chuyển trang gọi callback `onPageChange(page)`.
- **Commit:** `feat(books): implement accessible Pagination component`

#### Task 1.4: Tích hợp Bộ lọc, Phân trang và 3 trạng thái vào `BooksPage`
- **Mục tiêu:** Kết nối `BookFilters` + `BookTable` + `Pagination` + `LoadingState` + `EmptyState` + `ErrorState`.
- **Files tạo/sửa:**
  - `src/shared/components/LoadingState.tsx`
  - `src/shared/components/EmptyState.tsx`
  - `src/shared/components/ErrorState.tsx`
  - `src/features/books/pages/BooksPage.tsx`
  - `src/test/BooksPage.test.tsx`
- **Nghiệp vụ:**
  - Loading: hiển thị skeleton hoặc trạng thái tải.
  - Empty: khi `total === 0` hiển thị thông báo "No books found" kèm nút Clear filters.
  - Error: khi API lỗi (ví dụ 500) hiển thị `ErrorState` kèm nút `Retry` gọi `refetch()`.
  - Khi có dữ liệu: hiển thị bảng + thanh phân trang.
- **Verification:** Integration test kiểm tra cả 4 trạng thái của `BooksPage`.
- **Commit:** `feat(books): wire filters, pagination and UI states into BooksPage`

---

### GIAI ĐOẠN 2: CHI TIẾT SÁCH & LỊCH SỬ MƯỢN TRẢ (BOOK DETAIL & LOAN HISTORY)

#### Task 2.1: Bổ sung API & Hook lấy Chi tiết Sách (`useBook`)
- **Mục tiêu:** Endpoint `GET /api/v1/books/:id` trả về `BookDetail` (thêm `onLoan`, `available`).
- **Files tạo/sửa:**
  - `src/features/books/api/booksApi.ts` (thêm hàm `getBookById`)
  - `src/features/books/hooks/useBook.ts`
  - `src/test/useBook.test.ts`
- **Nghiệp vụ:**
  - Query key chuẩn: `['books', 'detail', bookId]`.
  - Xử lý cache và trạng thái 404 `BOOK_NOT_FOUND`.
- **Verification:** Test gọi đúng endpoint và trả dữ liệu chi tiết sách.
- **Commit:** `feat(books): add getBookById API and useBook query hook`

#### Task 2.2: Bổ sung API & Hook lấy Lịch sử Mượn trả (`useBookLoans`)
- **Mục tiêu:** Endpoint `GET /api/v1/books/:id/loans` trả về `{ data: Loan[] }`.
- **Files tạo/sửa:**
  - `src/features/books/types/book.ts` (kiểm tra type `Loan`)
  - `src/features/books/api/booksApi.ts` (thêm `getBookLoans`)
  - `src/features/books/hooks/useBookLoans.ts`
  - `src/test/useBookLoans.test.ts`
- **Nghiệp vụ:**
  - Query key chuẩn: `['books', 'loans', bookId]`.
- **Verification:** Test trả về danh sách lịch sử mượn.
- **Commit:** `feat(books): add getBookLoans API and useBookLoans hook`

#### Task 2.3: Xây dựng Card Thông tin Sách & Card Tồn kho
- **Mục tiêu:** Xây dựng `BookInformationCard` và `StockCard` theo [`docs/ui-spec.md`](../ui-spec.md) (§4.1).
- **Files tạo/sửa:**
  - `src/features/books/components/BookInformationCard.tsx`
  - `src/features/books/components/StockCard.tsx`
  - `src/test/BookInformationCard.test.tsx`
  - `src/test/StockCard.test.tsx`
- **Nghiệp vụ:**
  - `BookInformationCard`: ISBN, Publisher, Edition, Year, Tags, Description.
  - `StockCard`: Hiển thị 3 số `totalCopies`, `onLoan`, `available` định dạng số `tabular-nums`.
- **Verification:** Assert các trường hiển thị đúng với dữ liệu mock.
- **Commit:** `feat(books): create BookInformationCard and StockCard components`

#### Task 2.4: Xây dựng Bảng Lịch sử Mượn trả (`LoanHistoryTable`)
- **Mục tiêu:** Render bảng lịch sử mượn gồm 5 cột chuẩn (§3.3 Contract: MEMBER, BORROWED, DUE, RETURNED, STATUS).
- **Files tạo/sửa:**
  - `src/features/books/components/LoanHistoryTable.tsx`
  - `src/test/LoanHistoryTable.test.tsx`
- **Nghiệp vụ:**
  - Trường `returnedDate === null` hiển thị dấu gạch ngang `"—”`.
  - Cột STATUS có badge: `Active`, `Overdue` (nền cam `#FFF3E9`), `Returned` (nền xanh `#E6F6EC`).
  - Khi mảng rỗng hiển thị `EmptyState` ("No loan history for this book").
- **Verification:** Unit test kiểm tra rendering cột, badge và trạng thái rỗng.
- **Commit:** `feat(books): implement LoanHistoryTable with status badges`

#### Task 2.5: Hoàn thiện Màn hình `BookDetailPage`
- **Mục tiêu:** Kết nối các thẻ thông tin, bảng mượn trả, nút Back, nút Edit và nút Delete trên màn hình `/books/:bookId`.
- **Files tạo/sửa:**
  - `src/features/books/pages/BookDetailPage.tsx`
  - `src/test/BookDetailPage.test.tsx`
- **Nghiệp vụ:**
  - Breadcrumb hiển thị `Books / <Title>`.
  - Xử lý 404 `BOOK_NOT_FOUND` hiển thị Error State kèm nút quay lại danh sách.
  - Nút `Edit` chuyển hướng `/books/:bookId/edit`. Nút `Delete` kích hoạt mở hộp thoại xác nhận.
- **Verification:** Test luồng hiển thị thành công và trường hợp 404.
- **Commit:** `feat(books): assemble BookDetailPage with loan history and action buttons`

---

### GIAI ĐOẠN 3: FORM THÊM MỚI, CHỈNH SỬA & XÓA SÁCH (MUTATIONS)

#### Task 3.1: Xây dựng Schema Validation & Form `BookForm`
- **Mục tiêu:** Tạo form chuẩn bằng React Hook Form + Zod resolver.
- **Files tạo/sửa:**
  - `src/features/books/types/bookSchema.ts`
  - `src/features/books/components/BookForm.tsx`
  - `src/test/BookForm.test.tsx`
- **Nghiệp vụ:**
  - Validate: `title` (1-255), `author` (1-255), `isbn` (required), `publishedYear` (1000-2100), `totalCopies` (≥ 1).
  - Lỗi hiển thị ngay bên dưới trường tương ứng (`role="alert"`).
- **Verification:** Submit dữ liệu không hợp lệ hiển thị thông báo lỗi, không gọi `onSubmit`. Submit hợp lệ chuyển đúng payload.
- **Commit:** `feat(books): build BookForm with Zod schema validation`

#### Task 3.2: Hook & Màn hình Thêm sách Mới (`useCreateBook` & `BookFormPage`)
- **Mục tiêu:** Endpoint `POST /api/v1/books` tạo sách mới, thành công chuyển hướng về `/books/:id`.
- **Files tạo/sửa:**
  - `src/features/books/hooks/useCreateBook.ts`
  - `src/features/books/pages/BookFormPage.tsx`
  - `src/test/BookCreateFlow.test.tsx`
- **Nghiệp vụ:**
  - Sau khi tạo thành công: Invalidate cache `['books', 'list']`, chuyển hướng tới trang chi tiết sách mới tạo.
  - Bắt lỗi `409 ISBN_ALREADY_EXISTS` và hiển thị lỗi trực tiếp vào trường `isbn`.
  - Bắt lỗi `400 VALIDATION_ERROR` map các lỗi trường vào form.
- **Verification:** Test luồng tạo thành công và luồng gặp lỗi 409/400.
- **Commit:** `feat(books): implement create book mutation with error mapping`

#### Task 3.3: Hook & Màn hình Chỉnh sửa Sách (`useUpdateBook`)
- **Mục tiêu:** Endpoint `PATCH /api/v1/books/:id` cập nhật sách đang có.
- **Files tạo/sửa:**
  - `src/features/books/hooks/useUpdateBook.ts`
  - `src/features/books/pages/BookFormPage.tsx`
  - `src/test/BookEditFlow.test.tsx`
- **Nghiệp vụ:**
  - Prefill dữ liệu sách cũ vào form từ `useBook`.
  - Validate phía client: `totalCopies` không được nhỏ hơn số bản đang mượn (`onLoan`).
  - Sau khi update: Invalidate cache `['books', 'detail', id]` và `['books', 'list']`.
- **Verification:** Test prefill dữ liệu và submit patch thành công.
- **Commit:** `feat(books): implement update book flow with onLoan validation`

#### Task 3.4: Hộp thoại Xóa Sách & Xử lý 409 Active Loans (`DeleteBookDialog`)
- **Mục tiêu:** Endpoint `DELETE /api/v1/books/:id` có modal xác nhận, bắt lỗi khi sách có bản đang mượn.
- **Files tạo/sửa:**
  - `src/shared/components/ConfirmDialog.tsx`
  - `src/features/books/components/DeleteBookDialog.tsx`
  - `src/features/books/hooks/useDeleteBook.ts`
  - `src/test/DeleteBookDialog.test.tsx`
- **Nghiệp vụ:**
  - Bấm Delete mở dialog `role="dialog"`.
  - Nếu `onLoan > 0` hoặc server trả `409 BOOK_HAS_ACTIVE_LOANS`, hiển thị cảnh báo: "Cannot delete book while {activeLoansCount} copies are currently on loan".
  - Nếu xóa thành công (204): Đóng dialog, invalidate list cache, chuyển hướng về `/books`.
- **Verification:** Test case xóa thành công và test case bị chặn bởi lỗi 409.
- **Commit:** `feat(books): add DeleteBookDialog and handle active loans conflict`

---

### GIAI ĐOẠN 4: TỔNG KIỂM TRA, CLEANUP & CHUẨN BỊ MERGE REQUEST

#### Task 4.1: Chạy toàn diện Pipeline Kiểm tra (Green Pipeline)
- **Mục tiêu:** Đảm bảo toàn bộ mã nguồn sạch, không lỗi lint, không lỗi kiểu dữ liệu, toàn bộ test pass.
- **Các bước thực thi:**
  1. `npm run lint` (0 warning, 0 error).
  2. `npm run typecheck` (tsc pass).
  3. `npm test` (tất cả test suites passed).
  4. `npm run build` (Vite build dist thành công).
- **Verification:** Log 4 lệnh đều trả về exit code 0.
- **Commit:** `chore(books): verify full green test pipeline and clean code`

#### Task 4.2: Rà soát Diff, Chụp ảnh màn hình các Trạng thái & Viết MR
- **Mục tiêu:** Chuẩn bị Merge Request theo chuẩn Training Slide 25 & 27:
  - Rà soát `git diff`: Không commit file `.env`, token, bí mật, không còn `console.log`.
  - Chụp ảnh màn hình / GIF đầy đủ 3 trạng thái: Loading, Empty, Error trên màn hình Books.
  - Viết nội dung MR gồm: Mục tiêu (Goal), Link Plan, Các việc đã hoàn thành, Checklist kiểm tra.

---

## 5. Quy tắc Kiểm tra & Definition of Done (DoD)

Mỗi task chỉ được xem là hoàn thành khi đáp ứng đủ các tiêu chí:
1. Đúng quy ước đặt tên (Component `PascalCase`, hook `useXxx`, handler `handleXxx`, query key mảng có thứ tự).
2. Kiểm tra bằng truy vấn Role/A11y (`getByRole`, `getByLabelText`), không dùng class selector.
3. Chạy `npm test` trực tiếp trong terminal và có kết quả màu xanh trước khi commit.
4. Một task tương ứng một commit duy nhất tuân thủ Conventional Commits (`feat(...)`, `test(...)`, `fix(...)`).
5. Không tự ý chỉnh sửa contract backend; mọi mâu thuẫn phải báo cáo qua issue hoặc ghi chú rõ ràng.
