## Tổng quan các vấn đề phát hiện

Trang chủ vẫn còn trắng vài giây khi mở lần đầu (đặc biệt mobile/3G) và có warning console. Sau khi review, đây là các nguyên nhân chính:

### 1. Critical path còn nặng (block render)
- `src/index.css` đang `@import` Google Fonts (Inter + Playfair, nhiều weight) **đồng bộ ngay đầu CSS** → CSS bị block đến khi font tải xong → trang trắng cho tới lúc đó. Đây là "thủ phạm" lớn nhất khiến mobile bị trắng lâu.
- `src/main.tsx` import `./index.css` ngay → toàn bộ Tailwind + font import phải tải trước khi React mount.
- `index.html` không preconnect tới Supabase / fonts.googleapis nên DNS+TLS chậm trên 4G.

### 2. Bundle ban đầu vẫn cõng nhiều thứ không cần cho trang chủ
- `Header.tsx` (load ngay) import `@tanstack/react-query` và `Button` (kéo Radix Slot) — OK, nhưng `useQuery` cho header categories vẫn được tạo dù `enabled:false` (tốn ít, chấp nhận).
- `HeroSection.tsx` cũng tạo `useQuery` ngay, gọi `import("@/integrations/supabase/client")` ngay khi mount → tải supabase-js trên critical path. Đáng ra Hero có thể render placeholder text mặc định trước, fetch sau khi idle.
- `getOptimizedImageUrl` được dùng trong Hero — OK, nhưng ảnh hero db chưa được preload nên LCP chậm.

### 3. Lỗi console (không gây trắng nhưng nên dọn)
- `SectionTitle` và inline `ArrowRight` trong `ProductsShowcase` / `ProductsBento` bị React cảnh báo "Function components cannot be given refs" do được dùng làm con trực tiếp của `<Link asChild>`/`Slot` ở đâu đó. Cần forwardRef hoặc bọc bằng `<span>`.

### 4. Manual chunks chưa tối ưu
- `vite.config.ts` đang gom `react-vendor` + `supabase` + `query` + `tiptap`. Nhưng `@supabase/supabase-js` thực chất chỉ cần khi user tương tác → để Vite tự code-split theo dynamic import sẽ tốt hơn là ép vào 1 chunk eager.

### 5. Layout shift / "blink" giữa fallback HTML và React
- HTML có spinner xanh, nhưng khi React mount, `Index` render ngay `HeroSection` (background gradient sáng) → người dùng thấy chớp. Nên giữ một skeleton hero match bg.

---

## Kế hoạch thực hiện

### Bước 1 — Loại bỏ Google Fonts blocking (impact lớn nhất cho mobile)
- Bỏ dòng `@import url('https://fonts.googleapis.com/...)` trong `src/index.css`.
- Thêm vào `index.html` (trong `<head>`):
  - `<link rel="preconnect" href="https://fonts.googleapis.com">`
  - `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
  - `<link rel="preconnect" href="https://gkehvopdnlkdjfxqtygi.supabase.co">`
  - `<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" onload="this.rel='stylesheet'">` + noscript fallback.
  - Giảm weight: Inter 400/500/600/700, Playfair 600/700 (bỏ 300/800/400/500 không dùng) → giảm ~60% kích thước font.
- Đảm bảo `font-display: swap` (đã có qua param), nên text hiện ngay với font hệ thống fallback.

### Bước 2 — Inline critical CSS cho hero/header
- Trong `index.html`, mở rộng style của `#root` fallback để có cùng background-color `#f8faf7` với app (đã có), thêm `body { background:#f8faf7; margin:0; font-family: system-ui,-apple-system,sans-serif; }` để tránh flash khi React mount nhưng CSS Tailwind chưa parse xong (rất nhanh nhưng giúp cảm giác mượt).

