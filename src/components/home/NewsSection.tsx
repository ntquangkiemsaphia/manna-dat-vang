import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionTitle from "@/components/SectionTitle";

const NewsSection = () => {
  const { data: news = [] } = useQuery({
    queryKey: ["latest-news"],
    queryFn: async () => {
      const { data } = await supabase
        .from("news_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(6);
      return data || [];
    },
  });

  const placeholderNews = [
    { id: "1", title: "Phát triển nông nghiệp tuần hoàn bền vững tại Việt Nam", category: "Phát triển bền vững", created_at: "2026-04-10", image_url: null },
    { id: "2", title: "Xu hướng sử dụng chế phẩm sinh học trong trồng trọt 2026", category: "Tin tức thị trường", created_at: "2026-04-08", image_url: null },
    { id: "3", title: "Kỹ thuật xử lý đất bằng vi sinh vật có lợi", category: "Kiến thức chuyên ngành", created_at: "2026-04-05", image_url: null },
    { id: "4", title: "Thương hiệu Manna Đất Vàng được vinh danh", category: "Giải thưởng", created_at: "2026-04-03", image_url: null },
    { id: "5", title: "Ứng dụng thảo dược trong chăn nuôi sạch", category: "Nghiên cứu", created_at: "2026-04-01", image_url: null },
    { id: "6", title: "Hội thảo nông nghiệp sinh học miền Bắc 2026", category: "Sự kiện", created_at: "2026-03-28", image_url: null },
  ];

  const items = news.length > 0 ? news : placeholderNews;

  return (
    <section className="py-20">
      <div className="container">
        <SectionTitle label="Tin tức & Sự kiện" title="Vì một thế giới tốt đẹp hơn" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.slice(0, 6).map((item: any) => (
            <Link
              key={item.id}
              to={`/tin-tuc/${item.id}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-muted"
            >
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              ) : (
                <div className="absolute inset-0 gradient-primary opacity-80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{item.category}</span>
                <h3 className="mt-1 text-sm md:text-base font-serif font-semibold text-white line-clamp-2 group-hover:text-secondary transition-colors">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
