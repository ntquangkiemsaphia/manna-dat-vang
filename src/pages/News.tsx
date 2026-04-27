import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import { supabase } from "@/integrations/supabase/client";
import heroHome from "@/assets/hero-home.jpg";
import { stripHtml } from "@/lib/html";
import { useNewsCategories } from "@/hooks/useNewsCategories";
import { getOptimizedImageUrl } from "@/lib/image";

const News = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const { data: dbCategories = [] } = useNewsCategories();
  const newsCategories = ["Tất cả", ...dbCategories.map((c) => c.name)];

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const { data: allNews = [], isLoading } = useQuery({
    queryKey: ["news-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("news_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const filtered = activeCategory === "Tất cả" ? allNews : allNews.filter((n) => n.category === activeCategory);

  return (
    <Layout>
      <HeroBanner page="news" image={heroHome} title="Tin tức & Sự kiện" subtitle="Cập nhật thông tin mới nhất về nông nghiệp sinh học" compact />
      <section className="py-20">
        <div className="container">
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {newsCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                  ? "gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground">Đang tải...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((news) => (
                <Link key={news.id} to={`/tin-tuc/${news.id}`} className="block">
                  <article className="relative bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 group aspect-square">

                    {/* Ảnh full card */}
                    <img
                      src={getOptimizedImageUrl(news.image_url, { width: 800, quality: 75 })}
                      alt={news.title}
                      className="absolute inset-0 w-full h-1/2 object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="h-1/2 gradient-primary opacity-20" />
                    <div className="p-6">
                      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{news.category}</span>
                      <h3 className="mt-2 text-lg font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{news.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{stripHtml(news.excerpt)}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{new Date(news.created_at).toLocaleDateString("vi-VN")}</span>
                        <span className="text-primary text-sm font-medium">Đọc thêm →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default News;
