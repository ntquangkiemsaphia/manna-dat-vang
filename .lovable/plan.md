## Kết quả review hiện tại

Tôi đã kiểm tra đúng theo thứ tự: HTML trả về trước, rồi asset JS/CSS, rồi browser network.

### 1. Domain Lovable publish đang trả HTML hợp lệ
`https://manna-dat-vang.lovable.app/` trả về HTML mới, có fallback loading trong `#root`, có preload font, và bundle đã được tách nhỏ:

```text
/assets/index-CoLviRX_.js       ~41 KB
/assets/query-DY7N8mpO.js       modulepreload
/assets/react-vendor-BAMQe-ZL.js modulepreload
/assets/index-dDC52mRQ.css
```

Điều này cho thấy bản Lovable publish hiện tại không còn là HTML rỗng hoàn toàn.

### 2. Domain `https://vuakiem.com/` đang trả HTML cũ
HTML hiện tại từ `vuakiem.com` là bản cũ hơn:

```html
<div id="root"></div>
<script type="module" crossorigin src="/assets/index-CCgAEa0q.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-aMO2qmxh.css">
```

Các dấu hiệu bản cũ:
- `#root` rỗng, không có fallback loading.
- CSS vẫn còn `@import` Google Fonts blocking.
- Chưa có `modulepreload` cho `react-vendor` và `query`.
- Main JS vẫn là một file lớn khoảng `1,079,819 bytes`.

### 3. Nguyên nhân trực tiếp gây trắng trang trên `vuakiem.com`
Browser report:

```text
Failed to load resource: net::ERR_INCOMPLETE_CHUNKED_ENCODING
https://vuakiem.com/assets/index-CCgAEa0q.js
```

Tôi cũng kiểm tra bằng `curl`: server khai báo `Content-Length: 1079819` nhưng kết nối bị đóng khi mới tải được khoảng `130 KB` ở chế độ không nén, hoặc khoảng `419 KB` khi gzip. Vì JS chính tải không hoàn tất, trình duyệt không chạy React, nên `#root` vẫn rỗng và trang trắng.

Kết luận: lỗi trắng trang hiện tại trên domain thật **không phải do component React không render**, mà do **deploy/self-host server đang phục vụ asset JS bị cắt ngang**, cộng thêm domain đó đang chạy **build cũ**.

## Plan xử lý sau khi được duyệt

### Bước 1 — Sửa cấu hình self-host để không dùng `vite preview` làm production server
Hiện `Dockerfile` đang chạy:

```text
npm run preview
```

`vite preview` chỉ phù hợp để preview build, không nên dùng làm production server sau nginx reverse proxy, đặc biệt khi asset lớn/gzip/chunked dễ phát sinh lỗi truyền tải.

Tôi sẽ đổi Dockerfile sang production static server bằng nginx container:

```text
Stage 1: node build app
Stage 2: nginx serve /usr/share/nginx/html
```

### Bước 2 — Thêm nginx config chuẩn cho SPA + cache asset
Tạo config nginx trong repo để container phục vụ file build trực tiếp:

- Route SPA fallback:
  - `/` và deep link như `/san-pham/...` trả `index.html`.
- Asset cache đúng:
  - `/assets/*` cache dài hạn, immutable.
  - `index.html` no-cache để cập nhật deploy nhanh.
- Tắt nguy cơ chunked/proxy sai từ `vite preview`, vì nginx sẽ đọc file tĩnh trực tiếp và trả `Content-Length` ổn định.

### Bước 3 — Giảm thêm rủi ro bundle quá lớn trên self-host
Mặc dù bản mới trên Lovable đã split còn nhỏ, self-host vẫn đang chạy build cũ. Tôi sẽ rà lại để đảm bảo:

- `vite.config.ts` vẫn giữ manual chunks hiện tại: `react-vendor`, `query`.
- Supabase/Tiptap không bị kéo vào chunk đầu.
- Các route nặng như admin/catalog/products/news vẫn lazy-load.
- Nếu cần, tách thêm `ui-vendor`/`radix` để main JS không phình to trở lại.

### Bước 4 — Fix các warning còn lại nhưng không trộn với nguyên nhân trắng trang
Console hiện còn warning `Function components cannot be given refs`, chủ yếu từ `PatentsSection`/`DialogContent`. Warning này không làm trắng trang, nhưng sẽ được dọn sau phần deploy:

- Sửa `DialogPortal` nếu đang bị Radix truyền ref vào function component không forwardRef.
- Rà `PatentsSection` để không đưa function component trực tiếp vào vị trí cần ref.

### Bước 5 — Sau khi sửa, cần deploy lại self-host và kiểm tra HTML/JS trước khi xem UI
Sau khi apply code, workflow deploy hiện có sẽ build Docker image và `docker compose up -d --force-recreate` trên server. Vì tôi không có quyền SSH trực tiếp từ đây để chạy deploy production, bước xác nhận sau deploy sẽ là:

1. Trigger deploy qua push/workflow hiện tại hoặc người quản trị server chạy lại deploy.
2. Kiểm tra HTML:

```text
curl -I https://vuakiem.com/
curl https://vuakiem.com/ | grep '/assets/index-'
```

3. Kiểm tra JS tải đủ:

```text
curl -I https://vuakiem.com/assets/<file>.js
curl -sS https://vuakiem.com/assets/<file>.js -o /tmp/app.js
```

Kỳ vọng:
- Không còn `ERR_INCOMPLETE_CHUNKED_ENCODING`.
- JS tải đủ theo `Content-Length`.
- HTML có fallback loading hoặc build mới.
- Browser hiển thị trang chủ ngay, không còn trắng.

## File dự kiến chỉnh

| File | Mục đích |
|---|---|
| `Dockerfile` | Chuyển từ `vite preview` sang nginx static production server |
| `nginx.conf` hoặc `docker/nginx.conf` | SPA fallback, cache asset, headers đúng |
| `.github/workflows/deploy.yml` | Nếu cần, đảm bảo build không cache sai và container recreate sạch |
| `vite.config.ts` | Chỉ tinh chỉnh thêm nếu bundle self-host vẫn gom thành 1 file lớn |
| `src/components/ui/dialog.tsx` | Dọn warning ref còn lại |
| `src/components/home/PatentsSection.tsx` | Dọn warning ref liên quan dialog/patent modal nếu cần |

## Lưu ý quan trọng

Bản tại `vuakiem.com` hiện đang không trùng với bản Lovable publish. Vì vậy sau khi sửa code trong repo, cần deploy lại domain `vuakiem.com`; nếu server vẫn phục vụ image cũ thì lỗi trắng trang sẽ còn dù code trong Lovable đã đúng.