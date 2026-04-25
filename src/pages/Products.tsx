import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroProducts from "@/assets/hero-products.jpg";
import { Leaf, FlaskConical, Fish, ArrowRight, Phone, Package } from "lucide-react";
import { stripHtml } from "@/lib/html";

const iconMap: Record<string, typeof Leaf> = {
  "phan-bon": Leaf,
  "chan-nuoi": FlaskConical,
  "thuy-san": Fish,
};

const ProductsOverview = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("product_categories").select("*").order("created_at");
      return (data as any[]) || [];
    },
  });

  return (
    <Layout>
      <HeroBanner page="products" image={heroProducts} title="Sản phẩm & Dịch vụ" subtitle="Giải pháp sinh học toàn diện cho nông nghiệp tuần hoàn" compact />
      <section className="py-20">
        <div className="container">
          <SectionTitle label="Danh mục sản phẩm" title="Các trụ cột nông nghiệp sinh học" description="Chuỗi sản phẩm khép kín từ đất → cây trồng → chăn nuôi – thủy sản → thực phẩm sạch." />
          {isLoading ? (
            <div className="text-center text-muted-foreground">Đang tải...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {categories.map((cat: any) => {
                const Icon = iconMap[cat.slug] || Package;
                return (
                  <Link key={cat.slug} to={`/san-pham/${cat.slug}`} className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{cat.description}</p>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Xem sản phẩm <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

const ProductCategory = () => {
  const { category } = useParams<{ category: string }>();

  const { data: catInfo } = useQuery({
    queryKey: ["product-category-info", category],
    queryFn: async () => {
      const { data } = await supabase.from("product_categories").select("*").eq("slug", category!).single();
      return data as any;
    },
    enabled: !!category,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category", category!)
        .eq("is_active", true)
        .order("created_at");
      return data || [];
    },
    enabled: !!category,
  });

  if (!isLoading && !catInfo) return <Layout><div className="container py-40 text-center"><h2 className="text-2xl font-serif">Không tìm thấy danh mục</h2></div></Layout>;

  const Icon = iconMap[category || ""] || Package;

  return (
    <Layout>
      <HeroBanner page="products" image={heroProducts} title={catInfo?.name || "Sản phẩm"} subtitle={catInfo?.description || ""} compact />
      <section className="py-20">
        <div className="container">
          <SectionTitle title={`Sản phẩm ${catInfo?.name || ""}`} description={catInfo?.description || ""} />
          {isLoading ? (
            <div className="text-center text-muted-foreground">Đang tải...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const plainDesc = stripHtml(product.description);
                const plainUsage = stripHtml(product.usage_info);
                return (
                  <div key={product.id} className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col h-full">
                    {/* Square fixed image */}
                    <div className="relative aspect-square w-full bg-accent overflow-hidden flex-shrink-0">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="absolute inset-0 gradient-primary flex items-center justify-center">
                          <Icon className="w-16 h-16 text-primary-foreground opacity-40" />
                        </div>
                      )}
                    </div>
                    {/* Content area: fixed-height sections to keep cards uniform */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Title - fixed 2 lines */}
                      <h3 className="text-lg font-serif font-semibold text-foreground mb-2 line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>
                      {/* Description - fixed 3 lines */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3 min-h-[3.75rem]">
                        {plainDesc}
                      </p>
                      {/* Usage - fixed 2 lines reserved space */}
                      <div className="mb-4 min-h-[3rem]">
                        {plainUsage && (
                          <p className="text-xs text-accent-foreground bg-accent rounded-md px-3 py-1.5 line-clamp-2">
                            <span className="font-semibold">Cách dùng: </span>{plainUsage}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-3 mt-auto">
                        <Button size="sm" className="gradient-primary text-primary-foreground border-0 flex-1" asChild>
                          <Link to={`/san-pham/chi-tiet/${product.id}`}>Chi tiết</Link>
                        </Button>
                        <Button size="sm" variant="outline" className="border-primary text-primary flex-1" asChild>
                          <Link to="/lien-he"><Phone className="w-3.5 h-3.5 mr-1" /> Liên hệ</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export { ProductsOverview, ProductCategory };
