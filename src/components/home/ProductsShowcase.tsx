import { Link } from "react-router-dom";
import { ArrowRight, Leaf, FlaskConical, Fish } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const categories = [
  { icon: Leaf, title: "Phân bón sinh học", desc: "Chế phẩm giải độc đất, phân bón sinh học từ thảo dược thiên nhiên giúp cây trồng phát triển bền vững.", link: "/san-pham/phan-bon" },
  { icon: FlaskConical, title: "Chăn nuôi", desc: "Thức ăn bổ sung và chế phẩm sinh học giúp tăng sức đề kháng, giảm kháng sinh trong chăn nuôi.", link: "/san-pham/chan-nuoi" },
  { icon: Fish, title: "Thủy sản", desc: "Giải pháp sinh học xử lý nước ao, cải thiện môi trường sống cho tôm cá hiệu quả.", link: "/san-pham/thuy-san" },
];

const ProductsShowcase = () => (
  <section className="py-20 gradient-earth">
    <div className="container">
      <SectionTitle
        label="Sản phẩm & Dịch vụ"
        title="Manna Đất Vàng — Giải pháp nông nghiệp sinh học"
        description="Ứng dụng khoa học vào chuỗi nông nghiệp tuần hoàn khép kín từ đất, cây trồng đến chăn nuôi và thủy sản."
      />
      <div className="grid md:grid-cols-3 gap-8">
        {categories.map((cat) => (
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
);

export default ProductsShowcase;
