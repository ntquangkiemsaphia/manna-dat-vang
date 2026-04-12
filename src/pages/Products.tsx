import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroProducts from "@/assets/hero-products.jpg";
import { Leaf, FlaskConical, Fish, ArrowRight, Phone } from "lucide-react";

const categoryMeta: Record<string, { name: string; icon: typeof Leaf; description: string }> = {
  "phan-bon": {
    name: "Phân bón sinh học",
    icon: Leaf,
    description: "Chế phẩm giải độc đất, phân bón sinh học từ thảo dược thiên nhiên giúp phục hồi đất trồng bị thoái hóa.",
  },
  "chan-nuoi": {
    name: "Chăn nuôi",
    icon: FlaskConical,
    description: "Thức ăn bổ sung và chế phẩm sinh học chứa hợp chất kháng sinh thực vật, hỗ trợ tiêu hóa và tăng sức đề kháng.",
  },
  "thuy-san": {
    name: "Thủy sản",
    icon: Fish,
    description: "Giải pháp sinh học xử lý nước ao, phân hủy chất hữu cơ, kiểm soát tảo độc.",
  },
};

const allCategories = Object.entries(categoryMeta).map(([slug, cat]) => ({ slug, ...cat }));

const ProductsOverview = () => (
  <Layout>
    <HeroBanner image={heroProducts} title="Sản phẩm & Dịch vụ" subtitle="Giải pháp sinh học toàn diện cho nông nghiệp tuần hoàn" compact />
    <section className="py-20">
      <div className="container">
        <SectionTitle label="Danh mục sản phẩm" title="Ba trụ cột nông nghiệp sinh học" description="Chuỗi sản phẩm khép kín từ đất → cây trồng → chăn nuôi – thủy sản → thực phẩm sạch." />
        <div className="grid md:grid-cols-3 gap-8">
          {allCategories.map((cat) => (
            <Link key={cat.slug} to={`/san-pham/${cat.slug}`} className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                <cat.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{cat.description}</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Xem sản phẩm <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

const ProductCategory = () => {
  const { category } = useParams<{ category: string }>();
  const meta = categoryMeta[category || ""];

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category", category as "phan-bon" | "chan-nuoi" | "thuy-san")
        .eq("is_active", true)
        .order("created_at");
      return data || [];
    },
    enabled: !!category,
  });

  if (!meta) return <Layout><div className="container py-40 text-center"><h2 className="text-2xl font-serif">Không tìm thấy danh mục</h2></div></Layout>;

  const Icon = meta.icon;

  return (
    <Layout>
      <HeroBanner image={heroProducts} title={meta.name} subtitle={meta.description} compact />
      <section className="py-20">
        <div className="container">
          <SectionTitle title={`Sản phẩm ${meta.name}`} description={meta.description} />
          {isLoading ? (
            <div className="text-center text-muted-foreground">Đang tải...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
                  <div className="h-48 gradient-primary flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Icon className="w-16 h-16 text-primary-foreground opacity-40" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-serif font-semibold text-foreground mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{product.description}</p>
                    <p className="text-xs text-accent-foreground bg-accent rounded-md px-3 py-1.5 inline-block mb-4">Cách dùng: {product.usage_info}</p>
                    <div className="flex gap-3">
                      <Button size="sm" className="gradient-primary text-primary-foreground border-0 flex-1" asChild>
                        <Link to={`/san-pham/chi-tiet/${product.id}`}>Chi tiết</Link>
                      </Button>
                      <Button size="sm" variant="outline" className="border-primary text-primary flex-1" asChild>
                        <Link to="/lien-he"><Phone className="w-3.5 h-3.5 mr-1" /> Liên hệ</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export { ProductsOverview, ProductCategory };
