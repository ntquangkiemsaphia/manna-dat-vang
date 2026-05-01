import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { LucideIcon, ICON_OPTIONS } from "@/lib/lucideIcon";

const LABELS: Record<string, string> = {
  header: "Tiêu đề chung của section",
  vision: "Card Tầm Nhìn",
  mission: "Card Sứ Mệnh",
};

const VisionMissionAdmin = () => {
  const { data: items = [] } = useQuery({
    queryKey: ["admin-vision-mission"],
    queryFn: async () => {
      const { data } = await supabase.from("vision_mission").select("*").order("sort_order");
      return data || [];
    },
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Quản lý nội dung section "Tầm nhìn & Sứ mệnh" trên trang chủ.
      </p>
      {items.map((item: any) => (
        <VMCard key={item.id} item={item} />
      ))}
    </div>
  );
};

const VMCard = ({ item }: { item: any }) => {
  const qc = useQueryClient();
  const isHeader = item.section_key === "header";
  const [form, setForm] = useState({
    eyebrow: item.eyebrow || "",
    title: item.title || "",
    description: item.description || "",
    icon_name: item.icon_name || "Target",
    image_url: item.image_url || "",
  });

  const saveMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("vision_mission").update(form).eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã lưu");
      qc.invalidateQueries({ queryKey: ["admin-vision-mission"] });
      qc.invalidateQueries({ queryKey: ["vision_mission"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="bg-card rounded-xl shadow-card p-5 border border-border">
      <h3 className="font-semibold text-foreground mb-4">{LABELS[item.section_key] || item.section_key}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {isHeader && (
            <div>
              <label className="text-sm font-medium mb-1 block">Tiêu đề phụ (chữ in nghiêng)</label>
              <Input value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-1 block">Tiêu đề chính</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Mô tả</label>
            <Textarea
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          {!isHeader && (
            <div>
              <label className="text-sm font-medium mb-1 block">Icon</label>
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
          )}
        </div>
        {!isHeader && (
          <div>
            <label className="text-sm font-medium mb-1 block">Ảnh nền card</label>
            <ImageUpload
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              folder="vision-mission"
            />
            <p className="text-[11px] text-muted-foreground mt-2">
              Ảnh sẽ phủ nền card với độ trong suốt nhẹ.
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
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

export default VisionMissionAdmin;