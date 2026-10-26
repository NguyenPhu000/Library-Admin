# 🚀 Merge Request: Hoàn thiện Phân hệ Quản lý Sách (Admin Books Management) & UI States

- **Nhánh nguồn (Source Branch):** `feature/test-debug` / `feat/UI-States`
- **Nhánh đích (Target Branch):** `main`
- **Tác giả:** Nguyễn Hồng Phú
- **Kế hoạch triển khai:** [`docs/plans/books-admin.md`](./plans/books-admin.md)
- **API Contract tham chiếu:** [`docs/api-contract.md`](../api-contract.md)
- **UI Design Spec:** [`docs/ui-spec.md`](../ui-spec.md) (tham chiếu `Main.dc.html`)

---

## 1. Mục tiêu (Goal & Summary)

Xây dựng và hoàn thiện toàn diện phân hệ **Quản lý Sách (Admin Books Management)** trong ứng dụng Library Admin theo tiêu chuẩn đào tạo React chuyên nghiệp:
1. **Admin Layout Shell:** Sidebar cố định, Header chứa Breadcrumb động và User Profile, responsive menu drawer trên mobile.
2. **Danh sách sách (`/books`):** Bảng 7 cột chuẩn, tìm kiếm từ khóa (`q`) debounce 300ms, lọc thẻ (`tag`), lọc trạng thái (`status`), phân trang tương tác `Showing X–Y of Z books`, đủ 4 trạng thái UI (Loading Skeleton, Empty State, Error State kèm nút Retry, Success Table).
3. **Chi tiết sách (`/books/:bookId`):** Thẻ thông tin sách, Thẻ số liệu tồn kho (`totalCopies`, `onLoan`, `available`), Bảng lịch sử mượn trả (`LoanHistoryTable`).
4. **Biểu mẫu Thêm & Sửa sách (`/books/new` & `/books/:bookId/edit`):** React Hook Form + Zod, validate client & server error mapping (400 validation, 409 duplicate ISBN, ràng buộc `totalCopies >= onLoan`).
5. **Xóa sách có xác nhận (`DeleteBookDialog`):** Modal xác nhận xóa chuẩn A11y, chặn xóa an toàn khi sách có bản sao đang cho mượn (409 Conflict - `BOOK_HAS_ACTIVE_LOANS`).
6. **Tối ưu hóa Bundle Size:** Áp dụng Vercel React Best Practices và Rollup vendor chunking, giảm mã nguồn ứng dụng từ 529 kB xuống còn 67 kB (loại bỏ hoàn toàn cảnh báo của Vite).
7. **Kiểm thử tự động:** Vitest + React Testing Library + MSW mock theo sát API Contract với **22 test files (110/110 tests passed)**.

---

## 2. Bằng chứng Kiểm thử & Chất lượng (Test Evidence & Pipeline Quality)

Tất cả các khâu kiểm thử và kiểm tra chất lượng mã nguồn đều đạt trạng thái màu xanh (100% PASS):

```bash
# 1. Unit & Integration Tests (Vitest + RTL + MSW)
npm test
# Test Files: 22 passed (22)
# Tests:      110 passed (110)
# Duration:   ~14s

# 2. Linter (ESLint)
npm run lint
# 0 error, 0 warning

# 3. TypeScript Typecheck (Strict Mode)
npm run typecheck
# tsc -b --noEmit -> Exit code 0 (0 error)

# 4. Production Build (Vite + Rollup Chunks)
npm run build
# dist/assets/vendor-query-*.js       28.64 kB │ gzip:  8.89 kB
# dist/assets/index-*.js              67.63 kB │ gzip: 16.69 kB
# dist/assets/vendor-router-*.js      93.78 kB │ gzip: 30.58 kB
# dist/assets/vendor-form-*.js       128.15 kB │ gzip: 39.07 kB
# dist/assets/vendor-react-*.js      210.53 kB │ gzip: 65.70 kB
# ✓ built in 303ms (Zero warnings)
```

---

## 3. Rà soát Diff & An toàn Bảo mật (Diff & Security Audit)

- [x] **Không có console logs thừa:** Đã quét sạch toàn bộ `console.log`, `debugger`, `console.error` trong thư mục `src/`.
- [x] **Bảo mật biến môi trường:** File `.env`, `.env.local` không bị commit; chỉ lưu trữ file mẫu chuẩn `.env.example`.
- [x] **File thừa & artifacts:** File `.agents/`, `skills-lock.json`, `dist/`, `coverage/`, log files được chặn nghiêm ngặt trong `.gitignore`.
- [x] **Cam kết mã nguồn:** 100% commit tuân thủ quy ước **Conventional Commits** (`feat(...)`, `test(...)`, `perf(...)`, `refactor(...)`, `fix(...)`).

---

## 4. Kịch bản Demo CRUD Chi tiết (Step-by-Step Demo Script)

Người đánh giá có thể làm theo các bước sau để nghiệm thu toàn bộ tính năng:

```bash
# Khởi động ứng dụng dev
npm run dev
# Truy cập: http://localhost:5173
```

