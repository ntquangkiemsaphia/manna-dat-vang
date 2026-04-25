import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MultiImageUpload from "./MultiImageUpload";
import { usePageSections, type PageSection } from "@/hooks/usePageSection";

const PAGE_LABELS: Record<string, string> = {
  home: "Trang chủ",
  about: "Giới thiệu",
  products: "Sản phẩm",
  news: "Tin tức",
  contact: "Liên hệ",
};

const PageSectionsAdmin = () => {
  const { data: sections = [] } = usePageSections();

  const grouped = useMemo(() => {
    const map: Record<string, PageSection[]> = {};
    for (const s of sections) {
      if (!map[s.page]) map[s.page] = [];
      map[s.page].push(s);
    }
    return map;
  }, [sections]);

  const pages = Object.keys(grouped).length
    ? Object.keys(grouped)
    : Object.keys(PAGE_LABELS);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Quản lý ảnh và nội dung tĩnh của từng phần trên mỗi trang.
        </p>
        <NewSectionDialog />
      </div>

      <Tabs defaultValue={pages[0]}>
        <TabsList className="mb-4 flex-wrap h-auto">
          {pages.map((p) => (
            <TabsTrigger key={p} value={p}>
              {PAGE_LABELS[p] || p}
            </TabsTrigger>
          ))}
        </TabsList>

        {pages.map((p) => (
          <TabsContent key={p} value={p} className="space-y-6">
            {(grouped[p] || []).map((section) => (
              <SectionEditor key={section.id} section={section} />
            ))}
            {(!grouped[p] || grouped[p].length === 0) && (
              <p className="text-sm text-muted-foreground italic">
                Chưa có section nào cho trang này. Nhấn "Thêm section" để tạo mới.
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const SectionEditor = ({ section }: { section: PageSection }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: section.title,
    subtitle: section.subtitle,
    description: section.description,
    cta_text: section.cta_text,
    cta_link: section.cta_link,
    image_url: section.image_url || "",
    sort_order: section.sort_order,
  });

  const saveMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("page_sections")
        .update(form)
        .eq("id", section.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã lưu");
      qc.invalidateQueries({ queryKey: ["page_sections"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("page_sections")
        .delete()
        .eq("id", section.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã xoá");
      qc.invalidateQueries({ queryKey: ["page_sections"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="bg-card rounded-xl shadow-card p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground capitalize">
            {section.section}
          </h3>
          <p className="text-xs text-muted-foreground">
            page: <code>{section.page}</code> · section:{" "}
            <code>{section.section}</code>
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive"
          onClick={() => {
            if (confirm("Xoá section này?")) deleteMut.mutate();
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Tiêu đề</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Phụ đề</label>
            <Input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Mô tả ngắn</label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Nút CTA</label>
              <Input
                value={form.cta_text}
                onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                placeholder="Xem thêm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Link CTA</label>
              <Input
                value={form.cta_link}
                onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                placeholder="/san-pham"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Thứ tự</label>
            <Input
              type="number"
              value={form.sort_order}
              onChange={(e) =>
                setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Ảnh {section.section === "hero" ? "(slideshow — đổi mỗi 4s)" : ""}
          </label>
          <MultiImageUpload
            value={form.image_url}
            onChange={(val) => setForm({ ...form, image_url: val })}
            folder={`pages/${section.page}/${section.section}`}
          />
        </div>
      </div>

      <Button
        className="mt-4 gradient-primary text-primary-foreground border-0"
        onClick={() => saveMut.mutate()}
        disabled={saveMut.isPending}
      >
        <Save className="w-4 h-4 mr-1" />
        {saveMut.isPending ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </div>
  );
};

const NewSectionDialog = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    page: "home",
    section: "",
    title: "",
  });

  const createMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("page_sections").insert({
        page: form.page.trim(),
        section: form.section.trim(),
        title: form.title,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã tạo section");
      qc.invalidateQueries({ queryKey: ["page_sections"] });
      setOpen(false);
      setForm({ page: "home", section: "", title: "" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gradient-primary text-primary-foreground border-0"
        >
          <Plus className="w-4 h-4 mr-1" /> Thêm section
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm section mới</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.section.trim()) {
              toast.error("Nhập key cho section");
              return;
            }
            createMut.mutate();
          }}
        >
          <div>
            <label className="text-sm font-medium mb-1 block">Trang</label>
            <Input
              value={form.page}
              onChange={(e) => setForm({ ...form, page: e.target.value })}
              placeholder="home, about, products..."
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Key section
            </label>
            <Input
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              placeholder="hero, story, journey..."
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Tiêu đề</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <Button
            type="submit"
            className="w-full gradient-primary text-primary-foreground border-0"
            disabled={createMut.isPending}
          >
            {createMut.isPending ? "Đang tạo..." : "Tạo section"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PageSectionsAdmin;
