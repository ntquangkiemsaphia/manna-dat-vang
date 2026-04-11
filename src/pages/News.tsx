import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import SectionTitle from "@/components/SectionTitle";
import heroHome from "@/assets/hero-home.jpg";

const newsCategories = ["Tất cả", "Phát triển bền vững", "Tin tức thị trường", "Kiến thức chuyên ngành"];

const allNews = [
  { id: 1, title: "Phát triển nông nghiệp tuần hoàn bền vững tại Việt Nam", category: "Phát triển bền vững", date: "10/04/2026", excerpt: "Nông nghiệp tuần hoàn đang trở thành xu hướng tất yếu trong phát triển nông nghiệp bền vững tại Việt Nam..." },
  { id: 2, title: "Xu hướng sử dụng chế phẩm sinh học trong trồng trọt 2026", category: "Tin tức thị trường", date: "08/04/2026", excerpt: "Thị trường chế phẩm sinh học tăng trưởng mạnh mẽ, nông dân ngày càng nhận thức về tầm quan trọng..." },
  { id: 3, title: "Kỹ thuật xử lý đất bằng vi sinh vật có lợi", category: "Kiến thức chuyên ngành", date: "05/04/2026", excerpt: "Vi sinh vật đóng vai trò quan trọng trong việc cải tạo đất, phân hủy chất hữu cơ và cung cấp dinh dưỡng..." },
  { id: 4, title: "Giảm kháng sinh trong chăn nuôi nhờ thảo dược", category: "Kiến thức chuyên ngành", date: "01/04/2026", excerpt: "Sử dụng hợp chất kháng sinh thực vật từ thảo dược là giải pháp hiệu quả thay thế kháng sinh hóa học..." },
  { id: 5, title: "Manna Đất Vàng tham dự hội chợ nông nghiệp quốc tế", category: "Tin tức thị trường", date: "28/03/2026", excerpt: "Công ty đã giới thiệu các sản phẩm sinh học mới nhất tại hội chợ nông nghiệp quốc tế VietAgri 2026..." },
  { id: 6, title: "Mô hình nuôi tôm siêu thâm canh bền vững", category: "Phát triển bền vững", date: "25/03/2026", excerpt: "Ứng dụng chế phẩm sinh học trong xử lý nước ao nuôi giúp tăng năng suất tôm lên 30%..." },
];

const News = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const filtered = activeCategory === "Tất cả" ? allNews : allNews.filter((n) => n.category === activeCategory);

  return (
    <Layout>
      <HeroBanner image={heroHome} title="Tin tức & Sự kiện" subtitle="Cập nhật thông tin mới nhất về nông nghiệp sinh học" compact />
      <section className="py-20">
        <div className="container">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {newsCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((news) => (
              <article key={news.id} className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
                <div className="h-48 gradient-primary opacity-20" />
                <div className="p-6">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{news.category}</span>
                  <h3 className="mt-2 text-lg font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{news.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{news.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{news.date}</span>
                    <span className="text-primary text-sm font-medium">Đọc thêm →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default News;
