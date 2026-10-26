# Library Admin — Giao Diện Quản Lý Thư Viện

Dự án Frontend xây dựng giao diện phân hệ **Quản lý Sách (Admin Books Management)** cho hệ thống Library Admin, tuân thủ chặt chẽ đặc tả thiết kế ([`docs/ui-spec.md`](./docs/ui-spec.md)), hợp đồng dữ liệu REST API ([`docs/api-contract.md`](./docs/api-contract.md)) và kế hoạch triển khai chuẩn mực ([`docs/plans/books-admin.md`](./docs/plans/books-admin.md)).

---

## 🛠️ Tech Stack & Thư Viện Sử Dụng

- **Core & Runtime:** React 19, TypeScript (Strict mode), Vite 8.
- **Styling & Tokens:** Tailwind CSS v4, Google Fonts (`Baloo 2`, `Inter`).
- **Routing:** React Router v8 (`createBrowserRouter`, `NavLink`, dynamic breadcrumbs).
- **Server State Management:** TanStack Query v5 (`useQuery`, `useMutation`, `queryClient`).
- **Form & Validation:** React Hook Form + Zod resolver (`bookSchema`).
- **Network & Mocking:** Native `fetch` với timeout guardrail 8s (`apiClient.ts`), Mock Service Worker v3 (`msw`).
- **Testing Suite:** Vitest, React Testing Library, `@testing-library/user-event`, `@testing-library/jest-dom`.

---

## 🚀 Hướng Dẫn Khởi Chạy (Quick Start)

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình Môi trường
Sao chép file cấu hình mẫu `.env.example` thành `.env`:
```bash
cp .env.example .env
```
Nội dung file `.env`:
```env
# URL của REST API backend (Fastify hoặc ngrok)
VITE_API_URL=http://localhost:3000/api/v1

# Bật/tắt Mock Service Worker trong môi trường dev
# true: Sử dụng mock data trong browser (chạy độc lập không cần backend)
# false: Kết nối tới API backend thật qua localhost hoặc ngrok
VITE_ENABLE_MSW=true
```

### 3. Khởi chạy Ứng dụng Dev
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: **`http://localhost:5173`**

---

## 🧪 Các Lệnh Kiểm Tra Chất Lượng (Quality Scripts)

Toàn bộ pipeline kiểm tra chất lượng đạt 100% trạng thái màu xanh:

```bash
# Chạy toàn bộ 110 Unit & Integration Tests
npm test

# Chạy test ở chế độ theo dõi file (watch mode)
npm run test:watch

# Kiểm tra cú pháp và quy chuẩn code (ESLint - 0 error, 0 warning)
npm run lint

# Kiểm tra toàn diện kiểu dữ liệu TypeScript (Strict mode - 0 error)
npm run typecheck

# Đóng gói bản Production (Vite build dist - hoàn thành ~300ms)
npm run build

# Xem thử bản build Production
npm run preview
```

---

## 🔌 Hướng Dẫn Tích Hợp Backend Thật (Localhost / ngrok)

Khi Backend team cung cấp đường hầm ngrok hoặc backend chạy cục bộ, thực hiện tích hợp theo các bước sau:

1. Mở file `.env` và cập nhật:
   ```env
   VITE_API_URL=https://<your-subdomain>.ngrok-free.app/api/v1
   VITE_ENABLE_MSW=false
   ```
2. Khởi động lại dev server: `npm run dev`.
3. **Cơ chế chống treo mạng:** Lớp mạng `apiClient.ts` được trang bị sẵn:
   - Timeout bảo vệ `8000ms`: Tự động hủy request và báo lỗi nếu mạng ngrok quá tải, không làm đơ giao diện.
   - Header `'ngrok-skip-browser-warning': 'true'`: Tự động vượt qua màn hình cảnh báo của ngrok free tier.

---

## 📡 API Request Collection (cURL & Postman)

- 📥 **Postman Collection v2.1.0:** File sẵn sàng import trực tiếp vào Postman / Bruno / Insomnia: [`library-admin-books.postman_collection.json`](./library-admin-books.postman_collection.json).
- 💻 **cURL Reference:** Dưới đây là bộ lệnh cURL chuẩn khớp 100% với [API Contract](./docs/api-contract.md) để hỗ trợ Backend Developer hoặc QA kiểm thử trực tiếp:

### 1. Lấy danh sách sách (Hỗ trợ Search, Filter, Pagination)
```bash
curl -X GET "http://localhost:3000/api/v1/books?q=clean&tag=Programming&status=AVAILABLE&page=1&limit=10" \
  -H "Accept: application/json"
```

### 2. Xem chi tiết sách theo ID
```bash
curl -X GET "http://localhost:3000/api/v1/books/2" \
  -H "Accept: application/json"
```

### 3. Lấy lịch sử mượn trả của sách
```bash
curl -X GET "http://localhost:3000/api/v1/books/2/loans" \
  -H "Accept: application/json"
```

### 4. Thêm mới sách
```bash
curl -X POST "http://localhost:3000/api/v1/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Refactoring UI",
    "author": "Adam Wathan, Steve Schoger",
    "isbn": "978-0-99-999999-1",
    "publishedYear": 2018,
    "totalCopies": 4,
    "tags": ["Design", "CSS"],
    "status": "AVAILABLE",
    "description": "Design with developer mindset."
  }'
```

### 5. Cập nhật thông tin sách (PATCH)
> *Lưu ý: `totalCopies` không được nhỏ hơn số bản đang mượn (`onLoan`).*
```bash
curl -X PATCH "http://localhost:3000/api/v1/books/2" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Pragmatic Programmer (20th Anniversary Edition)",
    "totalCopies": 6
  }'
```

### 6. Xóa sách (DELETE)
> *Lưu ý: Chỉ xóa thành công khi sách có `onLoan = 0` (204 No Content). Nếu sách có bản đang mượn sẽ trả về 409 Conflict (`BOOK_HAS_ACTIVE_LOANS`).*
```bash
curl -X DELETE "http://localhost:3000/api/v1/books/6" \
  -H "Accept: application/json"
```

---

## 📊 Báo Cáo Kết Quả Nghiệm Thu (Handover Report)

- **Độ bao phủ chức năng:**
  -  Bảng sách 7 cột chuẩn A11y, phân trang tương tác.
  -  Tìm kiếm tức thì debounce 300ms, lọc dropdown Tag & Status.
  -  Đầy đủ 4 trạng thái UI: Loading Skeleton, Empty State (Catalogue / Filter), Error State kèm Request ID & nút Retry, Success Table.
  -  Chi tiết sách: Thẻ thông tin, Thẻ tồn kho tính toán tự động (`available = totalCopies - onLoan`), Bảng lịch sử mượn 5 cột.
  -  Thêm mới & Sửa sách: Form Zod validation, mapping lỗi 400 validation & 409 conflict.
  -  Xóa sách có dialog xác nhận, chặn xóa an toàn khi sách còn bản mượn.
- **Tối ưu hóa Bundle Size:**
  - Áp dụng kỹ thuật Rollup Vendor Chunking theo chuẩn Vercel React Best Practices.
  - Mã nguồn ứng dụng chỉ nặng **67.63 kB** (gzip 16.69 kB), hoàn toàn không còn cảnh báo chunk lớn của Vite.
- **Độ tin cậy kiểm thử:**
  - **22/22 test files passed (110/110 unit & integration tests passed)**.
  - `onUnhandledRequest` được mock chặt chẽ 100% bằng MSW.
