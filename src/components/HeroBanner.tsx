import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  compact?: boolean;
}

const HeroBanner = ({ image, title, subtitle, ctaText, ctaLink, compact }: HeroBannerProps) => (
  <section className={`relative ${compact ? "h-[300px] md:h-[400px]" : "h-[500px] md:h-[650px]"} overflow-hidden`}>
    <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 hero-overlay" />
    <div className="relative h-full container flex flex-col justify-center items-start text-primary-foreground">
      <h1 className={`font-serif font-bold max-w-2xl leading-tight animate-fade-up ${compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl lg:text-6xl"}`}>
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg md:text-xl max-w-xl opacity-90 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          {subtitle}
        </p>
      )}
      {ctaText && ctaLink && (
        <Button className="mt-8 gradient-gold text-foreground border-0 px-8 py-6 text-base font-semibold animate-fade-up" style={{ animationDelay: "0.3s" }} asChild>
          <Link to={ctaLink}>{ctaText}</Link>
        </Button>
      )}
    </div>
  </section>
);

export default HeroBanner;
