import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Manna Đất Vàng" className="h-12 w-12" />
            <div>
              <p className="font-serif text-lg font-bold leading-tight">MANNA ĐẤT VÀNG</p>
              <p className="text-sm opacity-70">Nông nghiệp sinh học bền vững</p>
            </div>
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            Mang đến mâm cơm sạch, an toàn và dinh dưỡng cho người Việt thông qua nông nghiệp tuần hoàn và sản phẩm sinh học từ thảo dược thiên nhiên.
          </p>
        </div>

        {/* About */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-semibold">Về chúng tôi</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/gioi-thieu" className="hover:opacity-100 transition-opacity">Giới thiệu</Link></li>
            <li><Link to="/san-pham" className="hover:opacity-100 transition-opacity">Sản phẩm</Link></li>
            <li><Link to="/tin-tuc" className="hover:opacity-100 transition-opacity">Tin tức</Link></li>
            <li><Link to="/lien-he" className="hover:opacity-100 transition-opacity">Liên hệ</Link></li>
          </ul>
        </div>

        {/* Products */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-semibold">Sản phẩm</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/san-pham/phan-bon" className="hover:opacity-100 transition-opacity">Phân bón sinh học</Link></li>
            <li><Link to="/san-pham/chan-nuoi" className="hover:opacity-100 transition-opacity">Chăn nuôi</Link></li>
            <li><Link to="/san-pham/thuy-san" className="hover:opacity-100 transition-opacity">Thủy sản</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-semibold">Liên hệ</h4>
          <ul className="space-y-3 text-sm opacity-70">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>TP. Hồ Chí Minh, Việt Nam</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              <a href="tel:0901234567" className="hover:opacity-100">0901 234 567</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <a href="mailto:info@mannadatvang.vn" className="hover:opacity-100">info@mannadatvang.vn</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="border-t border-background/10">
      <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm opacity-60">
        <p>© 2025 Công ty Cổ phần Manna Đất Vàng. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/dang-nhap" className="hover:opacity-100">Đăng nhập quản trị</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
