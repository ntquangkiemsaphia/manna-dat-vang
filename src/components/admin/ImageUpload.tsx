import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { compressImage } from "@/lib/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

const ImageUpload = ({ value, onChange, folder = "images" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ chấp nhận file ảnh");
      return;
    }

    setUploading(true);
    const originalSize = file.size;
    try {
      file = await compressImage(file);
      if (file.size < originalSize) {
        const before = (originalSize / 1024 / 1024).toFixed(2);
        const after = (file.size / 1024 / 1024).toFixed(2);
        toast.message(`Đã nén ảnh ${before}MB → ${after}MB`);
      }
    } catch {
      // Bỏ qua, dùng file gốc
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ảnh quá lớn (>10MB sau khi nén). Vui lòng chọn ảnh khác.");
      setUploading(false);
      return;
    }

    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("uploads").upload(fileName, file);
    if (error) {
      toast.error("Lỗi tải ảnh: " + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(fileName);
    onChange(urlData.publicUrl);
    setUploading(false);
    toast.success("Đã tải ảnh lên");
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="h-32 rounded-lg object-cover border border-border" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
          {uploading ? "Đang tải..." : "Tải ảnh lên"}
        </Button>
      </div>
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Hoặc nhập URL ảnh..."
        className="text-xs"
      />
    </div>
  );
};

export default ImageUpload;
