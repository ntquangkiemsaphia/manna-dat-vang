import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import heroProducts from "@/assets/hero-products.jpg";
import { Leaf, FlaskConical, Fish, ArrowRight, Phone } from "lucide-react";

const categories = {
  "phan-bon": {
    name: "Phân bón sinh học",
    icon: Leaf,
    description: "Chế phẩm giải độc đất, phân bón sinh học từ thảo dược thiên nhiên giúp phục hồi đất trồng bị thoái hóa, cân bằng hệ vi sinh vật đất.",
    products: [
      { id: 1, name: "TP-Soil Detox", desc: "Chế phẩm giải độc kim loại nặng trong đất, phục hồi đất canh tác bền vững.", usage: "Phun hoặc tưới 2-3 lần/vụ" },
      { id: 2, name: "TP-Bio Fertilizer", desc: "Phân bón sinh học tổng hợp từ hợp chất thiên nhiên, kích thích rễ phát triển mạnh.", usage: "Bón gốc hoặc phun qua lá" },
      { id: 3, name: "TP-Growth Plus", desc: "Chế phẩm kích thích tăng trưởng cây trồng, tăng năng suất tự nhiên.", usage: "Phun định kỳ 7-10 ngày/lần" },
      { id: 4, name: "TP-Protect Green", desc: "Bảo vệ thực vật sinh học, phòng ngừa sâu bệnh an toàn cho cây trồng.", usage: "Phun phòng trừ khi phát hiện sâu bệnh" },
    ],
  },
  "chan-nuoi": {
    name: "Chăn nuôi",
    icon: FlaskConical,
    description: "Thức ăn bổ sung và chế phẩm sinh học chứa hợp chất kháng sinh thực vật, hỗ trợ tiêu hóa và tăng sức đề kháng cho gia súc, gia cầm.",
    products: [
      { id: 5, name: "TP-Livestock Pro", desc: "Thức ăn bổ sung sinh học tăng sức đề kháng cho gia súc, gia cầm.", usage: "Trộn vào thức ăn hàng ngày" },
      { id: 6, name: "TP-Bio Bedding", desc: "Chế phẩm đệm lót sinh học chuồng trại, khử mùi hôi hiệu quả.", usage: "Rải đều trên đệm lót chuồng" },
      { id: 7, name: "TP-Immune Boost", desc: "Tăng cường miễn dịch tự nhiên, giảm sử dụng kháng sinh trong chăn nuôi.", usage: "Pha nước uống hoặc trộn thức ăn" },
    ],
  },
  "thuy-san": {
    name: "Thủy sản",
    icon: Fish,
    description: "Giải pháp sinh học xử lý nước ao, phân hủy chất hữu cơ, kiểm soát tảo độc và cải thiện chất lượng môi trường sống cho tôm, cá.",
    products: [
      { id: 8, name: "TP-Aqua Clean", desc: "Xử lý nước ao nuôi, phân hủy chất hữu cơ, kiểm soát tảo độc.", usage: "Tạt đều khắp ao nuôi" },
      { id: 9, name: "TP-Viruto", desc: "Phòng bệnh virus đốm trắng WSSV trên tôm sú, đã được kiểm chứng khoa học.", usage: "Trộn thức ăn, phòng trước mùa dịch" },
      { id: 10, name: "TP-Shrimp Guard", desc: "Bảo vệ sức khỏe tôm cá, tăng tỷ lệ sống và chất lượng thu hoạch.", usage: "Sử dụng định kỳ trong suốt vụ nuôi" },
    ],
  },
};

const allCategories = Object.entries(categories).map(([slug, cat]) => ({ slug, ...cat }));

const ProductsOverview = () => (
  <Layout>
    <HeroBanner image={heroProducts} title="Sản phẩm & Dịch vụ" subtitle="Giải pháp sinh học toàn diện cho nông nghiệp tuần hoàn" compact />
    <section className="py-20">
      <div className="container">
        <SectionTitle label="Danh mục sản phẩm" title="Ba trụ cột nông nghiệp sinh học" description="Chuỗi sản phẩm khép kín từ đất → cây trồng → chăn nuôi – thủy sản → thực phẩm sạch." />
        <div className="grid md:grid-cols-3 gap-8">
          {allCategories.map((cat) => (
            <Link key={cat.slug} to={`/san-pham/${cat.slug}`} className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                <cat.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{cat.description}</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Xem sản phẩm <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

const ProductCategory = () => {
  const { category } = useParams<{ category: string }>();
  const cat = categories[category as keyof typeof categories];

  if (!cat) return <Layout><div className="container py-40 text-center"><h2 className="text-2xl font-serif">Không tìm thấy danh mục</h2></div></Layout>;

  const Icon = cat.icon;

  return (
    <Layout>
      <HeroBanner image={heroProducts} title={cat.name} subtitle={cat.description} compact />
      <section className="py-20">
        <div className="container">
          <SectionTitle title={`Sản phẩm ${cat.name}`} description={cat.description} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cat.products.map((product) => (
              <div key={product.id} className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
                <div className="h-48 gradient-primary flex items-center justify-center">
                  <Icon className="w-16 h-16 text-primary-foreground opacity-40" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-serif font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{product.desc}</p>
                  <p className="text-xs text-accent-foreground bg-accent rounded-md px-3 py-1.5 inline-block mb-4">Cách dùng: {product.usage}</p>
                  <div className="flex gap-3">
                    <Button size="sm" className="gradient-primary text-primary-foreground border-0 flex-1">Chi tiết</Button>
                    <Button size="sm" variant="outline" className="border-primary text-primary flex-1" asChild>
                      <Link to="/lien-he"><Phone className="w-3.5 h-3.5 mr-1" /> Liên hệ</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export { ProductsOverview, ProductCategory };
