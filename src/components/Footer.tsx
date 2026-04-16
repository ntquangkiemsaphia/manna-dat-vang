import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="section-navy">
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Manna Đất Vàng" className="h-12 w-12" />
            <div>
              <p className="font-serif text-lg font-bold leading-tight text-white">MANNA ĐẤT VÀNG</p>
              <p className="text-sm text-white/60">Nông nghiệp sinh học bền vững</p>
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            Mang đến mâm cơm sạch, an toàn và dinh dưỡng cho người Việt thông qua nông nghiệp tuần hoàn và sản phẩm sinh học từ thảo dược thiên nhiên.
          </p>
        </div>

        {/* About */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-semibold text-white">Về chúng tôi</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/gioi-thieu" className="hover:text-secondary transition-colors">Giới thiệu</Link></li>
            <li><Link to="/san-pham" className="hover:text-secondary transition-colors">Sản phẩm</Link></li>
            <li><Link to="/tin-tuc" className="hover:text-secondary transition-colors">Tin tức</Link></li>
            <li><Link to="/lien-he" className="hover:text-secondary transition-colors">Liên hệ</Link></li>
          </ul>
        </div>

        {/* Products */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-semibold text-white">Sản phẩm</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/san-pham/phan-bon" className="hover:text-secondary transition-colors">Phân bón sinh học</Link></li>
            <li><Link to="/san-pham/chan-nuoi" className="hover:text-secondary transition-colors">Chăn nuôi</Link></li>
            <li><Link to="/san-pham/thuy-san" className="hover:text-secondary transition-colors">Thủy sản</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-semibold text-white">Liên hệ</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
              <span>Số nhà 1111 đường Ngô Gia Tự, phường Việt Hưng, thành phố Hà Nội, Việt Nam</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
              <span>ĐCSX: Thôn Trung, xã Đông Anh, thành phố Hà Nội, Việt Nam</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0 text-secondary" />
              <a href="tel:0395830009" className="hover:text-secondary transition-colors">0395 830 009</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/40">
        <p>© 2025 Công ty Cổ phần Manna Đất Vàng. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/dang-nhap" className="hover:text-secondary transition-colors">Đăng nhập quản trị</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
