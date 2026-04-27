import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { usePageSection } from "@/hooks/usePageSection";
import { getOptimizedImageUrl } from "@/lib/image";

const HeroSection = () => {
  const { data, isLoading, isFetched } = usePageSection("home", "hero");
  const images = useMemo(() => {
    const raw = data?.image_url?.trim();
    if (!raw) return [] as string[];
    return raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [data?.image_url]);
  const waiting = isLoading && !isFetched;

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [images.length]);

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
            <img src={logo} alt="Manna Đất Vàng" className="h-16 w-auto max-w-[96px] object-contain mb-6 drop-shadow" />
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

          {/* Right: image slideshow */}
          <div className="relative order-first lg:order-last animate-fade-in">
            <div className="absolute inset-0 gradient-primary rounded-3xl rotate-3 opacity-20" />
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover aspect-[4/5] lg:aspect-[5/6] bg-muted">
              {waiting && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              {images.map((src, idx) => (
                <img
                  key={`${src}-${idx}`}
                  src={getOptimizedImageUrl(src, { width: 1280, quality: 78 })}
                  alt={`${title} ${idx + 1}`}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    idx === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActive(idx)}
                      aria-label={`Chuyển ảnh ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === active
                          ? "w-6 bg-primary-foreground"
                          : "w-1.5 bg-primary-foreground/60 hover:bg-primary-foreground/80"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
