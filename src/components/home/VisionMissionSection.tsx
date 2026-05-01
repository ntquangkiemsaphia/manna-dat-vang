import { Target, Compass } from "lucide-react";
import heroAbout from "@/assets/hero-about.jpg";
import { getOptimizedImageUrl } from "@/lib/image";

const VisionMissionSection = () => {
  return (
    <section className="py-16 md:py-20 gradient-earth">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="font-serif italic text-2xl md:text-3xl text-muted-foreground mb-3">
            Tầm nhìn & Sứ mệnh của chúng tôi
          </p>
          <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
            Thương hiệu hàng đầu về Thực phẩm & Nông sản sạch
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Manna Đất Vàng định hướng trở thành tập đoàn thực phẩm – nông sản dẫn đầu Việt Nam và
            vươn tầm khu vực, mang tinh hoa nông nghiệp Việt đến với người tiêu dùng toàn cầu.
            Chúng tôi không chỉ xuất khẩu sản phẩm, mà còn xuất khẩu chất lượng, niềm tin và giá
            trị bền vững, góp phần nâng tầm thương hiệu quốc gia trên bản đồ ẩm thực toàn cầu.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Tầm Nhìn */}
          <article className="relative rounded-2xl overflow-hidden shadow-card group min-h-[420px] gradient-navy">
            <img
              src={getOptimizedImageUrl(heroAbout, { width: 900, quality: 70 })}
              alt="Tầm nhìn Manna Đất Vàng"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
            />
            <div className="relative h-full flex flex-col justify-end p-8 md:p-10 text-primary-foreground">
              <div className="w-12 h-12 rounded-full border-2 border-primary-foreground/80 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-2xl md:text-3xl mb-3">Tầm Nhìn</h3>
              <p className="text-sm md:text-base leading-relaxed text-primary-foreground/90">
                Trở thành thương hiệu thực phẩm – nông sản hàng đầu Việt Nam và khu vực, được tin
                cậy bởi chất lượng, sự minh bạch và cam kết phát triển bền vững. Chúng tôi đồng
                hành cùng người nông dân, ứng dụng công nghệ hiện đại để nâng tầm giá trị nông
                sản Việt.
              </p>
            </div>
          </article>

          {/* Sứ Mệnh */}
          <article className="relative rounded-2xl overflow-hidden shadow-card group min-h-[420px] gradient-primary">
            <div className="relative h-full flex flex-col justify-end p-8 md:p-10 text-primary-foreground">
              <div className="w-12 h-12 rounded-full border-2 border-primary-foreground/80 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-2xl md:text-3xl mb-3">Sứ Mệnh</h3>
              <p className="text-sm md:text-base leading-relaxed text-primary-foreground/90">
                Mang đến cho người tiêu dùng những sản phẩm thực phẩm và nông sản sạch, an toàn,
                giàu dinh dưỡng. Đồng hành cùng nhà nông Việt Nam phát triển vùng nguyên liệu bền
                vững, tạo việc làm và nâng cao đời sống cộng đồng – đóng góp vào sự thịnh vượng
                chung của đất nước.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;