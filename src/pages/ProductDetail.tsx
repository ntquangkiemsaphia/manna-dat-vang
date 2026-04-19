import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroProducts from "@/assets/hero-products.jpg";
import { Leaf, FlaskConical, Fish, Phone, ArrowLeft } from "lucide-react";

const categoryIcons: Record<string, typeof Leaf> = {
  "phan-bon": Leaf,
  "chan-nuoi": FlaskConical,
  "thuy-san": Fish,
};

const categoryNames: Record<string, string> = {
  "phan-bon": "Phân bón sinh học",
  "chan-nuoi": "Chăn nuôi",
  "thuy-san": "Thủy sản",
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-40 text-center">
          <div className="animate-pulse text-muted-foreground">Đang tải...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-40 text-center">
          <h2 className="text-2xl font-serif">Không tìm thấy sản phẩm</h2>
          <Button className="mt-4" asChild>
            <Link to="/san-pham">← Quay lại</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const Icon = categoryIcons[product.category] || Leaf;
  const catName = categoryNames[product.category] || product.category;

  return (
    <Layout>
      <HeroBanner image={heroProducts} title={product.name} subtitle={catName} compact />
      <section className="py-20">
        <div className="container max-w-4xl">
          <Link to={`/san-pham/${product.category}`} className="inline-flex items-center gap-1 text-primary text-sm font-medium mb-8 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Quay lại {catName}
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-accent rounded-2xl h-80 flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Icon className="w-24 h-24 text-primary opacity-30" />
              )}
            </div>

            <div>
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{catName}</span>
              <h1 className="mt-2 text-3xl font-serif font-bold text-foreground">{product.name}</h1>
              <div
                className="mt-4 prose prose-sm max-w-none text-muted-foreground leading-relaxed prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: product.description || "" }}
              />

              {product.usage_info && (
                <div className="mt-6 bg-accent rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Cách sử dụng</h3>
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary"
                    dangerouslySetInnerHTML={{ __html: product.usage_info }}
                  />
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <Button className="gradient-primary text-primary-foreground border-0" asChild>
                  <Link to="/lien-he"><Phone className="w-4 h-4 mr-1" /> Liên hệ tư vấn</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
