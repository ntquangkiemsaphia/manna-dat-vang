import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { compressImage } from "@/lib/image";

interface MultiImageUploadProps {
  value: string; // newline-separated URLs
  onChange: (val: string) => void;
  folder?: string;
}

const parseUrls = (val: string): string[] =>
  (val || "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

const MultiImageUpload = ({ value, onChange, folder = "images" }: MultiImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const urls = parseUrls(value);

  const setUrls = (next: string[]) => onChange(next.join("\n"));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const added: string[] = [];
    let compressedCount = 0;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const originalSize = file.size;
      let processed = file;
      try {
        processed = await compressImage(file);
        if (processed.size < originalSize) compressedCount++;
      } catch {
        processed = file;
      }
      if (processed.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}: quá lớn (>10MB sau khi nén)`);
        continue;
      }
      const ext = processed.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("uploads").upload(fileName, processed);
      if (error) {
        toast.error("Lỗi tải ảnh: " + error.message);
        continue;
      }
      const { data } = supabase.storage.from("uploads").getPublicUrl(fileName);
      added.push(data.publicUrl);
    }
    if (added.length) {
      setUrls([...urls, ...added]);
      toast.success(
        compressedCount > 0
          ? `Đã tải ${added.length} ảnh (đã nén ${compressedCount} ảnh lớn)`
          : `Đã tải ${added.length} ảnh`
      );
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeAt = (idx: number) => setUrls(urls.filter((_, i) => i !== idx));

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...urls];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setUrls(next);
  };

  return (
    <div className="space-y-3">
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {urls.map((u, idx) => (
            <div key={`${u}-${idx}`} className="relative group">
              <img
                src={u}
                alt={`Ảnh ${idx + 1}`}
                className="w-full h-24 rounded-lg object-cover border border-border"
              />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80"
                aria-label="Xoá"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1 left-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  className="bg-background/90 border border-border rounded px-1 text-[10px]"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  className="bg-background/90 border border-border rounded px-1 text-[10px]"
                >
                  →
                </button>
                <span className="bg-background/90 border border-border rounded px-1 text-[10px] flex items-center gap-0.5">
                  <GripVertical className="w-3 h-3" />
                  {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-1" />
          )}
          {uploading ? "Đang tải..." : "Tải nhiều ảnh"}
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Hoặc dán URL ảnh rồi nhấn Thêm"
          className="text-xs"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const v = newUrl.trim();
            if (!v) return;
            setUrls([...urls, v]);
            setNewUrl("");
          }}
        >
          Thêm
        </Button>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Nhiều ảnh sẽ tự động chuyển slide mỗi 4 giây ở các section hỗ trợ slideshow
        (ví dụ: Hero trang chủ).
      </p>
    </div>
  );
};

export default MultiImageUpload;
