# Library Admin — Tài liệu Đặc tả Giao diện (UI Specification)

- **Nguồn tham chiếu thiết kế (Design Reference):** `D:\WORK\TRAINING\Library Admin UI Template HTML\Main.dc.html`
- **Kích thước Artboard chuẩn:** `1440px × 960px`
- **Tài liệu liên quan:**
  - API Contract: [`docs/api-contract.md`](./api-contract.md)
  - Kế hoạch triển khai: [`docs/plans/books-admin.md`](./plans/books-admin.md)

> **Nguyên tắc cốt lõi (từ `README.md` của bản thiết kế):**
> Bản HTML trong `Library Admin UI Template HTML` là **Reference Mockup** (được xuất từ công cụ thiết kế dưới dạng custom element `<x-dc>`), **không phải code production**. Khi hiện thực hóa sang React, ta tái tạo chính xác các giá trị thiết kế (màu sắc, cỡ chữ, khoảng cách, độ bo góc, bố cục, icon SVG và thuộc tính trợ năng ARIA) thông qua hệ thống   CSS Tokens và React Components chuẩn của dự án, tuyệt đối không copy nguyên xi inline style.

---

## 1. Hệ thống Design Tokens (Design System Variables)

Toàn bộ biến CSS dưới đây được trích xuất nguyên bản từ khối `<style data-dc-design-system-vars>` và các giá trị thực tế sử dụng trên Artboard `Main.dc.html`.

### 1.1. Bảng màu (Color Palette)

#### Màu thương hiệu & Nền tối (Brand & Night Palette)
| Biến CSS | Mã Hex | Mục đích sử dụng trên UI |
| :--- | :--- | :--- |
| `--night-900` | `#150829` | Nền chính của thanh `Sidebar` bên trái |
| `--night-700` | `#3D1766` | Nền mục menu đang active trên `Sidebar`, đường kẻ phân cách footer sidebar (`border-top`), màu chữ link khi `:hover` |
| `--brand-600` | `#5A1E96` | Màu chủ đạo (Primary): nền nút `Add book`, nền nút trang đang chọn (`Pagination`), màu chữ link mặc định, chữ trong `Tag` pill & `Avatar` |
| `--magenta-600` | `#9B3FC2` | Màu nhấn phụ trong bộ nhận diện |
| `--violet-500` | `#7A4FE8` | Màu nhấn phụ (Focus ring / Accent) |
| `--orchid-400` | `#D17FF0` | Màu `stroke` của icon SVG cho mục menu đang active trên `Sidebar` |
| `--cyan-400` | `#4FD1E8` | Màu nhấn phụ (Highlight) |

#### Màu chữ (Typography / Ink)
| Biến CSS | Mã Hex | Mục đích sử dụng trên UI |
| :--- | :--- | :--- |
| `--ink` | `#16121F` | Màu chữ chính trên nền sáng (tiêu đề `h1`, nội dung bảng, input, nút thường) |
| `--ink-muted` | `#5B5570` | Màu chữ phụ (mô tả trang, tiêu đề cột `<thead>`, cột `Author`, cột `Year`, `Breadcrumb` cha, text `Showing 1-8 of 120 books`) |
| `--ink-subtle` | `#8A93A0` | Màu chữ/icon trạng thái vô hiệu hóa (`disabled` trên nút phân trang) |
| `--on-dark` | `#FFFFFF` | Màu chữ chính trên nền tối (`Sidebar` brand `{be}`, mục nav đang active, chữ trên nút Primary) |
| `--on-dark-muted` | `#C9BFE0` | Màu chữ phụ trên nền tối (`Sidebar` subtitle `Library Admin`, các mục nav không active, footer `v0.1 · Training project`) |
| `--on-dark-soft` | `#E3D9F5` | Màu chữ sáng dịu trên nền tối |
| `--on-dark-faint` | `#9884B8` | Màu chữ mờ trên nền tối |
| `--arrow-on-dark` | `#7A5A9E` | Màu icon điều hướng phụ trên nền tối |

