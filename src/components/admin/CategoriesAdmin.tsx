import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type Category = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

const CategoriesAdmin = () => {
  const qc = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["news-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("news_categories").select("*").order("created_at");
      return (data as Category[]) || [];
    },
  });

  const addMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("news_categories").insert({ name: newName.trim(), description: newDesc.trim() } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news-categories"] });
      toast.success("Đã thêm danh mục");
      setNewName("");
      setNewDesc("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news_categories").update({ name: editName.trim(), description: editDesc.trim() } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news-categories"] });
      toast.success("Đã cập nhật");
      setEditId(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news-categories"] });
      toast.success("Đã xóa danh mục");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      {/* Add new */}
      <div className="bg-card rounded-xl shadow-card p-4 space-y-3">
        <h3 className="font-medium text-foreground">Thêm danh mục mới</h3>
        <div className="flex gap-3">
          <Input placeholder="Tên danh mục" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1" />
          <Button onClick={() => addMut.mutate()} disabled={!newName.trim() || addMut.isPending} className="gradient-primary text-primary-foreground border-0">
            <Plus className="w-4 h-4 mr-1" /> Thêm
          </Button>
        </div>
        <Textarea placeholder="Mô tả danh mục (tùy chọn)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2} />
      </div>

      {/* List */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 font-medium">Tên danh mục</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Mô tả</th>
              <th className="text-right p-3 font-medium w-28">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                {editId === c.id ? (
                  <>
                    <td className="p-2">
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" />
                    </td>
                    <td className="p-2 hidden md:table-cell">
                      <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="h-8" />
                    </td>
                    <td className="p-2 text-right space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => updateMut.mutate(c.id)} disabled={!editName.trim()}>
                        <Check className="w-4 h-4 text-primary" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{c.description || "—"}</td>
                    <td className="p-3 text-right space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => { setEditId(c.id); setEditName(c.name); setEditDesc(c.description); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMut.mutate(c.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">Chưa có danh mục nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesAdmin;
