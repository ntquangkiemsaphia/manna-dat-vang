import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageSection } from "@/hooks/usePageSection";

interface HeroBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  compact?: boolean;
  /** When provided, will look up overrides in page_sections (section="hero") */
  page?: string;
}

const HeroBanner = ({ image, title, subtitle, ctaText, ctaLink, compact, page }: HeroBannerProps) => {
  const { data } = usePageSection(page || "", "hero");
  // Use first image from image_url (which may be newline/comma separated)
  const dbImage =
    data?.image_url
      ?.split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)[0] || "";
  const finalImage = dbImage || image;
  const finalTitle = data?.title?.trim() || title;
  const finalSubtitle = data?.subtitle?.trim() || subtitle;
  const finalCtaText = data?.cta_text?.trim() || ctaText;
  const finalCtaLink = data?.cta_link?.trim() || ctaLink;

  return (
  <section className={`relative ${compact ? "h-[300px] md:h-[400px]" : "h-[500px] md:h-[650px]"} overflow-hidden`}>
    <img src={finalImage} alt={finalTitle} className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 hero-overlay" />
    <div className="relative h-full container flex flex-col justify-center items-start text-primary-foreground">
      <h1 className={`font-serif font-bold max-w-2xl leading-tight animate-fade-up ${compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl lg:text-6xl"}`}>
        {finalTitle}
      </h1>
      {finalSubtitle && (
        <p className="mt-4 text-lg md:text-xl max-w-xl opacity-90 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          {finalSubtitle}
        </p>
      )}
      {finalCtaText && finalCtaLink && (
        <Button className="mt-8 gradient-gold text-foreground border-0 px-8 py-6 text-base font-semibold animate-fade-up shadow-lg" style={{ animationDelay: "0.3s" }} asChild>
          <Link to={finalCtaLink}>{finalCtaText}</Link>
        </Button>
      )}
    </div>
  </section>
  );
};

export default HeroBanner;
