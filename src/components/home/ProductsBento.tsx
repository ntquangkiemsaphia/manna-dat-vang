import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const ProductsBento = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at")
        .limit(4);
      return data || [];
    },
  });

  if (isLoading || products.length === 0) return null;

  // Bento grid layout: 2 columns with alternating large/small cards
  const gridItems = products.slice(0, 4);

  return (
    <section className="py-20 bg-gradient-to-b from-[hsl(220,30%,96%)] to-[hsl(224,25%,93%)]">
      <div className="container">
        <SectionTitle
          label="Sản phẩm nổi bật"
          title="Manna Đất Vàng — Sản phẩm chất lượng"
          description="Các sản phẩm sinh học hàng đầu phục vụ nông nghiệp bền vững."
        />

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {gridItems.map((product, i) => {
            // Alternate: odd index cards shift right with mt offset for mosaic feel
            const isOdd = i % 2 === 1;
            return (
              <div
                key={product.id}
                className={`group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-card ${
                  isOdd ? "md:mt-8" : ""
                }`}
              >
                {/* Product image */}
                <div className="relative h-56 md:h-64 overflow-hidden bg-accent">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-muted-foreground opacity-30" />
                    </div>
                  )}
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-serif font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {product.description?.replace(/<[^>]*>/g, "").slice(0, 100)}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    asChild
                  >
                    <Link to={`/san-pham/chi-tiet/${product.id}`}>Xem thêm</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsBento;
