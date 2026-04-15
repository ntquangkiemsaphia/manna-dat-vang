import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import SectionTitle from "@/components/SectionTitle";
import heroHome from "@/assets/hero-home.jpg";
import aboutStory from "@/assets/about-story.jpg";
import { Leaf, FlaskConical, Fish, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const productCategories = [
  { icon: Leaf, title: "Phân bón sinh học", desc: "Chế phẩm giải độc đất, phân bón sinh học từ thảo dược thiên nhiên giúp cây trồng phát triển bền vững.", link: "/san-pham/phan-bon" },
  { icon: FlaskConical, title: "Chăn nuôi", desc: "Thức ăn bổ sung và chế phẩm sinh học giúp tăng sức đề kháng, giảm kháng sinh trong chăn nuôi.", link: "/san-pham/chan-nuoi" },
  { icon: Fish, title: "Thủy sản", desc: "Giải pháp sinh học xử lý nước ao, cải thiện môi trường sống cho tôm cá hiệu quả.", link: "/san-pham/thuy-san" },
];

const stats = [
  { value: "30+", label: "Năm kinh nghiệm" },
  { value: "50+", label: "Sản phẩm sinh học" },
  { value: "10K+", label: "Nông dân tin dùng" },
  { value: "20+", label: "Tỉnh thành phủ sóng" },
];

const newsItems = [
  { title: "Phát triển nông nghiệp tuần hoàn bền vững tại Việt Nam", category: "Phát triển bền vững", date: "10/04/2026" },
  { title: "Xu hướng sử dụng chế phẩm sinh học trong trồng trọt 2026", category: "Tin tức thị trường", date: "08/04/2026" },
  { title: "Kỹ thuật xử lý đất bằng vi sinh vật có lợi", category: "Kiến thức chuyên ngành", date: "05/04/2026" },
];

const PatentsSection = () => {
  const { data: patents = [] } = useQuery({
    queryKey: ["patents"],
    queryFn: async () => {
      const { data } = await supabase.from("patents").select("*").order("sort_order");
      return data || [];
    },
  });
  const [selected, setSelected] = useState(0);

  if (patents.length === 0) return null;

  return (
    <section className="py-20 gradient-earth">
      <div className="container">
        <SectionTitle label="Uy tín & Chất lượng" title="Sở hữu độc quyền sáng chế" />
        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {patents.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setSelected(i)}
              className={`rounded-xl overflow-hidden border-2 transition-all ${selected === i ? "border-primary shadow-lg scale-[1.02]" : "border-transparent hover:border-primary/30"}`}
            >
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-40 bg-muted flex items-center justify-center text-muted-foreground text-sm">{p.title}</div>
              )}
            </button>
          ))}
        </div>
        {/* Selected detail */}
        <div className="bg-card rounded-2xl p-6 shadow-card text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{patents[selected]?.title}</h3>
          {patents[selected]?.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{patents[selected].description}</p>
          )}
        </div>
      </div>
    </section>
  );
};

const PartnersSection = () => {
  const { data: partners = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data } = await supabase.from("partners").select("*").order("sort_order");
      return data || [];
    },
  });

  if (partners.length === 0) return null;

  // Double the array for seamless loop
  const doubled = [...partners, ...partners];

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mb-8">
        <SectionTitle label="Hệ sinh thái" title="Đối tác của chúng tôi" />
      </div>
      <div className="relative">
        <div className="flex animate-marquee gap-12 items-center" style={{ width: `${doubled.length * 200}px` }}>
          {doubled.map((p, i) => (
            <div key={`${p.id}-${i}`} className="flex flex-col items-center min-w-[160px]">
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.name} className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" loading="lazy" />
              ) : (
                <div className="h-16 w-32 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">{p.name}</div>
              )}
              <p className="mt-2 text-xs text-muted-foreground text-center">{p.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => (
  <Layout>
    <HeroBanner
      image={heroHome}
      title="Nông nghiệp sinh học — Vì một Việt Nam xanh và bền vững"
      subtitle="Giải pháp thiên nhiên từ thảo dược Việt Nam cho nông nghiệp sạch, an toàn và hiệu quả cao."
      ctaText="Sản phẩm & Dịch vụ"
      ctaLink="/san-pham"
    />

    {/* About Section */}
    <section className="py-20 gradient-earth">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle label="Về chúng tôi" title="Manna Đất Vàng" center={false} />
            <p className="text-muted-foreground leading-relaxed mb-4">
              Xuất phát từ niềm đam mê sâu sắc với cây thảo dược Việt Nam, Công ty Cổ phần Manna Đất Vàng được thành lập với sứ mệnh mang đến giải pháp nông nghiệp sinh học toàn diện.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Chúng tôi tập trung nghiên cứu, phát triển và sản xuất các chế phẩm sinh học từ thảo dược thiên nhiên, ứng dụng trong nông nghiệp sạch và chăn nuôi bền vững.
            </p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
              <Link to="/gioi-thieu">Tìm hiểu thêm <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card">
            <img src={aboutStory} alt="Manna Đất Vàng" className="w-full h-[400px] object-cover" loading="lazy" width={800} height={600} />
          </div>
        </div>
      </div>
    </section>

    {/* Products */}
    <section className="py-20">
      <div className="container">
        <SectionTitle label="Sản phẩm & Dịch vụ" title="Giải pháp nông nghiệp sinh học toàn diện" description="Ứng dụng khoa học vào chuỗi nông nghiệp tuần hoàn khép kín từ đất, cây trồng đến chăn nuôi và thủy sản." />
        <div className="grid md:grid-cols-3 gap-8">
          {productCategories.map((cat) => (
            <Link key={cat.title} to={cat.link} className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                <cat.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{cat.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{cat.desc}</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Xem chi tiết <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 gradient-primary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center text-primary-foreground">
              <p className="text-4xl md:text-5xl font-serif font-bold">{s.value}</p>
              <p className="mt-2 text-sm opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* News */}
    <section className="py-20">
      <div className="container">
        <SectionTitle label="Tin tức & Sự kiện" title="Cập nhật mới nhất" />
        <div className="grid md:grid-cols-3 gap-8">
          {newsItems.map((news, i) => (
            <Link key={i} to="/tin-tuc" className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
              <div className="h-48 gradient-primary opacity-20" />
              <div className="p-6">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{news.category}</span>
                <h3 className="mt-2 text-lg font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{news.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{news.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Patents */}
    <PatentsSection />

    {/* Partners */}
    <PartnersSection />
  </Layout>
);

export default Index;
