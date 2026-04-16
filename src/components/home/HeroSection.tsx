import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroHome from "@/assets/hero-home.jpg";
import logo from "@/assets/logo.png";

const HeroSection = () => (
  <section className="relative min-h-[600px] md:min-h-[700px] overflow-hidden">
    <img src={heroHome} alt="Manna Đất Vàng" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 hero-overlay" />
    <div className="relative h-full container flex flex-col justify-center items-center text-center text-primary-foreground py-24 md:py-32">
      <img src={logo} alt="Logo" className="w-20 h-20 mb-6 drop-shadow-lg" />
      <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-3 animate-fade-up">
        "Thương hiệu uy tín quốc gia" 2025
      </p>
      <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl max-w-3xl leading-tight animate-fade-up">
        Manna Đất Vàng
      </h1>
      <p className="mt-4 text-lg md:text-xl max-w-xl opacity-90 animate-fade-up" style={{ animationDelay: "0.15s" }}>
        Nông nghiệp sinh học — Vì một Việt Nam xanh và bền vững
      </p>
      <div className="flex gap-4 mt-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <Button className="gradient-gold text-foreground border-0 px-8 py-6 text-base font-semibold" asChild>
          <Link to="/san-pham">Xem sản phẩm</Link>
        </Button>
        <Button variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-base" asChild>
          <Link to="/gioi-thieu">Tìm hiểu thêm</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default HeroSection;
