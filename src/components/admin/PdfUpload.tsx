import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

interface PdfUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

const PdfUpload = ({ value, onChange, folder = "catalogs" }: PdfUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Chỉ chấp nhận file PDF");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File quá lớn (>50MB)");
      return;
    }
    setUploading(true);
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from("uploads").upload(fileName, file, {
      contentType: "application/pdf",
      cacheControl: "3600",
    });
    if (error) {
      toast.error("Lỗi tải lên: " + error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(fileName);
    onChange(urlData.publicUrl);
    setUploading(false);
    toast.success("Đã tải PDF lên");
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
          <FileText className="w-5 h-5 text-primary shrink-0" />
          <a href={value} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline truncate flex-1">
            {value.split("/").pop()}
          </a>
          <button type="button" onClick={() => onChange("")} className="text-destructive hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input ref={fileRef} type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
          {uploading ? "Đang tải..." : "Tải PDF lên"}
        </Button>
      </div>
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Hoặc nhập URL PDF..."
        className="text-xs"
      />
    </div>
  );
};

export default PdfUpload;