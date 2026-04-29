import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionTitle from "@/components/SectionTitle";
import { stripHtml } from "@/lib/html";
import { getOptimizedImageUrl } from "@/lib/image";

const CalendarIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
  </svg>
);

const NewsSection = () => {
  const { data: news = [] } = useQuery({
    queryKey: ["latest-news"],
    queryFn: async () => {
      const { data } = await supabase
        .from("news_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const placeholderNews = [
    { id: "1", title: "Phát triển nông nghiệp tuần hoàn bền vững tại Việt Nam", excerpt: "Mô hình nông nghiệp tuần hoàn đang được áp dụng rộng rãi để bảo vệ môi trường và nâng cao năng suất.", category: "Phát triển bền vững", created_at: "2026-04-10", image_url: null },
    { id: "2", title: "Xu hướng sử dụng chế phẩm sinh học trong trồng trọt 2026", excerpt: "Chế phẩm sinh học giúp giảm thiểu hóa chất độc hại trong sản xuất nông nghiệp.", category: "Tin tức thị trường", created_at: "2026-04-08", image_url: null },
    { id: "3", title: "Kỹ thuật xử lý đất bằng vi sinh vật có lợi", excerpt: "Các vi sinh vật có lợi giúp cải tạo đất và tăng độ màu mỡ tự nhiên.", category: "Kiến thức chuyên ngành", created_at: "2026-04-05", image_url: null },
    { id: "4", title: "Thương hiệu Manna Đất Vàng được vinh danh", excerpt: "Manna Đất Vàng tiếp tục khẳng định vị thế trên thị trường nông nghiệp sinh học.", category: "Giải thưởng", created_at: "2026-04-03", image_url: null },
    { id: "5", title: "Ứng dụng thảo dược trong chăn nuôi sạch", excerpt: "Thảo dược tự nhiên giúp vật nuôi khỏe mạnh và sản phẩm an toàn cho người tiêu dùng.", category: "Nghiên cứu", created_at: "2026-04-01", image_url: null },
  ];

  const items: any[] = news.length > 0 ? news : placeholderNews;
  const [featured, ...rest] = items;
  const sideItems = rest.slice(0, 4);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <SectionTitle label="Tin tức & Sự kiện" title="Vì một thế giới tốt đẹp hơn" />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured large card */}
          {featured && (
            <Link
              to={`/tin-tuc/${featured.id}`}
              className="group relative rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 block"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {featured.image_url ? (
                  <img src={getOptimizedImageUrl(featured.image_url, { width: 900, quality: 72 })} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 gradient-primary opacity-80" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                  {featured.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <CalendarIcon className="w-3 h-3" /> {fmtDate(featured.created_at)}
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{stripHtml(featured.excerpt)}</p>
                )}
              </div>
            </Link>
          )}

          {/* Side list */}
          <div className="flex flex-col gap-4">
            {sideItems.map((item) => (
              <Link
                key={item.id}
                to={`/tin-tuc/${item.id}`}
                className="group flex gap-4 bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="relative w-32 sm:w-40 aspect-square flex-shrink-0 bg-muted overflow-hidden">
                  {item.image_url ? (
                    <img src={getOptimizedImageUrl(item.image_url, { width: 360, quality: 70 })} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 gradient-primary opacity-70" />
                  )}
                </div>
                <div className="flex-1 py-3 pr-4 flex flex-col justify-center min-w-0">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{item.category}</span>
                  <h4 className="mt-1 text-sm sm:text-base font-serif font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon className="w-3 h-3" /> {fmtDate(item.created_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
