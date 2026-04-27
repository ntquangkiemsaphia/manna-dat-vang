/**
 * Client-side image utilities:
 * - compressImage: nén ảnh lớn (>3MB) xuống ~<1MB, giữ độ nét bằng cách
 *   resize cạnh dài tối đa và xuất WebP/JPEG chất lượng cao.
 * - getOptimizedImageUrl: dùng Supabase Storage transform để serve ảnh
 *   nhẹ hơn cho các URL đã lưu trong DB (không cần re-upload).
 */

const LARGE_FILE_BYTES = 3 * 1024 * 1024; // 3MB → trigger nén
const TARGET_BYTES = 1 * 1024 * 1024; // mục tiêu < 1MB
const MAX_DIMENSION = 1920; // px, đủ nét cho hero/banner

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));

/**
 * Nén ảnh nếu file > 3MB. Trả về File đã nén (hoặc file gốc nếu không cần).
 * Giữ tên file, đổi extension theo MIME đầu ra.
 */
export const compressImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) return file;
  // GIF / SVG: giữ nguyên (animation, vector)
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;
  if (file.size <= LARGE_FILE_BYTES) return file;

  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch {
    return file;
  }

  // Tính kích thước mới: cạnh dài <= MAX_DIMENSION
  const ratio = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);

  // Ưu tiên JPEG (tương thích rộng), giữ alpha → PNG fallback
  const hasAlpha = file.type === "image/png" || file.type === "image/webp";
  const outType = hasAlpha ? "image/webp" : "image/jpeg";
  const ext = outType === "image/webp" ? "webp" : "jpg";

  // Giảm dần quality cho đến khi < TARGET_BYTES (hoặc tới ngưỡng tối thiểu)
  const qualities = [0.85, 0.8, 0.75, 0.7, 0.65, 0.6];
  let blob: Blob | null = null;
  for (const q of qualities) {
    blob = await canvasToBlob(canvas, outType, q);
    if (!blob) continue;
    if (blob.size <= TARGET_BYTES) break;
  }
  if (!blob) return file;

  // Nếu vẫn lớn hơn file gốc thì dùng file gốc
  if (blob.size >= file.size) return file;

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.${ext}`, {
    type: outType,
    lastModified: Date.now(),
  });
};

/**
 * Tạo URL ảnh tối ưu hơn cho ảnh đã lưu trong Supabase Storage.
 * Dùng Storage Image Transformation (chuyển /object/public/ → /render/image/public/).
 * Với URL bên ngoài thì trả về nguyên gốc.
 */
export const getOptimizedImageUrl = (
  url: string | null | undefined,
  opts: { width?: number; quality?: number } = {}
): string => {
  if (!url) return "";
  if (!url.includes("/storage/v1/object/public/")) return url;
  const { width = 1280, quality = 75 } = opts;
  const transformed = url.replace(
    "/storage/v1/object/public/",
    "/storage/v1/render/image/public/"
  );
  const sep = transformed.includes("?") ? "&" : "?";
  return `${transformed}${sep}width=${width}&quality=${quality}&resize=contain`;
};
