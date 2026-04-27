import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import ImageUpload from "./ImageUpload";

type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  created_at: string;
};

export const useProductCategories = () =>
  useQuery<ProductCategory[]>({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("product_categories").select("*").order("created_at");
      return (data as ProductCategory[]) || [];
    },
  });

const ProductCategoriesAdmin = () => {
  const qc = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState("");

  const { data: categories = [] } = useProductCategories();

  const toSlug = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const addMut = useMutation({
    mutationFn: async () => {
      const slug = newSlug.trim() || toSlug(newName);
      const { error } = await supabase.from("product_categories").insert({ name: newName.trim(), slug, description: newDesc.trim(), image_url: newImage.trim() || null } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Đã thêm danh mục");
      setNewName(""); setNewSlug(""); setNewDesc(""); setNewImage("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_categories").update({ name: editName.trim(), slug: editSlug.trim(), description: editDesc.trim(), image_url: editImage.trim() || null } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Đã cập nhật");
      setEditId(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Đã xóa danh mục");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-card p-4 space-y-3">
        <h3 className="font-medium text-foreground">Thêm danh mục sản phẩm</h3>
        <div className="flex gap-3">
          <Input placeholder="Tên danh mục" value={newName} onChange={(e) => { setNewName(e.target.value); setNewSlug(toSlug(e.target.value)); }} className="flex-1" />
          <Input placeholder="Slug (URL)" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className="w-40" />
          <Button onClick={() => addMut.mutate()} disabled={!newName.trim() || addMut.isPending} className="gradient-primary text-primary-foreground border-0">
            <Plus className="w-4 h-4 mr-1" /> Thêm
          </Button>
        </div>
        <Textarea placeholder="Mô tả danh mục (tùy chọn)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2} />
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Ảnh đại diện danh mục (thay cho icon)</label>
          <ImageUpload value={newImage} onChange={setNewImage} folder="product-categories" />
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 font-medium w-20">Ảnh</th>
              <th className="text-left p-3 font-medium">Tên</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Slug</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Mô tả</th>
              <th className="text-right p-3 font-medium w-28">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 align-top">
                {editId === c.id ? (
                  <>
                    <td className="p-2" colSpan={4}>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Tên" />
                          <Input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} placeholder="Slug" />
                          <Textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Mô tả" rows={3} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Ảnh đại diện</label>
                          <ImageUpload value={editImage} onChange={setEditImage} folder="product-categories" />
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-right space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => updateMut.mutate(c.id)} disabled={!editName.trim()}><Check className="w-4 h-4 text-primary" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditId(null)}><X className="w-4 h-4" /></Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.name} className="w-14 h-14 rounded-lg object-cover border border-border" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                      )}
                    </td>
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{c.slug}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{c.description || "—"}</td>
                    <td className="p-3 text-right space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => { setEditId(c.id); setEditName(c.name); setEditSlug(c.slug); setEditDesc(c.description); setEditImage(c.image_url || ""); }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMut.mutate(c.id)}><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Chưa có danh mục nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductCategoriesAdmin;
