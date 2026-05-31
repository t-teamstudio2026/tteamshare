# T-TEAM Share - Nền Tảng Chia Sẻ Phần Mềm Cao Cấp

Nền tảng chia sẻ và tải xuống tài nguyên/phần mềm hiện đại được phát triển bởi **T-TEAM**, thiết kế tối giản, cao cấp theo phong cách Glassmorphism với tông màu chủ đạo tím/violet sang trọng.

---

## ✨ Tính Năng Nổi Bật

### 1. Giao Diện Người Dùng (Client UI) Cao Cấp
- **Chủ đề tối (Premium Dark Mode):** Sử dụng bảng màu tối sâu kết hợp với hiệu ứng chuyển sắc tím/hồng fuchsia tạo cảm giác vô cùng hiện đại.
- **Tìm kiếm & Lọc thông minh:** Hệ thống tìm kiếm tức thời trên trang chủ theo tên hoặc từ khóa phần mềm.
- **Phân loại danh mục rõ ràng:** Các danh mục tài nguyên được phân chia chi tiết với icon trực quan và bộ đếm số lượng sản phẩm.
- **Trang chi tiết phần mềm chuyên nghiệp:** Cung cấp đầy đủ thông số (Dung lượng, Ngày cập nhật, Lượt tải thực tế) cùng nút tải trực tiếp lớn, bắt mắt.
- **Tương thích hoàn hảo (Fully Responsive):** Hiển thị tối ưu từ màn hình máy tính lớn, máy tính bảng đến điện thoại di động.

### 2. Bảng Quản Trị Hệ Thống (Admin Dashboard)
- **Quản lý danh mục:** Thêm mới, chỉnh sửa thông tin/icon và xóa các danh mục phần mềm.
- **Quản lý phần mềm:** Thêm mới, chỉnh sửa thông số, dung lượng và link tải trực tiếp của từng sản phẩm.
- **Cơ chế lưu trữ kép (Dual-Mode Storage):**
  - **Local API Mode:** Ghi trực tiếp dữ liệu vào tệp JSON trong thư mục `public/data/` (khuyên dùng khi chạy local dev).
  - **GitHub API Integration Mode:** Tự động commit và push các thay đổi thẳng lên GitHub Repository cá nhân qua Personal Access Token (PAT). Giúp Vercel tự động nhận diện thay đổi và build lại Static Site mà không cần duy trì cơ sở dữ liệu truyền thống.
- **Sao lưu nhanh (Backup Data):** Tính năng xuất (export) toàn bộ dữ liệu phần mềm và danh mục ra file JSON ngay trên trình duyệt chỉ với 1 click.

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS (với hiệu ứng Glow Hover & Selection tùy chỉnh)
- **Icons:** Lucide React
- **Data Storage:** Static JSON files (Flat-file Database)
- **Deployment:** Vercel (Hỗ trợ Re-build tự động qua GitHub webhook)

---

## 🚀 Hướng Dẫn Chạy Dự Án

### 1. Cài đặt các phụ thuộc (Dependencies)
```bash
npm install
```

### 2. Chạy Server phát triển (Development Server)
```bash
npm run dev
```
Sau đó truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### 3. Build dự án cho Production
```bash
npm run build
```

---

## 📂 Cấu Trúc Thư Mục Chính

```text
├── public/                  # Tài nguyên tĩnh (Logo, Data JSON)
│   ├── data/                # Nơi lưu trữ file JSON dữ liệu chính
│   │   ├── categories.json  # Dữ liệu danh mục phần mềm
│   │   └── software.json    # Dữ liệu chi tiết phần mềm
│   └── logo.png             # Logo chính thức của T-TEAM Share
├── src/
│   ├── app/                 # Định tuyến Next.js (App Router)
│   │   ├── api/             # API Router hỗ trợ ghi file local
│   │   ├── category/        # Trang chi tiết theo danh mục
│   │   ├── dashboard/       # Trang quản trị admin
│   │   ├── software/        # Trang chi tiết phần mềm tải về
│   │   └── globals.css      # Cấu hình CSS toàn cục & hiệu ứng glow
│   ├── components/          # Các Component tái sử dụng (Navbar, Footer...)
│   └── lib/                 # Các hàm tiện ích & nạp dữ liệu
```

---

## 🎨 Bản Quyền Thiết Kế
Thiết kế và phát triển bởi **T-TEAM Studio** (contact: `businesswithtteamstudio@gmail.com`).
