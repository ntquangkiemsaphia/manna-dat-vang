import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { useJourneyMilestones, type JourneyMilestone } from "@/hooks/useJourneyMilestones";

const JourneyAdmin = () => {
  const { data: milestones = [] } = useJourneyMilestones();
  const qc = useQueryClient();

  const createMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("journey_milestones").insert({
        year: "Mới",
        title: "Mốc thời gian mới",
        description: "",
        sort_order: (milestones[milestones.length - 1]?.sort_order ?? 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã thêm mốc");
      qc.invalidateQueries({ queryKey: ["journey_milestones"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Quản lý các mốc thời gian hiển thị ở section "Hành trình của Manna Đất Vàng" trên trang chủ.
        </p>
        <Button
          size="sm"
          className="gradient-primary text-primary-foreground border-0"
          onClick={() => createMut.mutate()}
          disabled={createMut.isPending}
        >
          <Plus className="w-4 h-4 mr-1" /> Thêm mốc
        </Button>
      </div>

      <div className="space-y-4">
        {milestones.map((m) => (
          <MilestoneCard key={m.id} milestone={m} />
        ))}
        {milestones.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            Chưa có mốc nào. Nhấn "Thêm mốc" để tạo mới.
          </p>
        )}
      </div>
    </div>
  );
};

const MilestoneCard = ({ milestone }: { milestone: JourneyMilestone }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    year: milestone.year,
    title: milestone.title,
    description: milestone.description,
    image_url: milestone.image_url || "",
    sort_order: milestone.sort_order,
  });

  const saveMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("journey_milestones")
        .update(form)
        .eq("id", milestone.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã lưu");
      qc.invalidateQueries({ queryKey: ["journey_milestones"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("journey_milestones")
        .delete()
        .eq("id", milestone.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã xoá");
      qc.invalidateQueries({ queryKey: ["journey_milestones"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="bg-card rounded-xl shadow-card p-5 border border-border">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Năm / Mốc</label>
              <Input
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2025"
              />
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
            <label className="text-sm font-medium mb-1 block">Tiêu đề</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Nội dung</label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Ảnh minh hoạ</label>
          <ImageUpload
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            folder="journey"
          />
          <p className="text-[11px] text-muted-foreground mt-2">
            Ảnh sẽ hiển thị bo tròn ở giữa năm và tên mốc trong section Hành trình.
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => {
            if (confirm("Xoá mốc này?")) deleteMut.mutate();
          }}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Xoá
        </Button>
        <Button
          className="gradient-primary text-primary-foreground border-0"
          size="sm"
          onClick={() => saveMut.mutate()}
          disabled={saveMut.isPending}
        >
          <Save className="w-4 h-4 mr-1" />
          {saveMut.isPending ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  );
};

export default JourneyAdmin;