#### Màu bề mặt & Đường viền (Surfaces & Borders)
| Biến CSS | Mã Hex | Mục đích sử dụng trên UI |
| :--- | :--- | :--- |
| `--surface` | `#FFFFFF` | Nền `Header`, nền Card bộ lọc (`BookFilters`), nền Card bảng (`BookTable`), nền `input`/`select`/nút phân trang |
| `--surface-row-alt` | `#F5F0FA` | Nền tổng thể của trang (`body`), đồng thời là nền dòng tiêu đề bảng (`<thead>`) |
| `--surface-tint` | `#F1E8FB` | Nền tím nhạt cho `Avatar` (`AU`), `TagBadge` pill, và nút phụ `Clear filters` |
| `--surface-tint-border` | `#E3D2F5` | Viền của nút phụ `Clear filters` (`1px solid #E3D2F5`) |
| `--border` | `#E3E6E4` | Đường viền chuẩn (`1px solid #E3E6E4`) cho `Header`, Card, dòng `<tr>` trong `<tbody>`, ô `input`/`select`, nút `Sign out` và nút phân trang |
| `--border-dashed` | `#C7B8DC` | Đường viền nét đứt (dùng cho trạng thái `EmptyState` / vùng thả) |

#### Màu trạng thái ngữ nghĩa (Semantic / Status Colors)
| Biến CSS / Giá trị | Mã Hex | Mục đích sử dụng trên UI |
| :--- | :--- | :--- |
| `--success` | `#1F9254` | Màu biểu tượng trạng thái thành công / sẵn sàng |
| `--success-surface` | `#E6F6EC` | Nền của badge trạng thái `Available` (và `RETURNED` / `ACTIVE` tùy ngữ cảnh) |
| `--success-ink` *(inline)* | `#176B3E` | Màu chữ của badge trạng thái `Available` trên bảng sách |
| `--warn-surface` | `#FFF3E9` | Nền của badge trạng thái `Out of stock` |
| `--warn-border` | `#F2D3B0` | Viền cảnh báo |
| `--warn-ink` | `#7A3A0F` | Màu chữ của badge trạng thái `Out of stock` |
| `--warn-icon` | `#C4622A` | Màu icon cảnh báo |

---

### 1.2. Kiểu chữ (Typography)

#### Google Fonts Import
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap">
```

#### Font Families
- `--font-display`: `"Baloo 2", Arial, sans-serif` — dùng cho logo `{be}` và tiêu đề trang `<h1>`.
- `--font-sans`: `Inter, Arial, sans-serif` — dùng cho toàn bộ nội dung giao diện, bảng biểu, biểu mẫu, nút bấm.
- `--font-mono`: `ui-monospace, Menlo, Consolas, monospace` — dùng cho mã ISBN, `requestId` hoặc dữ liệu kỹ thuật.

#### Thang cỡ chữ thực tế trên UI Admin (`Main.dc.html`)
| Thành phần UI | Font Family | Font Weight | Font Size | Line Height | Ghi chú thêm |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Base (`body` / App wrapper)** | `Inter` | `400` | `14px` | Mặc định | Màu chữ `#16121F` |
| **Page Title (`<h1>`)** | `"Baloo 2"` | `800` | `32px` | `1.1` | `margin: 0` |
| **Sidebar Logo (`{be}`)** | `"Baloo 2"` | `800` | `30px` | `1.0` | Màu `#FFFFFF` |
| **Form Field Label** | `Inter` | `600` | `13px` | Mặc định | `Search`, `Tag`, `Status` |
| **User Avatar (`AU`)** | `Inter` | `700` | `13px` | `1.0` | Căn giữa trong vòng tròn `36×36px` |
| **Table Header (`<th>`)** | `Inter` | `600` | `12px` | Mặc định | `text-transform: uppercase; letter-spacing: 0.5px; color: #5B5570` |
| **Badges (`Tag`, `Status`)** | `Inter` | `600` | `12px` | Mặc định | `padding: 2px 10px; border-radius: 999px` |
| **Sidebar Subtitle & Footer** | `Inter` | `400` | `12px` | Mặc định | Màu `#C9BFE0` |

---

### 1.3. Khoảng cách, Kích thước & Độ bo góc (Spacing, Sizing & Radii)

