import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import logo from "@/assets/logo.png";

const Icon = ({ path, className = "w-4 h-4" }: { path: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={path} />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => <Icon className={className} path="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L9 10.64a16 16 0 0 0 4.36 4.36l1.2-1.2a2 2 0 0 1 2.11-.45c.84.27 1.72.47 2.61.59A2 2 0 0 1 22 16.92z" />;
const MenuIcon = ({ className }: { className?: string }) => <Icon className={className} path="M4 6h16M4 12h16M4 18h16" />;
const XIcon = ({ className }: { className?: string }) => <Icon className={className} path="M18 6 6 18M6 6l12 12" />;
const SearchIcon = ({ className }: { className?: string }) => <Icon className={className} path="m21 21-4.34-4.34M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />;

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();

  const { data: productCats = [] } = useQuery({
    queryKey: ["product-categories", "header"],
    queryFn: async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("product_categories")
        .select("name, slug")
        .order("created_at");
      return (data as { name: string; slug: string }[]) || [];
    },
    enabled: mobileOpen || hoveredItem === "Sản phẩm",
    staleTime: 5 * 60_000,
  });

  const { data: newsCats = [] } = useQuery({
    queryKey: ["news-categories", "header"],
    queryFn: async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("news_categories")
        .select("name")
        .order("created_at");
      return (data as { name: string }[]) || [];
    },
    enabled: mobileOpen || hoveredItem === "Tin tức",
    staleTime: 5 * 60_000,
  });

  const navItems = [
    { label: "Trang chủ", path: "/" },
    {
      label: "Giới thiệu", path: "/gioi-thieu",
      children: [
        { label: "Về chúng tôi", path: "/gioi-thieu" },
        { label: "Catalog", path: "/catalog" },
      ],
    },
    {
      label: "Sản phẩm", path: "/san-pham",
      children: productCats.map((c) => ({ label: c.name, path: `/san-pham/${c.slug}` })),
    },
    {
      label: "Tin tức", path: "/tin-tuc",
      children: newsCats.map((c) => ({ label: c.name, path: `/tin-tuc?cat=${encodeURIComponent(c.name)}` })),
    },
    { label: "Liên hệ", path: "/lien-he" },
  ];

  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path + "/"));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="section-navy">
        <div className="container flex items-center justify-between py-1.5 text-sm text-white">
          <div className="flex items-center gap-4">
            <a href="tel:0395830009" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <PhoneIcon className="w-3.5 h-3.5" /> 0395 830 009
            </a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="opacity-80">VN</span>
            <span className="opacity-50">|</span>
            <span className="opacity-60">EN</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Manna Đất Vàng" className="h-12 w-auto max-w-[64px] object-contain" />
          <div className="hidden sm:block">
            <p className="font-serif text-lg font-bold text-primary leading-tight">MANNA ĐẤT VÀNG</p>
            <p className="text-xs text-muted-foreground">Nông nghiệp sinh học bền vững</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.path}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path) ? "text-primary bg-accent" : "text-foreground hover:text-primary hover:bg-accent/50"
                }`}
              >
                {item.label}
              </Link>
              {item.children && item.children.length > 0 && hoveredItem === item.label && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-lg shadow-lg py-2 animate-fade-in" style={{ animationDuration: "0.2s" }}>
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden lg:flex">
            <SearchIcon className="w-4 h-4" />
          </Button>
          <Button className="hidden lg:flex gradient-primary text-primary-foreground border-0" asChild>
            <Link to="/lien-he">Liên hệ ngay</Link>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-fade-in" style={{ animationDuration: "0.2s" }}>
          <nav className="container py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-md text-sm font-medium ${
                    isActive(item.path) ? "text-primary bg-accent" : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    onClick={() => setMobileOpen(false)}
                    className="block pl-8 pr-4 py-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
