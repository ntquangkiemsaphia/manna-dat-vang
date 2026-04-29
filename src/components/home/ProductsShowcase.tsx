import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionTitle from "@/components/SectionTitle";
import { getOptimizedImageUrl } from "@/lib/image";

const Icon = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
    <path d="M12 10v12" />
  </svg>
);

const ArrowRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const ProductsShowcase = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ["product-categories-home"],
    queryFn: async () => {
      const { data } = await supabase
        .from("product_categories")
        .select("*")
        .order("created_at");
      return (data as any[]) || [];
    },
  });

  if (categories.length === 0) return null;

  const count = categories.length;
  const gridCols =
    count >= 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : count === 3
      ? "md:grid-cols-3"
      : count === 2
      ? "md:grid-cols-2"
      : "md:grid-cols-1";

  return (
    <section className="py-20 gradient-earth">
      <div className="container">
        <SectionTitle
          label="Sản phẩm & Dịch vụ"
          title="Manna Đất Vàng — Giải pháp nông nghiệp sinh học"
          description="Ứng dụng khoa học vào chuỗi nông nghiệp tuần hoàn khép kín từ đất, cây trồng đến chăn nuôi và thủy sản."
        />
        <div className={`grid gap-6 ${gridCols}`}>
          {categories.map((cat: any) => {
            return (
              <Link
                key={cat.id}
                to={`/san-pham/${cat.slug}`}
                className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {cat.image_url ? (
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-muted">
                    <img
                      src={getOptimizedImageUrl(cat.image_url, { width: 640, quality: 72 })}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                )}
                <h3 className="text-lg font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                  {cat.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                  {cat.description}
                </p>
                <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                  Xem chi tiết <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsShowcase;
