import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionTitle from "@/components/SectionTitle";
import { getOptimizedImageUrl } from "@/lib/image";

const PackageIcon = forwardRef<SVGSVGElement, { className?: string }>(({ className = "w-16 h-16" }, ref) => (
  <svg ref={ref} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m21 8-9-5-9 5 9 5 9-5z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
));
PackageIcon.displayName = "PackageIcon";

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

  const gridItems = products.slice(0, 4);

  return (
    <section className="py-20 bg-gradient-to-b from-[hsl(220,30%,96%)] to-[hsl(224,25%,93%)]">
      <div className="container">
        <SectionTitle
          label="Sản phẩm nổi bật"
          title="Manna Đất Vàng — Sản phẩm chất lượng"
          description="Các sản phẩm sinh học hàng đầu phục vụ nông nghiệp bền vững."
        />

        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {gridItems.map((product) => {
            return (
              <Link
                to={`/san-pham/chi-tiet/${product.id}`}
                key={product.id}
                aria-label={product.name}
                className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-card block"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-accent">
                  {product.image_url ? (
                    <img
                      src={getOptimizedImageUrl(product.image_url, { width: 700, quality: 72 })}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PackageIcon className="w-16 h-16 text-muted-foreground opacity-30" />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsBento;
