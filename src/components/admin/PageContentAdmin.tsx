import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HtmlEditor from "./HtmlEditor";
import { toast } from "sonner";
import { Save } from "lucide-react";

type PageKey = { page: string; section: string; label: string };

const PAGES: PageKey[] = [
  { page: "about", section: "full_html", label: "Trang Giới thiệu" },
];

const PageContentAdmin = () => {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Soạn nội dung HTML cho từng trang. Có thể chuyển qua lại giữa chế độ
        soạn thảo trực quan và chế độ HTML thô.
      </p>
      <Tabs defaultValue={PAGES[0].page}>
        <TabsList className="mb-4 flex-wrap h-auto">
          {PAGES.map((p) => (
            <TabsTrigger key={p.page} value={p.page}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {PAGES.map((p) => (
          <TabsContent key={p.page} value={p.page}>
            <PageEditor pageKey={p} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const PageEditor = ({ pageKey }: { pageKey: PageKey }) => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["page_html", pageKey.page, pageKey.section],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page", pageKey.page)
        .eq("section", pageKey.section)
        .maybeSingle();
      return data;
    },
  });

  const [html, setHtml] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (data) {
      setHtml(data.description || "");
      setTitle(data.title || "");
    }
  }, [data]);

  const saveMut = useMutation({
    mutationFn: async () => {
      if (data?.id) {
        const { error } = await supabase
          .from("page_sections")
          .update({ description: html, title })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("page_sections").insert({
          page: pageKey.page,
          section: pageKey.section,
          title,
          description: html,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Đã lưu nội dung");
      qc.invalidateQueries({ queryKey: ["page_html"] });
      qc.invalidateQueries({ queryKey: ["page_sections"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Đang tải...</p>;

  return (
    <div className="space-y-4 bg-card rounded-xl shadow-card p-5 border border-border">
      <div>
        <label className="text-sm font-medium mb-1 block">Tiêu đề (nội bộ)</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Nội dung</label>
        <HtmlEditor value={html} onChange={setHtml} />
        <p className="text-xs text-muted-foreground mt-1">
          Mẹo: Dùng nút ảnh trong thanh công cụ "Soạn thảo" để tải ảnh lên và
          chèn vào bài. Trong chế độ HTML, bạn có thể dán URL ảnh trực tiếp
          vào thẻ <code>&lt;img src="..." /&gt;</code>.
        </p>
      </div>
      <Button
        className="gradient-primary text-primary-foreground border-0"
        onClick={() => saveMut.mutate()}
        disabled={saveMut.isPending}
      >
        <Save className="w-4 h-4 mr-1" />
        {saveMut.isPending ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </div>
  );
};

export default PageContentAdmin;
