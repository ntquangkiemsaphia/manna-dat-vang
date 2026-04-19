import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Trang chủ", path: "/" },
  {
    label: "Giới thiệu", path: "/gioi-thieu",
    children: [{ label: "Về chúng tôi", path: "/gioi-thieu" }],
  },
  {
    label: "Sản phẩm", path: "/san-pham",
    children: [
      { label: "Phân bón sinh học", path: "/san-pham/phan-bon" },
      { label: "Chăn nuôi", path: "/san-pham/chan-nuoi" },
      { label: "Thủy sản", path: "/san-pham/thuy-san" },
    ],
  },
  { label: "Tin tức", path: "/tin-tuc" },
  { label: "Liên hệ", path: "/lien-he" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path + "/"));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="section-navy">
        <div className="container flex items-center justify-between py-1.5 text-sm text-white">
          <div className="flex items-center gap-4">
            <a href="tel:0395830009" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone className="w-3.5 h-3.5" /> 0395 830 009
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
          <img src={logo} alt="Manna Đất Vàng" className="h-12 w-12" />
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
              {item.children && hoveredItem === item.label && (
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
            <Search className="w-4 h-4" />
          </Button>
          <Button className="hidden lg:flex gradient-primary text-primary-foreground border-0" asChild>
            <Link to="/lien-he">Liên hệ ngay</Link>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