### Bước 3 — Trì hoãn Supabase trên critical path của Hero
- `HeroSection.tsx`: render text mặc định + ảnh placeholder/gradient ngay lập tức. Đặt `useQuery` với `enabled` chỉ bật sau `requestIdleCallback` (hoặc `setTimeout 0`) → tách supabase-js khỏi initial render.
- Khi data về, hoán đổi sang nội dung DB (đã có sẵn pattern). Loại bỏ skeleton `animate-pulse` che ảnh khi `waiting` để không che đè khi data đến trễ.

### Bước 4 — Preload ảnh hero database (LCP)
- Trong `Header`/`Layout`, sau khi có `image_url` đầu tiên từ DB cho hero, inject `<link rel="preload" as="image" href="...">` qua `useEffect` để browser bắt đầu tải sớm nhất có thể (hoặc dùng `fetchpriority="high"` trên thẻ `<img>` đầu tiên trong Hero).

### Bước 5 — Sửa warning forwardRef
- `SectionTitle` → `forwardRef<HTMLDivElement, SectionTitleProps>`.
- `ArrowRight` inline trong `ProductsShowcase` / `ProductsBento` → đổi thành `forwardRef` hoặc bỏ ra ngoài thành component có forwardRef. (Chỉ cần thiết nếu nó nằm trong `Slot`/`asChild`; kiểm tra & fix.)

### Bước 6 — Tinh chỉnh manualChunks
- Bỏ `supabase` và `tiptap` khỏi `manualChunks` để Vite tự tách theo dynamic import (tránh kéo eager). Giữ lại `react-vendor`, `query`.
- Thêm `build.target: 'es2020'`, `cssCodeSplit: true` (mặc định OK), bật `build.modulePreload.polyfill: false` để giảm vài KB.

### Bước 7 — Giảm tải Header
- Header hiện có `<img logo>` + 2 `useQuery` enabled-on-demand → OK. Chỉ thêm `width/height` cho `<img>` để tránh CLS, `loading="eager"` `fetchpriority="high"` cho logo.

### Bước 8 — Nén ảnh tĩnh nặng nhất
- `src/assets/journey-bg.jpg` (446KB) và `hero-home.jpg` (194KB), `hero-products.jpg` (141KB): chạy lệnh nén bằng sharp/imagemagick để xuất WebP <120KB, giữ độ nét. Cập nhật import trong các component tương ứng.

### Bước 9 — QA & đo lại
- Build & dùng `browser--performance_profile` ở viewport mobile (390×844): kiểm tra TTFB, FCP, LCP, long tasks.
- Mục tiêu: FCP < 1.5s trên 4G, không còn white screen > 500ms sau khi script bắt đầu chạy.

---

## Section kỹ thuật (chi tiết file thay đổi)

| File | Thay đổi |
|---|---|
| `src/index.css` | Bỏ `@import` Google Fonts |
| `index.html` | Preconnect + preload font (async pattern), inline body bg |
| `src/components/home/HeroSection.tsx` | Defer query bằng `requestIdleCallback`, bỏ skeleton overlay che ảnh, thêm `fetchpriority="high"` |
| `src/components/SectionTitle.tsx` | Bọc bằng `forwardRef` |
| `src/components/home/ProductsShowcase.tsx` | `ArrowRight` thành component forwardRef hoặc inline span |
| `src/components/home/ProductsBento.tsx` | Tương tự ProductsShowcase |
| `vite.config.ts` | Gọn `manualChunks` (chỉ react-vendor + query) |
| `src/components/Header.tsx` | Thêm width/height + fetchpriority cho logo |
| `src/assets/*.jpg` | Nén & convert sang webp những ảnh > 100KB |

Không cần thay đổi DB, RLS, edge functions hay dependencies (đã có sẵn mọi thứ cần thiết).

Sau khi bạn duyệt plan, tôi sẽ chuyển sang chế độ build và thực hiện theo thứ tự trên, ưu tiên Bước 1 (font) vì đó là nguyên nhân chính gây màn trắng trên mobile.