| Nhóm | Token / Thuộc tính | Giá trị | Áp dụng tại |
| :--- | :--- | :--- | :--- |
| **Border Radius** | `--radius-control` | `10px` | Nút bấm (`Add book`, `Clear filters`, `Sign out`, `Pagination`), ô `input`, `select`, mục menu `Sidebar` |
| | `--radius-strip` | `14px` | Các dải thông báo / banner nhỏ |
| | `--radius-card` | `16px` | Card bộ lọc (`BookFilters`), Card bảng dữ liệu (`BookTable`) |
| | `--radius-panel` | `20px` | Panel lớn / hộp thoại (`ConfirmDialog`) |
| | `--radius-pill` | `999px` | `TagBadge`, `StockBadge`, `Avatar` tròn |
| **Spacing** | `--gap-section` | `40px` | Khoảng cách giữa các phân vùng lớn |
| | `--gap-block` | `32px` | Padding của `<main>` (`32px`), khoảng cách dọc giữa các khối trong `Sidebar` (`32px`) |
| | `--gap-grid` | `24px` | Khoảng cách dọc giữa các khối trong `<main>` (`gap: 24px`) |
| | `--gap-tight` | `12px` | Khoảng cách giữa icon và nhãn trong `Sidebar`, khoảng cách phần tử trong `Header` |
| **Sizing** | Chiều cao Control chuẩn | `44px` (`min-height`) | Mục menu `Sidebar`, nút `Add book`, ô `Search`, `Select`, nút `Clear filters` |
| | Chiều cao Control компакт | `40px` (`min-height`) | Nút `Sign out`, các nút `Pagination` (`min-width: 40px; min-height: 40px`) |
| | Chiều rộng nội dung tối đa | `1200px` (`max-width`) | Thẻ `<main>` (`width: 100%; max-width: 1200px; padding: 32px`) |
| | Chiều rộng tối thiểu bảng | `820px` (`min-width`) | `<table>` nằm trong khung `overflow-x: auto` |

---

