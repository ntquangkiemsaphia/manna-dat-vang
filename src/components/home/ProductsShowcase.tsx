import { Link } from "react-router-dom";
import { ArrowRight, Leaf, FlaskConical, Fish, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionTitle from "@/components/SectionTitle";

const iconMap: Record<string, typeof Leaf> = {
  "phan-bon": Leaf,
  "chan-nuoi": FlaskConical,
  "thuy-san": Fish,
};

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
            const Icon = iconMap[cat.slug] || Package;
            return (
              <Link
                key={cat.id}
                to={`/san-pham/${cat.slug}`}
                className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {cat.image_url ? (
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-muted">
                    <img
                      src={cat.image_url}
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
