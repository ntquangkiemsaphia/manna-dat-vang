# Plan: sửa trắng trang vuakiem.com khi reload

## Nguyên nhân (đã verify trực tiếp trên production)

- HTML hiện tại đã là build mới (có loading fallback, có split chunks).
- Browser khi reload báo:
  ```
  ERR_CONTENT_LENGTH_MISMATCH https://vuakiem.com/assets/client-DHMswld2.js
  ```
- Curl xác minh: nginx khai `Content-Length: 194909` cho file đó, nhưng kết nối đóng sớm tại đúng `130461` bytes (cả với `identity` lẫn `gzip`), kèm `SSL unexpected eof while reading`. Lặp lại 100%.
- Vì `client-*.js` là chunk chứa `react-dom/client` (entry bootstrap React 18), tải hỏng nó → React không mount → người dùng chỉ thấy loading fallback rồi trắng.

Nguyên nhân kết hợp:
1. Vite/Rollup tách ra 1 chunk riêng `client-*.js` cho `react-dom/client` thay vì gộp vào `react-vendor` (do `manualChunks` chỉ liệt kê `react-dom` và Rollup vẫn phân giải `react-dom/client` thành module độc lập trong một số trường hợp dedupe).
2. File này trên server self-host bị **cắt giữa chừng**: nginx đọc tới byte 130461 thì gặp EOF — file vật lý trong image/volume bị hỏng hoặc bị thay đổi giữa lúc deploy. Vì JS lỗi nên app trắng.

Bản trên `manna-dat-vang.lovable.app` không bị do hosting Lovable không phục vụ file lỗi đó.

## Phạm vi thay đổi

### 1. Vite — gom react-dom/client vào chung chunk react-vendor

File: `vite.config.ts`

- Đổi `manualChunks` để cả `react-dom`, `react-dom/client`, `react/jsx-runtime` cùng nằm trong `react-vendor`. Dùng dạng function thay vì map để bắt đúng các sub-path:
  ```ts
  manualChunks(id) {
    if (id.includes("node_modules")) {
      if (
        id.includes("react-dom") ||
        id.includes("/react/") ||
        id.includes("react-router")
      ) return "react-vendor";
      if (id.includes("@tanstack/react-query") || id.includes("@tanstack/query-core"))
        return "query";
    }
  }
  ```
- Hệ quả: không còn chunk `client-*.js`. Toàn bộ React core nằm trong 1 chunk đã preload, loại bỏ điểm fail.

### 2. Nginx — chống serve file asset bị cắt và xoá cache cũ

File: `docker/nginx.conf`

- Thêm cho block `location /assets/`:
  ```
  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  open_file_cache off;
  gzip_static off;
  etag on;
  if_modified_since exact;
  ```
  - `open_file_cache off` để nginx không giữ inode cũ sau khi container deploy mới.
  - `gzip_static off` để không vô tình serve file `.gz` cũ không khớp.
- Thêm fallback 404 rõ ràng cho asset thiếu (tránh SPA fallback nuốt request asset rồi trả `index.html` với content-type sai):
  ```
  location /assets/ {
    try_files $uri =404;
    ...
  }
  ```
  (đang có rồi — chỉ cần giữ và đảm bảo các header trên).

### 3. Deploy script — đảm bảo image mới ghi đè sạch

File: `.github/workflows/deploy.yml`

- Trước `docker compose up -d --force-recreate`, thêm:
  ```
  docker image prune -f
  docker volume prune -f || true
  ```
  để chắc chắn không còn layer/volume cache giữ file `client-*.js` cũ bị cắt.
- Không cần đổi base image.

### 4. Không sửa code React/app

Lý do: app trên Lovable preview bootstrap bình thường, lỗi chỉ xảy ra trên domain self-host vì asset bị cắt. Không sửa nhầm component.

## Quy trình thực thi (lặp 3 lần như user yêu cầu)

Mỗi vòng:

1. Apply thay đổi (vòng 1: tất cả mục 1–3; vòng 2,3: chỉ deploy lại nếu vòng trước vẫn còn lỗi).
2. Build & push qua GitHub Action `deploy.yml` (tự chạy khi commit vào `main`).
3. Kiểm tra production:
   ```
   curl -I https://vuakiem.com/
   curl https://vuakiem.com/ | grep -E '/assets/(react-vendor|index|client)'
   ```
   - Phải thấy KHÔNG còn `client-*.js` (sau mục 1).
   - HTML phải có hash mới.
4. Tải từng asset:
   ```
   for f in $(curl -s https://vuakiem.com/ | grep -oE '/assets/[^" ]+\.js'); do
     curl -sS -o /tmp/x -w "$f http=%{http_code} size=%{size_download}\n" https://vuakiem.com$f
   done
   ```
   - Mỗi file phải có `http=200`, `size_download` đúng `Content-Length` từ HEAD.
5. Mở browser tới `https://vuakiem.com/`, screenshot + đọc console:
   - Không còn `ERR_CONTENT_LENGTH_MISMATCH`.
   - Trang chủ render Hero/Stats như preview.
   - Reload (`Ctrl+F5`) ít nhất 2 lần liên tiếp đều render đúng.

Vòng được tính “pass” khi cả bước 3, 4, 5 đều xanh. Lặp lại đủ 3 vòng pass liên tiếp mới kết thúc. Nếu vòng nào vẫn lỗi → ghi log mới (status code, byte count, console error), điều chỉnh nginx (ví dụ tắt thêm `sendfile`, hoặc thêm `proxy_buffering off` nếu phía trước có Cloudflare/Nginx khác), rồi deploy lại và đếm lại từ vòng 1.

## File dự kiến chỉnh

| File | Mục đích |
|---|---|
| `vite.config.ts` | Gộp `react-dom/client` vào `react-vendor`, không sinh chunk `client-*.js` |
| `docker/nginx.conf` | Tắt cache file mở, tắt gzip_static, đảm bảo serve đúng độ dài asset |
| `.github/workflows/deploy.yml` | Prune image/volume cũ trước khi up |

## Lưu ý

- Nếu sau cả 3 vòng vẫn còn `ERR_CONTENT_LENGTH_MISMATCH` cho một file khác, gốc rễ sẽ là tầng mạng phía trước nginx (Cloudflare proxy hoặc reverse proxy bên ngoài đang cache 1 phần body). Khi đó cần purge cache CDN/proxy đó — việc này nằm ngoài repo và sẽ cần user thao tác trên dashboard CDN.