## 2. Cấu trúc Bố cục Chung (Admin Shell Layout)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Sidebar (240px, #150829)  │ Header (#FFFFFF, border-bottom #E3E6E4)          │
│                           │   Breadcrumb ("Books")     [AU] Admin User [Out] │
│  {be}                     ├──────────────────────────────────────────────────┤
│  Library Admin            │ Main (max-width: 1200px, padding: 32px, #F5F0FA) │
│                           │                                                  │
│  [▪] Dashboard            │   PageHeader: h1 + description      [+ Add book] │
│  [▪] Books (active)       │                                                  │
│  [▪] Members              │   BookFilters Card (#FFFFFF, radius 16px)        │
│  [▪] Loans                │                                                  │
│                           │   BookTable Card (#FFFFFF, radius 16px)          │
│  ───────────────────────  │     ├─ Table (min-width: 820px)                  │
│  v0.1 · Training project  │     └─ Pagination Bar                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Khung bao ngoài (App Shell Container)
- `display: flex; flex-wrap: wrap; align-items: stretch; min-height: 960px` (hoặc `100vh` trên ứng dụng thực tế).
- `background: #F5F0FA; color: #16121F; font-family: Inter, Arial, sans-serif; font-size: 14px`.

### 2.2. Thanh điều hướng trái (`Sidebar` — `<nav aria-label="Main menu">`)
- **Kích thước & Bố cục:** `flex: 1 0 240px; max-width: 100%; box-sizing: border-box; background: #150829; color: #FFFFFF; padding: 24px 16px; display: flex; flex-direction: column; gap: 32px`.
- **Khối Thương hiệu (Brand Header):**
  - Container: `display: flex; flex-direction: column; gap: 4px; padding: 0 12px`.
  - Logo chữ: `{be}` (`font-family: 'Baloo 2', Arial, sans-serif; font-weight: 800; font-size: 30px; line-height: 1`).
  - Phụ đề: `Library Admin` (`font-size: 12px; color: #C9BFE0`).
- **Danh sách Menu (`display: flex; flex-direction: column; gap: 4px`):**
  - Mỗi mục là thẻ `<a>` / `<NavLink>`: `display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 10px 12px; border-radius: 10px; text-decoration: none`.
  - **Trạng thái mặc định (Inactive):** `color: #C9BFE0; font-weight: 500`, icon SVG có `stroke: currentColor`.
  - **Trạng thái đang chọn (Active — `aria-current="page"`):** `background: #3D1766; color: #FFFFFF; font-weight: 600`, icon SVG đổi `stroke: #D17FF0` (`--orchid-400`).
  - **4 mục điều hướng và Icon SVG (`20×20`, `viewBox="0 0 24 24"`, `stroke-width="2"`):**
    1. **Dashboard:**
       ```html
       <rect x="3" y="3" width="7" height="7" rx="1"></rect>
       <rect x="14" y="3" width="7" height="7" rx="1"></rect>
       <rect x="3" y="14" width="7" height="7" rx="1"></rect>
       <rect x="14" y="14" width="7" height="7" rx="1"></rect>
       ```
    2. **Books:**
       ```html
       <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
       <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
       ```
    3. **Members:**
       ```html
       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
       <circle cx="9" cy="7" r="4"></circle>
       <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
       <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
       ```
    4. **Loans:**
       ```html
       <path d="M17 1l4 4-4 4"></path>
       <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
       <path d="M7 23l-4-4 4-4"></path>
       <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
       ```
- **Chân trang Sidebar (Footer):**
  - `margin-top: auto; padding: 12px; border-top: 1px solid #3D1766; font-size: 12px; color: #C9BFE0`.
  - Nội dung: `v0.1 · Training project`.

### 2.3. Khu vực Nội dung phải & Thanh đầu trang (`Header`)
- **Khung cột phải:** `flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column`.
- **Thanh `<header>`:**
  - `display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding: 16px 32px; background: #FFFFFF; border-bottom: 1px solid #E3E6E4`.
  - **Bên trái — `Breadcrumb` (`<nav aria-label="Breadcrumb">`):**
    - `display: flex; gap: 8px; color: #5B5570`.
    - Trang hiện tại: `<span style="color: #16121F; font-weight: 600;">Books</span>`.
  - **Bên phải — Cụm thông tin người dùng (`display: flex; align-items: center; gap: 12px`):**
    - **Avatar:** `<span aria-hidden="true">AU</span>` (`width: 36px; height: 36px; border-radius: 999px; background: #F1E8FB; color: #5A1E96; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px`).
    - **Tên người dùng:** `Admin User` (`font-weight: 500`).
    - **Nút đăng xuất (`Sign out`):** `<button type="button">` (`min-height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid #E3E6E4; background: #FFFFFF; color: #16121F; font-weight: 500; cursor: pointer`).

---

## 3. Đặc tả Màn hình Danh sách Sách (`BooksPage` — `Main.dc.html`)

Thẻ `<main>` bọc toàn bộ nội dung trang:
- `padding: 32px; box-sizing: border-box; width: 100%; max-width: 1200px; display: flex; flex-direction: column; gap: 24px`.

### 3.1. Đầu trang (`PageHeader`)
- **Bố cục:** `display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 16px`.
- **Khối tiêu đề bên trái (`display: flex; flex-direction: column; gap: 4px`):**
  - `<h1>`: `Books` (`font-family: 'Baloo 2', Arial, sans-serif; font-weight: 800; font-size: 32px; line-height: 1.1; margin: 0`).
  - `<p>`: `Manage the library catalogue: search, filter and open a book to see its loans.` (`margin: 0; color: #5B5570`).
- **Nút hành động chính bên phải (`Add book`):**
  - Điều hướng tới `/books/new`.
  - Style: `display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 18px; border-radius: 10px; background: #5A1E96; color: #FFFFFF; text-decoration: none; font-weight: 600`.
  - Icon dấu cộng (`18×18`, `stroke-width="2.25"`): `<path d="M12 5v14M5 12h14"></path>`.

### 3.2. Thanh Tìm kiếm & Bộ lọc (`BookFilters`)
- **Phần tử gốc:** `<form role="search">`.
- **Style Card:** `display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; padding: 20px; background: #FFFFFF; border: 1px solid #E3E6E4; border-radius: 16px`.
- **Các trường điều khiển:**
  1. **Ô tìm kiếm (`Search`):**
     - `<label>` bọc ngoài: `display: flex; flex-direction: column; gap: 6px; flex: 2 1 280px; font-weight: 600; font-size: 13px`.
     - Khung bao input: `display: flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 12px; border: 1px solid #E3E6E4; border-radius: 10px; color: #5B5570`.
     - Icon kính lúp (`18×18`, `stroke-width="2"`): `<circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path>`.
     - `<input type="search" placeholder="Search by title or author">`: `flex: 1; min-width: 0; border: 0; outline: none; font: inherit; font-weight: 400; color: #16121F; background: transparent`.
     - Mapping API: query param `q` (tìm kiếm không phân biệt hoa thường trên `title` hoặc `author`).
  2. **Bộ lọc nhãn (`Tag`):**
     - `<label>`: `display: flex; flex-direction: column; gap: 6px; flex: 1 1 160px; font-weight: 600; font-size: 13px`.
     - `<select>`: `min-height: 44px; padding: 0 12px; border: 1px solid #E3E6E4; border-radius: 10px; font: inherit; font-weight: 400; background: #FFFFFF; color: #16121F`.
     - Các tùy chọn trong mockup: `All tags` (mặc định), `Programming`, `JavaScript`, `Database` (cùng các tag trong seed data: `Career`, `Node.js`, `Architecture`).
     - Mapping API: query param `tag`.
  3. **Bộ lọc trạng thái (`Status`):**
     - `<label>`: `display: flex; flex-direction: column; gap: 6px; flex: 1 1 160px; font-weight: 600; font-size: 13px`.
     - `<select>`: cùng style với `Tag`.
     - Các tùy chọn: `All` (mặc định), `Available` (`AVAILABLE`), `Out of stock` (`OUT_OF_STOCK`), và mở rộng `Archived` (`ARCHIVED`) theo API Contract.
     - Mapping API: query param `status`.
  4. **Nút xóa bộ lọc (`Clear filters`):**
     - `<button type="button">Clear filters</button>`.
     - Style: `min-height: 44px; padding: 0 16px; border-radius: 10px; border: 1px solid #E3D2F5; background: #F1E8FB; color: #5A1E96; font: inherit; font-weight: 600; cursor: pointer`.
     - Hành vi: Đặt lại `q = ""`, `tag = ""`, `status = ""` và quay về `page = 1`.

### 3.3. Bảng Dữ liệu Sách (`BookTable`)
- **Card bọc bảng + phân trang:** `background: #FFFFFF; border: 1px solid #E3E6E4; border-radius: 16px; overflow: hidden`.
- **Khung cuộn ngang:** `<div style="overflow-x: auto;">`.
- **Bảng (`<table>`):** `width: 100%; min-width: 820px; border-collapse: collapse`.
- **Dòng tiêu đề (`<thead><tr>`):**
  - `background: #F5F0FA; color: #5B5570; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px`.
  - Mỗi ô `<th scope="col">` có `padding: 12px 16px; font-weight: 600`.
- **Dòng dữ liệu (`<tbody><tr>`):**
  - `border-top: 1px solid #E3E6E4`.
  - Mỗi ô `<td>` có `padding: 12px 16px`.
  - `key` của mỗi dòng bắt buộc dùng `book.id` (không dùng chỉ số mảng `index`).

#### Chi tiết 7 cột của `BookTable`:
| STT | Tiêu đề cột (`<th>`) | Căn lề | Trường dữ liệu (Contract) | Quy cách hiển thị chi tiết |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Title** | Trái (`left`) | `book.title` | Thẻ `<Link to="/books/:id">`: `font-weight: 600; color: #5A1E96; text-decoration: none` (hover: `#3D1766`) |
| 2 | **Author** | Trái (`left`) | `book.author` | Văn bản màu `#5B5570` |
| 3 | **Year** | Trái (`left`) | `book.publishedYear` | Văn bản màu `#5B5570` |
| 4 | **Tags** | Trái (`left`) | `book.tags` (`string[]`) | Container `display: flex; flex-wrap: wrap; gap: 6px`. Mỗi tag là một pill (`TagBadge`): `padding: 2px 10px; border-radius: 999px; background: #F1E8FB; color: #5A1E96; font-size: 12px; font-weight: 600` |
| 5 | **Stock** | Phải (`right`) | `book.totalCopies` | `text-align: right; font-variant-numeric: tabular-nums` |
| 6 | **Status** | Trái (`left`) | `book.status` | Hiển thị `StockBadge` (`padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600`):<br>• `AVAILABLE` → Nhãn **`Available`**, nền `#E6F6EC`, chữ `#176B3E`<br>• `OUT_OF_STOCK` → Nhãn **`Out of stock`**, nền `#FFF3E9`, chữ `#7A3A0F`<br>• `ARCHIVED` *(theo Contract)* → Nhãn **`Archived`**, nền `#F5F0FA`, chữ `#5B5570`, viền `1px solid #E3E6E4` |
| 7 | **Actions** | Phải (`right`) | `book.id` | `text-align: right; white-space: nowrap`. Gồm 2 liên kết (`font-weight: 600; color: #5A1E96`):<br>• **`View`** (`margin-right: 16px`) → `/books/:bookId`<br>• **`Edit`** → `/books/:bookId/edit` |

### 3.4. Thanh Phân trang (`Pagination`)
- **Bố cục khung:** Nằm bên dưới bảng trong cùng Card trắng, `display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 12px 16px; border-top: 1px solid #E3E6E4; color: #5B5570`.
- **Bên trái (Summary Text):** `<span>Showing {start}-{end} of {total} books</span>` (ví dụ trên mockup: `Showing 1-8 of 120 books`).
- **Bên phải (`<nav aria-label="Pagination">`):**
  - `display: flex; gap: 6px; align-items: center`.
  - **Kích thước chung mỗi nút `<button type="button">`:** `min-width: 40px; min-height: 40px; border-radius: 10px; font: inherit`.
  - **Nút Trang trước (`<`):** `aria-label="Previous page"`. Khi ở trang 1 có thuộc tính `disabled`, chữ màu `#8A93A0`, nền `#FFFFFF`, viền `1px solid #E3E6E4`.
  - **Nút Trang đang chọn:** `aria-current="page"`, `border: 1px solid #5A1E96; background: #5A1E96; color: #FFFFFF; font-weight: 600`.
  - **Nút Trang thường & Nút Trang sau (`>`):** `aria-label="Next page"` (cho nút `>`), `border: 1px solid #E3E6E4; background: #FFFFFF; color: #16121F`.
  - **Dấu rút gọn trang:** `<span aria-hidden="true">.</span>` (hoặc `…`).

### 3.5. Bộ dữ liệu mẫu (Seed Data trong `Main.dc.html`)
Artboard định nghĩa 8 cuốn sách mẫu trong `DCLogic.renderVals()` — dùng làm dữ liệu chuẩn cho MSW Mock (`src/test/mocks/data.ts`):

| # | Title | Author | Year (`publishedYear`) | Tags | Stock (`totalCopies`) | Status |
| :---: | :--- | :--- | :---: | :--- | :---: | :--- |
| 1 | Clean Code | Robert C. Martin | 2008 | `["Programming"]` | 4 | `AVAILABLE` |
| 2 | The Pragmatic Programmer | David Thomas, Andrew Hunt | 2019 | `["Programming", "Career"]` | 2 | `AVAILABLE` |
| 3 | Designing Data-Intensive Applications | Martin Kleppmann | 2017 | `["Database"]` | 0 | `OUT_OF_STOCK` |
| 4 | Refactoring | Martin Fowler | 2018 | `["Programming"]` | 3 | `AVAILABLE` |
| 5 | You Don't Know JS Yet | Kyle Simpson | 2020 | `["JavaScript"]` | 5 | `AVAILABLE` |
| 6 | Node.js Design Patterns | Mario Casciaro, Luciano Mammino | 2020 | `["Node.js", "JavaScript"]` | 1 | `AVAILABLE` |
| 7 | Eloquent JavaScript | Marijn Haverbeke | 2018 | `["JavaScript"]` | 0 | `OUT_OF_STOCK` |
| 8 | Domain-Driven Design | Eric Evans | 2003 | `["Architecture"]` | 2 | `AVAILABLE` |

---

## 4. Quy chuẩn Thiết kế cho các Màn hình Liên kết & Trạng thái UI

Trong `Main.dc.html`, các liên kết hành động trỏ tới `BookDetail.dc.html` và `BookForm.dc.html`. Các màn hình này sử dụng chung `AdminLayout`, bảng màu, kiểu chữ và cấu trúc Card/Table của `Main.dc.html`, kết hợp cùng đặc tả dữ liệu trong [`docs/api-contract.md`](./api-contract.md):

### 4.1. Màn hình Chi tiết Sách (`BookDetailPage` — `/books/:bookId`)
- **Breadcrumb:** `Books` (link về `/books`) `/` `<Tên sách>` (chữ `#16121F`, `font-weight: 600`).
- **PageHeader:**
  - Trái: Tiêu đề `<h1>` hiển thị tên sách + phụ đề tác giả / năm xuất bản.
  - Phải: Nút `Edit` (điều hướng tới `/books/:bookId/edit`, style secondary/tint) và nút `Delete` (mở hộp thoại xác nhận xóa `DeleteBookDialog`).
- **Thẻ Thông tin Sách (`BookInformationCard`):**
  - Card trắng (`background: #FFFFFF; border: 1px solid #E3E6E4; border-radius: 16px; padding: 24px`).
  - Hiển thị đầy đủ các trường trong `BookDetail`: `isbn` (font mono), `publisher` (hiển thị `"—"` nếu `null`), `edition` (`"—"` nếu `null`), `publishedYear`, `addedOn`, `status` (`StockBadge`), `tags` (`TagBadge`), và `description`.
- **Thẻ Tồn kho (`StockCard`):**
  - Card trắng hiển thị 3 chỉ số tồn kho (`font-variant-numeric: tabular-nums`):
    1. **Total copies** (`totalCopies`)
    2. **On loan** (`onLoan`)
    3. **Available** (`available` = `totalCopies - onLoan`)
- **Bảng Lịch sử Mượn trả (`LoanHistoryTable` — `GET /api/v1/books/:id/loans`):**
  - Card trắng bo góc `16px`, `<thead>` nền `#F5F0FA`, chữ in hoa `12px`.
  - Gồm 5 cột theo đúng API Contract (§3.3):
    1. **MEMBER** (`memberName`)
    2. **BORROWED** (`borrowedDate` — `YYYY-MM-DD`)
    3. **DUE** (`dueDate` — `YYYY-MM-DD`)
    4. **RETURNED** (`returnedDate` — hiển thị `"—"` nếu `null`)
    5. **STATUS** (`status`):
       - `ACTIVE` → Badge **`Active`**
       - `OVERDUE` → Badge **`Overdue`** (nền `#FFF3E9`, chữ `#7A3A0F`)
       - `RETURNED` → Badge **`Returned`** (nền `#E6F6EC`, chữ `#176B3E`)

### 4.2. Màn hình Tạo / Chỉnh sửa Sách (`BookFormPage` — `/books/new` & `/books/:bookId/edit`)
- **Breadcrumb:** `Books / Add book` hoặc `Books / <Tên sách> / Edit`.
- **Card Biểu mẫu (`BookForm`):**
  - Card trắng (`background: #FFFFFF; border: 1px solid #E3E6E4; border-radius: 16px; padding: 24px`).
  - Sử dụng **React Hook Form + Zod**, nhãn `<label>` (`13px`, `font-weight: 600`), ô nhập liệu (`min-height: 44px`, `border-radius: 10px`, `border: 1px solid #E3E6E4`).
  - **Các trường dữ liệu theo Contract (§4.4 & §4.5):**
    - `title` *(bắt buộc, 1–255 ký tự)*
    - `author` *(bắt buộc, 1–255 ký tự)*
    - `isbn` *(bắt buộc, duy nhất)*
    - `publishedYear` *(bắt buộc, số nguyên 1000–2100)*
    - `totalCopies` *(bắt buộc, số nguyên ≥ 1; khi chỉnh sửa phải `>= onLoan`)*
    - `publisher` *(tùy chọn, tối đa 255 ký tự)*
    - `edition` *(tùy chọn, tối đa 255 ký tự)*
    - `status` *(tùy chọn, select `AVAILABLE` | `OUT_OF_STOCK` | `ARCHIVED`)*
    - `tags` *(tùy chọn, danh sách tag)*
    - `description` *(tùy chọn, `<textarea>`)*
  - **Hiển thị lỗi cạnh trường (Field-level Validation Errors):**
    - Mọi lỗi từ Zod hoặc lỗi `400 VALIDATION_ERROR` (`error.details[field]`) và `409 ISBN_ALREADY_EXISTS` (trên trường `isbn`) phải hiển thị ngay bên dưới trường tương ứng với `role="alert"` hoặc `aria-describedby`.

### 4.3. Hộp thoại Xác nhận Xóa (`ConfirmDialog` / `DeleteBookDialog`)
- Phần tử có `role="dialog"`, `aria-modal="true"`, `aria-labelledby` trỏ tới tiêu đề hộp thoại.
- Bo góc `--radius-panel` (`20px`), nền `#FFFFFF`, có nút `Cancel` và nút `Delete` (xác nhận).
- Nếu API trả về `409 Conflict` (`BOOK_HAS_ACTIVE_LOANS`), hiển thị thông báo lỗi rõ ràng kèm số lượng bản sách đang cho mượn (`details.activeLoansCount`).

### 4.4. Ba Trạng thái Giao diện Bắt buộc trên Mọi Màn hình (`Loading`, `Empty`, `Error`)
1. **Loading State (`LoadingState`):**
   - Hiển thị khung chờ (skeleton hoặc chỉ báo tải có `role="status"` / `aria-busy="true"`) bên trong vùng nội dung mà không làm giật bố cục `Sidebar` và `Header`.
2. **Empty State (`EmptyState`):**
   - Khung viền nét đứt (`border: 1px dashed #C7B8DC`, `border-radius: 16px`, `padding: 44px`, căn giữa).
   - Trên `BooksPage`: Hiển thị khi danh sách rỗng kèm nút `Clear filters` nếu người dùng đang bật bộ lọc.
   - Trên `LoanHistoryTable`: Hiển thị khi sách chưa có lịch sử mượn trả.
3. **Error State (`ErrorState`):**
   - Khung thông báo lỗi (`role="alert"`), hiển thị thông điệp lỗi từ server (`error.message`), mã `requestId` (nếu có, hiển thị bằng `--font-mono`), và bắt buộc có nút **`Retry`** để gọi lại truy vấn TanStack Query.

---

## 5. Quy chuẩn Trợ năng (Accessibility) & Truy vấn Kiểm thử (RTL)

Mọi component khi hiện thực phải giữ đúng các ngữ nghĩa HTML và thuộc tính ARIA từ `Main.dc.html` để đảm bảo kiểm thử bằng React Testing Library (`getByRole`, `getByLabelText`) hoạt động nhất quán:

| Thành phần | Thẻ HTML & Thuộc tính ARIA bắt buộc | Truy vấn RTL chuẩn trong Unit Test |
| :--- | :--- | :--- |
| **Sidebar** | `<nav aria-label="Main menu">` | `screen.getByRole('navigation', { name: 'Main menu' })` |
| **Mục Sidebar đang chọn** | `<a aria-current="page">Books</a>` | `screen.getByRole('link', { name: 'Books' })` (`toHaveAttribute('aria-current', 'page')`) |
| **Breadcrumb** | `<nav aria-label="Breadcrumb">` | `screen.getByRole('navigation', { name: 'Breadcrumb' })` |
| **Tiêu đề trang** | `<h1>Books</h1>` | `screen.getByRole('heading', { level: 1, name: 'Books' })` |
| **Nút Thêm sách** | `<a href="/books/new">Add book</a>` | `screen.getByRole('link', { name: /add book/i })` |
| **Form Bộ lọc** | `<form role="search">` | `screen.getByRole('search')` |
| **Ô Tìm kiếm** | `<label>Search <input type="search" /></label>` | `screen.getByRole('searchbox', { name: /search/i })` |
| **Select Tag / Status** | `<label>Tag <select>...</select></label>` | `screen.getByRole('combobox', { name: /tag/i })` / `{ name: /status/i }` |
| **Nút Xóa bộ lọc** | `<button type="button">Clear filters</button>` | `screen.getByRole('button', { name: /clear filters/i })` |
| **Bảng sách** | `<table>`, `<th scope="col">` | `screen.getByRole('table')`, `screen.getByRole('columnheader', { name: 'Title' })` |
| **Khung Phân trang** | `<nav aria-label="Pagination">` | `screen.getByRole('navigation', { name: 'Pagination' })` |
| **Nút chuyển trang** | `aria-label="Previous page"`, `aria-label="Next page"`, `aria-current="page"` | `screen.getByRole('button', { name: 'Previous page' })`, `screen.getByRole('button', { name: 'Next page' })` |
| **Hộp thoại xác nhận xóa** | `<div role="dialog" aria-modal="true">` | `screen.getByRole('dialog')` |
