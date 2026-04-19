import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroHome from "@/assets/hero-home.jpg";
import logo from "@/assets/logo.png";
import { usePageSection } from "@/hooks/usePageSection";

const HeroSection = () => {
  const { data } = usePageSection("home", "hero");
  const image = data?.image_url || heroHome;
  const title = data?.title || "Manna Đất Vàng";
  const subtitle = data?.subtitle || "Nông nghiệp sinh học — Vì một Việt Nam xanh và bền vững";
  const description = data?.description || '"Thương hiệu uy tín quốc gia" 2025';
  const ctaText = data?.cta_text || "Xem sản phẩm";
  const ctaLink = data?.cta_link || "/san-pham";

  return (
    <section className="relative bg-gradient-to-br from-background via-accent to-background overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="relative container py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div className="text-left">
            <img src={logo} alt="Manna Đất Vàng" className="w-16 h-16 mb-6 drop-shadow" />
            <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-3 animate-fade-up">
              {description}
            </p>
            <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight animate-fade-up">
              {title}
            </h1>
            <p
              className="mt-5 text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              {subtitle}
            </p>
            <div
              className="flex flex-wrap gap-4 mt-8 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Button
                className="gradient-primary text-primary-foreground border-0 px-8 py-6 text-base font-semibold"
                asChild
              >
                <Link to={ctaLink}>{ctaText}</Link>
              </Button>
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-base"
                asChild
              >
                <Link to="/gioi-thieu">Tìm hiểu thêm</Link>
              </Button>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative order-first lg:order-last animate-fade-in">
            <div className="absolute inset-0 gradient-primary rounded-3xl rotate-3 opacity-20" />
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover aspect-[4/5] lg:aspect-[5/6]">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
