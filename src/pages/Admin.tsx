import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { Navigate } from "react-router-dom";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import CategoriesAdmin from "@/components/admin/CategoriesAdmin";
import ProductCategoriesAdmin, { useProductCategories } from "@/components/admin/ProductCategoriesAdmin";
import PatentsAdmin from "@/components/admin/PatentsAdmin";
import PartnersAdmin from "@/components/admin/PartnersAdmin";
import { useNewsCategories } from "@/hooks/useNewsCategories";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Product = Tables<"products">;
type NewsPost = Tables<"news_posts">;

const AdminPage = () => {
  const { isAdmin, loading, signOut, user } = useAuth();

  if (loading) return <Layout><div className="container py-40 text-center text-muted-foreground">Đang tải...</div></Layout>;
  if (!user || !isAdmin) return <Navigate to="/dang-nhap" replace />;

  return (
    <Layout>
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground">Quản trị nội dung</h1>
            <Button variant="outline" onClick={signOut}><LogOut className="w-4 h-4 mr-1" /> Đăng xuất</Button>
          </div>

          <Tabs defaultValue="products">
            <TabsList className="mb-6 flex-wrap h-auto">
              <TabsTrigger value="products">Sản phẩm</TabsTrigger>
              <TabsTrigger value="product-categories">DM Sản phẩm</TabsTrigger>
              <TabsTrigger value="news">Bài viết</TabsTrigger>
              <TabsTrigger value="categories">DM Bài viết</TabsTrigger>
              <TabsTrigger value="patents">Sáng chế</TabsTrigger>
              <TabsTrigger value="partners">Đối tác</TabsTrigger>
            </TabsList>
            <TabsContent value="products"><ProductsAdmin /></TabsContent>
            <TabsContent value="product-categories"><ProductCategoriesAdmin /></TabsContent>
            <TabsContent value="news"><NewsAdmin /></TabsContent>
            <TabsContent value="categories"><CategoriesAdmin /></TabsContent>
            <TabsContent value="patents"><PatentsAdmin /></TabsContent>
            <TabsContent value="partners"><PartnersAdmin /></TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

// ==================== Products Admin ====================
const ProductsAdmin = () => {
  const qc = useQueryClient();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: productCategories = [] } = useProductCategories();

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("Đã xóa sản phẩm"); },
  });

  const getCategoryName = (slug: string) => {
    const cat = productCategories.find(c => c.slug === slug);
    return cat?.name || slug;
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditProduct(null); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-1" /> Thêm sản phẩm</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle></DialogHeader>
            <ProductForm product={editProduct} onDone={() => { setDialogOpen(false); setEditProduct(null); qc.invalidateQueries({ queryKey: ["admin-products"] }); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-medium">Tên</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Danh mục</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Trạng thái</th>
            <th className="text-right p-3 font-medium">Thao tác</th>
          </tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{getCategoryName(p.category)}</td>
                <td className="p-3 hidden md:table-cell">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {p.is_active ? "Hoạt động" : "Ẩn"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditProduct(p); setDialogOpen(true); }}><Pencil className="w-4 h-4" /></Button>
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

const ProductForm = ({ product, onDone }: { product: Product | null; onDone: () => void }) => {
  const { data: productCategories = [] } = useProductCategories();
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    usage_info: product?.usage_info || "",
    category: product?.category || "",
    is_active: product?.is_active ?? true,
    image_url: product?.image_url || "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (product) {
        const { error } = await supabase.from("products").update(form as any).eq("id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(form as any);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success(product ? "Đã cập nhật" : "Đã thêm sản phẩm"); onDone(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Tên sản phẩm *</label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Danh mục</label>
        <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
          <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
          <SelectContent>
            {productCategories.map((c) => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Mô tả</label>
        <RichTextEditor value={form.description} onChange={(html) => setForm({ ...form, description: html })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Cách sử dụng</label>
        <RichTextEditor value={form.usage_info} onChange={(html) => setForm({ ...form, usage_info: html })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Ảnh sản phẩm</label>
        <ImageUpload value={form.image_url || ""} onChange={(url) => setForm({ ...form, image_url: url })} folder="products" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} id="active" />
        <label htmlFor="active" className="text-sm">Hiển thị sản phẩm</label>
      </div>
      <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0" disabled={mutation.isPending}>
        {mutation.isPending ? "Đang lưu..." : product ? "Cập nhật" : "Thêm mới"}
      </Button>
    </form>
  );
};

// ==================== News Admin ====================
const NewsAdmin = () => {
  const qc = useQueryClient();
  const [editPost, setEditPost] = useState<NewsPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: posts = [] } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const { data } = await supabase.from("news_posts").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-news"] }); toast.success("Đã xóa bài viết"); },
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditPost(null); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-1" /> Thêm bài viết</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editPost ? "Sửa bài viết" : "Thêm bài viết mới"}</DialogTitle></DialogHeader>
            <NewsForm post={editPost} onDone={() => { setDialogOpen(false); setEditPost(null); qc.invalidateQueries({ queryKey: ["admin-news"] }); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-medium">Tiêu đề</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Danh mục</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Trạng thái</th>
            <th className="text-right p-3 font-medium">Thao tác</th>
          </tr></thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium line-clamp-1">{p.title}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{p.category}</td>
                <td className="p-3 hidden md:table-cell">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.is_published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {p.is_published ? "Đã xuất bản" : "Nháp"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditPost(p); setDialogOpen(true); }}><Pencil className="w-4 h-4" /></Button>
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

const NewsForm = ({ post, onDone }: { post: NewsPost | null; onDone: () => void }) => {
  const { user } = useAuth();
  const { data: categories = [] } = useNewsCategories();
  const [form, setForm] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || "",
    is_published: post?.is_published ?? false,
    image_url: post?.image_url || "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (post) {
        const { error } = await supabase.from("news_posts").update(form).eq("id", post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("news_posts").insert({ ...form, author_id: user?.id } as TablesInsert<"news_posts">);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success(post ? "Đã cập nhật" : "Đã thêm bài viết"); onDone(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Tiêu đề *</label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Danh mục</label>
        <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
          <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Tóm tắt</label>
        <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Nội dung</label>
        <RichTextEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Ảnh đại diện</label>
        <ImageUpload value={form.image_url || ""} onChange={(url) => setForm({ ...form, image_url: url })} folder="news" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} id="published" />
        <label htmlFor="published" className="text-sm">Xuất bản ngay</label>
      </div>
      <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0" disabled={mutation.isPending}>
        {mutation.isPending ? "Đang lưu..." : post ? "Cập nhật" : "Thêm mới"}
      </Button>
    </form>
  );
};

export default AdminPage;