### Bước 1: Danh sách Sách, Tìm kiếm & Bộ lọc (`/books`)
1. Mở trang chủ `/books`: Bảng 7 cột hiển thị danh sách 8 cuốn sách mẫu từ MSW.
2. Nhập `"Martin Fowler"` vào ô tìm kiếm: Hệ thống debounce 300ms và chỉ hiển thị cuốn sách *"Refactoring"*.
3. Chọn thẻ tag `"Database"` ở dropdown Tag: Bảng lọc cuốn *"Designing Data-Intensive Applications"*.
4. Chọn trạng thái `"OUT_OF_STOCK"` ở dropdown Status: Bảng hiển thị các cuốn hết hàng kèm badge màu cam.
5. Bấm nút **"Clear filters"**: Toàn bộ ô tìm kiếm và dropdown reset về rỗng, bảng khôi phục đầy đủ 8 cuốn và trang về 1.

### Bước 2: Kiểm tra các Trạng thái UI (Loading, Empty, Error)
1. **Filter Empty State:** Nhập từ khóa không tồn tại (VD: `"abcxyz123"`) -> Hiển thị Empty State *"No books match your filters"* kèm nút *"Clear filters"*.
2. **Catalogue Empty State:** Khi danh mục rỗng -> Hiển thị Empty State *"No books in the catalogue yet"* kèm nút *"Add book"*.
3. **Error State & Retry:** Khi API trả về lỗi 500 -> Hiển thị hộp thông báo lỗi có icon cảnh báo, thông điệp lỗi và `Request ID: req_...` kèm nút *"Try again"* để gọi lại API.

### Bước 3: Xem Chi tiết Sách & Lịch sử Mượn (`/books/:id`)
1. Click vào tên sách *"The Pragmatic Programmer"* (hoặc nút *"View"* ở cột Actions).
2. Kiểm tra Breadcrumb trên Header hiển thị: `Books / The Pragmatic Programmer`.
3. Kiểm tra **Book Information Card**: ISBN `978-0-13-595705-9`, Nhà xuất bản, Năm, Tags, Mô tả.
4. Kiểm tra **Stock Card**: Hiển thị 3 chỉ số đồng bộ:
   - `Total copies`: **5**
   - `On loan`: **3**
   - `Available`: **2** (tự động tính: `5 - 3 = 2`)
   - Dòng cảnh báo: *"1 loan is overdue. Members are reminded 24 hours before the due date."*
5. Kiểm tra **Loan History Table**: Hiển thị 5 dòng phiếu mượn tương ứng với các trạng thái `Active`, `Overdue`, `Returned`. Trường ngày trả `null` hiển thị `"—”`.

### Bước 4: Thêm Mới Sách (`/books/new`)
1. Bấm nút **"Add book"** ở đầu trang.
2. Để trống form và bấm **"Save book"**: Hệ thống chặn submit, hiển thị lỗi inline đỏ dưới từng trường bắt buộc (*Title is required*, *Author is required*, v.v.).
3. Nhập năm `999` hoặc `2200`: Báo lỗi *"Year must be between 1000 and 2100"*.
4. Nhập thông tin hợp lệ, nhập Tags và nhấn `Enter` (thử thêm quá 5 tags để thấy giới hạn).
5. Bấm **"Save book"**: Gửi `POST /api/v1/books` (201 Created), tự động điều hướng sang trang chi tiết cuốn sách vừa tạo.

### Bước 5: Chỉnh Sửa Sách (`/books/:id/edit`)
1. Tại trang chi tiết, bấm nút **"Edit"**: Form hiển thị với toàn bộ dữ liệu hiện tại được prefill sẵn.
2. Thử giảm số lượng bản sao (`Stock`) xuống nhỏ hơn số bản đang mượn (VD sách đang có 3 bản mượn, nhập Stock = 2):
   - Form chặn submit và hiển thị lỗi: *"Total copies cannot be less than active loans (3)"*.
3. Sửa tiêu đề hoặc tăng Stock lên 6 bản và bấm **"Save book"**: Gửi `PATCH /api/v1/books/:id` (200 OK) và cập nhật dữ liệu trên trang chi tiết.

### Bước 6: Xóa Sách & Xử lý Chặn Xóa 409 (`DeleteBookDialog`)
1. **Trường hợp bị chặn:** Mở sách có bản đang mượn (VD ID 2 có 3 bản on loan), bấm **"Delete"**:
   - Modal mở lên hiển thị cảnh báo: *"3 copies are on loan. Return them before deleting."*
   - Nút *"Delete"* trong modal bị mờ và vô hiệu hóa (`disabled={true}`).
2. **Trường hợp xóa thành công:** Mở sách có 0 bản đang mượn (VD ID 6 *"Node.js Design Patterns"*), bấm **"Delete"**:
   - Nút *"Delete"* hoạt động bình thường.
   - Bấm xác nhận xóa -> Gửi `DELETE /api/v1/books/6` (204 No Content), đóng modal và tự động chuyển hướng về danh sách `/books` (sách đã bị xóa khỏi bảng).

---

## 5. Giới hạn Còn lại & Các Hạng mục Ngoài Phạm vi (Known Limitations & Out-of-Scope)

1. **Kết nối Backend Thật qua ngrok:**
   - Hệ thống hiện dùng MSW để mô phỏng hoàn toàn độc lập và ổn định cho việc kiểm thử.
   - Khi Backend team cung cấp URL ngrok chính thức, chỉ cần cấu hình trong file `.env`:
     ```env
     VITE_API_URL=https://<subdomain>.ngrok-free.app/api/v1
     VITE_ENABLE_MSW=false
     ```
2. **Các phân hệ chưa triển khai:**
   - Phân hệ Members, Loans, Dashboard hiện đang hiển thị `PlaceholderPage` theo đúng scope phân công giai đoạn này.
   - Nút `Sign out` đóng vai trò placeholder theo thiết kế mockup mẫu.
