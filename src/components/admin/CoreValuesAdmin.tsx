import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { LucideIcon, ICON_OPTIONS } from "@/lib/lucideIcon";

const CoreValuesAdmin = () => {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["admin-core-values"],
    queryFn: async () => {
      const { data } = await supabase.from("core_values").select("*").order("sort_order");
      return data || [];
    },
  });

  const createMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("core_values").insert({
        title: "Giá trị mới",
        icon_name: "Sparkles",
        sort_order: (items[items.length - 1]?.sort_order ?? 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã thêm");
      qc.invalidateQueries({ queryKey: ["admin-core-values"] });
      qc.invalidateQueries({ queryKey: ["core_values"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Quản lý các ô "Giá trị cốt lõi" hiển thị trên trang chủ. Có thể dùng icon hoặc ảnh tròn.
        </p>
        <Button
          size="sm"
          className="gradient-primary text-primary-foreground border-0"
          onClick={() => createMut.mutate()}
          disabled={createMut.isPending}
        >
          <Plus className="w-4 h-4 mr-1" /> Thêm giá trị
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item: any) => (
          <ValueCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const ValueCard = ({ item }: { item: any }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: item.title,
    icon_name: item.icon_name,
    image_url: item.image_url || "",
    is_highlight: item.is_highlight,
    sort_order: item.sort_order,
  });

  const saveMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("core_values").update(form).eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã lưu");
      qc.invalidateQueries({ queryKey: ["admin-core-values"] });
      qc.invalidateQueries({ queryKey: ["core_values"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("core_values").delete().eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã xoá");
      qc.invalidateQueries({ queryKey: ["admin-core-values"] });
      qc.invalidateQueries({ queryKey: ["core_values"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="bg-card rounded-xl shadow-card p-5 border border-border">
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${
            form.is_highlight ? "gradient-primary text-primary-foreground" : "bg-accent text-primary"
          }`}
        >
          {form.image_url ? (
            <img src={form.image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <LucideIcon name={form.icon_name} className="w-8 h-8" strokeWidth={1.5} />
          )}
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Tiêu đề</label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Icon</label>
          <Select value={form.icon_name} onValueChange={(v) => setForm({ ...form, icon_name: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {ICON_OPTIONS.map((n) => (
                <SelectItem key={n} value={n}>
                  <span className="inline-flex items-center gap-2">
                    <LucideIcon name={n} className="w-4 h-4" /> {n}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Thứ tự</label>
          <Input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="text-xs text-muted-foreground mb-1 block">Ảnh tròn (tuỳ chọn — sẽ ưu tiên hơn icon)</label>
        <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="core-values" />
      </div>

      <label className="flex items-center gap-2 text-sm mb-3">
        <input
          type="checkbox"
          checked={form.is_highlight}
          onChange={(e) => setForm({ ...form, is_highlight: e.target.checked })}
        />
        Làm nổi bật (nền xanh đậm)
      </label>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => {
            if (confirm("Xoá giá trị này?")) deleteMut.mutate();
          }}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Xoá
        </Button>
        <Button
          size="sm"
          className="gradient-primary text-primary-foreground border-0"
          onClick={() => saveMut.mutate()}
          disabled={saveMut.isPending}
        >
          <Save className="w-4 h-4 mr-1" /> {saveMut.isPending ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  );
};

export default CoreValuesAdmin;