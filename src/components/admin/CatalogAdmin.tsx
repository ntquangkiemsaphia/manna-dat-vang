import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import PdfUpload from "./PdfUpload";

const PAGE = "catalog";
const SECTION = "file";

const CatalogAdmin = () => {
  const qc = useQueryClient();
  const { data: row } = useQuery({
    queryKey: ["catalog-admin"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page", PAGE)
        .eq("section", SECTION)
        .maybeSingle();
      return data;
    },
  });

  const [title, setTitle] = useState("Catalog sản phẩm Manna Đất Vàng");
  const [subtitle, setSubtitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if (row) {
      setTitle(row.title || "Catalog sản phẩm Manna Đất Vàng");
      setSubtitle(row.subtitle || "");
      setFileUrl(row.cta_link || "");
    }
  }, [row]);

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = {
        page: PAGE,
        section: SECTION,
        title,
        subtitle,
        cta_link: fileUrl,
        description: "",
        cta_text: "",
        sort_order: 0,
      };
      if (row) {
        const { error } = await supabase.from("page_sections").update(payload).eq("id", row.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("page_sections").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Đã lưu catalog");
      qc.invalidateQueries({ queryKey: ["catalog-admin"] });
      qc.invalidateQueries({ queryKey: ["catalog-public"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="bg-card rounded-xl shadow-card p-6 space-y-4 max-w-2xl">
      <h2 className="text-lg font-semibold">Catalog (PDF)</h2>
      <p className="text-sm text-muted-foreground">
        Tải lên file PDF catalog để hiển thị trong menu Giới thiệu → Catalog.
      </p>
      <div>
        <label className="text-sm font-medium mb-1 block">Tiêu đề</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Mô tả ngắn</label>
        <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">File PDF</label>
        <PdfUpload value={fileUrl} onChange={setFileUrl} folder="catalogs" />
      </div>
      <Button
        className="gradient-primary text-primary-foreground border-0"
        onClick={() => saveMut.mutate()}
        disabled={saveMut.isPending}
      >
        {saveMut.isPending ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </div>
  );
};

export default CatalogAdmin;