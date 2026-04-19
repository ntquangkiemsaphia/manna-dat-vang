import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { stripHtml } from "@/lib/html";

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
                className={`group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-card flex flex-col ${
                  isOdd ? "md:mt-8" : ""
                }`}
              >
                {/* Square fixed image */}
                <div className="relative aspect-square w-full overflow-hidden bg-accent flex-shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-muted-foreground opacity-30" />
                    </div>
                  )}
                </div>

                {/* Info — fixed-height sections to keep cards uniform */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[3.75rem]">
                    {stripHtml(product.description)}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-auto self-start"
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
