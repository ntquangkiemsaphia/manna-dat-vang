import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import SectionTitle from "@/components/SectionTitle";
import heroAbout from "@/assets/hero-about.jpg";
import aboutStory from "@/assets/about-story.jpg";
import { Eye, Target, Heart, Cpu } from "lucide-react";
import { usePageSection } from "@/hooks/usePageSection";

const values = [
  { icon: Cpu, title: "Công nghệ", desc: "Lấy khoa học và công nghệ sinh học làm nền tảng cốt lõi, đảm bảo chất lượng sản phẩm tối ưu." },
  { icon: Eye, title: "Sự thật", desc: "Cam kết minh bạch, trung thực trong mọi hoạt động. Mọi tuyên bố đều dựa trên bằng chứng khoa học." },
  { icon: Target, title: "Uy tín", desc: "Xây dựng lòng tin lâu dài với nông dân, đối tác qua chất lượng sản phẩm ổn định và dịch vụ tận tâm." },
  { icon: Heart, title: "Tình yêu thương", desc: "Yêu thương thiên nhiên, con người và quê hương. Bảo vệ sức khỏe cộng đồng và môi trường." },
];

const About = () => {
  const { data: story } = usePageSection("about", "story");
  const storyImage =
    story?.image_url
      ?.split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)[0] || aboutStory;
  const storyLabel = story?.title?.trim() || "Câu chuyện của chúng tôi";
  const storyTitle =
    story?.subtitle?.trim() || "Từ rừng thuốc Việt Nam đến nông nghiệp bền vững";
  const storyDesc = story?.description?.trim();

  return (
  <Layout>
    <HeroBanner page="about" image={heroAbout} title="Về Manna Đất Vàng" subtitle="Hành trình 30 năm nghiên cứu và phát triển nông nghiệp sinh học Việt Nam" compact />

    {/* Story */}
    <section className="py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-card">
            <img src={storyImage} alt={storyTitle} className="w-full h-[450px] object-cover" loading="lazy" width={800} height={600} />
          </div>
          <div>
            <SectionTitle label={storyLabel} title={storyTitle} center={false} />
            {storyDesc ? (
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                {storyDesc}
              </div>
            ) : (
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>Xuất phát từ niềm đam mê với cây thảo dược Việt Nam, Nhà khoa học Nguyễn Phương Dung đã dành trọn tuổi thanh xuân để nghiên cứu và ứng dụng giá trị của "rừng thuốc" quê hương.</p>
                <p>Năm 1993, bà thành lập Công ty TNHH Thành Phương, chuyên nghiên cứu các sản phẩm bảo vệ thực vật từ tinh dầu và hợp chất kháng sinh thực vật từ cây dược liệu.</p>
                <p>Sau khi du học tại Mỹ, bà quyết định từ bỏ cơ hội định cư để trở về Việt Nam cống hiến. Câu nói của vị giáo sư người Mỹ đã thay đổi cuộc đời bà:</p>
                <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-medium">
                  "Người Việt sống trên một rừng thuốc, nhưng cũng chết trên một rừng thuốc. Chị là người Việt Nam, hãy làm giàu trên mảnh đất quê hương của mình."
                </blockquote>
                <p>Năm 2021, bà thành lập Công ty Cổ phần Manna Đất Vàng với trọng tâm nghiên cứu và phát triển sản phẩm phục vụ nông nghiệp sạch.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    {/* Vision & Mission */}
    <section className="py-20 gradient-earth">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h3 className="text-2xl font-serif font-bold text-primary mb-4">Tầm nhìn</h3>
            <p className="text-muted-foreground leading-relaxed">
              Trở thành thương hiệu uy tín hàng đầu Việt Nam trong lĩnh vực nông nghiệp sinh học, xây dựng hệ sinh thái khép kín bền vững, đưa nông sản và dược liệu Việt Nam vươn tầm quốc tế.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h3 className="text-2xl font-serif font-bold text-secondary mb-4">Sứ mệnh</h3>
            <p className="text-muted-foreground leading-relaxed">
              Mang đến mâm cơm sạch, an toàn và dinh dưỡng cho người Việt và cả thế giới thông qua nông nghiệp tuần hoàn, sản phẩm sinh học từ thảo dược thiên nhiên.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Core Values */}
    <section className="py-20">
      <div className="container">
        <SectionTitle label="Triết lý thương hiệu" title="Giá trị cốt lõi" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-card rounded-2xl p-6 shadow-card text-center hover:shadow-card-hover transition-all duration-300">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-serif font-semibold text-foreground mb-2">{v.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
  );
};

export default About;
