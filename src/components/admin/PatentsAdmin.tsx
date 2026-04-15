import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

export const usePatents = () =>
  useQuery({
    queryKey: ["patents"],
    queryFn: async () => {
      const { data } = await supabase.from("patents").select("*").order("sort_order");
      return data || [];
    },
  });

const PatentsAdmin = () => {
  const qc = useQueryClient();
  const { data: patents = [] } = usePatents();
  const [editItem, setEditItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("patents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["patents"] }); toast.success("Đã xóa"); },
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditItem(null); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-1" /> Thêm sáng chế</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editItem ? "Sửa sáng chế" : "Thêm sáng chế mới"}</DialogTitle></DialogHeader>
            <PatentForm item={editItem} onDone={() => { setDialogOpen(false); setEditItem(null); qc.invalidateQueries({ queryKey: ["patents"] }); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-medium">Ảnh</th>
            <th className="text-left p-3 font-medium">Tiêu đề</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Thứ tự</th>
            <th className="text-right p-3 font-medium">Thao tác</th>
          </tr></thead>
          <tbody>
            {patents.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3">{p.image_url && <img src={p.image_url} alt={p.title} className="w-12 h-12 object-cover rounded" />}</td>
                <td className="p-3 font-medium">{p.title}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{p.sort_order}</td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditItem(p); setDialogOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMut.mutate(p.id)}><Trash2 className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PatentForm = ({ item, onDone }: { item: any; onDone: () => void }) => {
  const [form, setForm] = useState({
    title: item?.title || "",
    description: item?.description || "",
    image_url: item?.image_url || "",
    sort_order: item?.sort_order ?? 0,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (item) {
        const { error } = await supabase.from("patents").update(form).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("patents").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success(item ? "Đã cập nhật" : "Đã thêm"); onDone(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Tiêu đề *</label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Mô tả</label>
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Ảnh</label>
        <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="patents" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Thứ tự hiển thị</label>
        <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
      </div>
      <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0" disabled={mutation.isPending}>
        {mutation.isPending ? "Đang lưu..." : item ? "Cập nhật" : "Thêm mới"}
      </Button>
    </form>
  );
};

export default PatentsAdmin;
