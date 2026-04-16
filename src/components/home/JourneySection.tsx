import { useState } from "react";
import journeyBg from "@/assets/journey-bg.jpg";

const milestones = [
  { year: "1993", title: "Khởi nguồn", desc: "Thành lập Công ty TNHH Thành Phương, chuyên nghiên cứu bảo vệ thực vật từ tinh dầu thảo dược." },
  { year: "1999 – 2000", title: "Nghiên cứu tại Mỹ", desc: "Nhà khoa học Nguyễn Phương Dung du học và nghiên cứu chuyên sâu về sinh học ứng dụng tại Hoa Kỳ." },
  { year: "2005 – 2015", title: "Phát triển sản phẩm", desc: "Ứng dụng kết quả nghiên cứu vào sản xuất chế phẩm sinh học cho nông nghiệp Việt Nam." },
  { year: "2021", title: "Manna Đất Vàng ra đời", desc: "Thành lập Công ty Cổ phần Manna Đất Vàng, tập trung nông nghiệp sinh học toàn diện." },
  { year: "2025", title: "Thương hiệu uy tín", desc: "Được công nhận 'Thương hiệu uy tín quốc gia 2025', sở hữu nhiều bằng sáng chế độc quyền." },
];

const JourneySection = () => {
  const [active, setActive] = useState(3);

  return (
    <section className="relative py-24 overflow-hidden">
      <img src={journeyBg} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" width={1920} height={1080} />
      <div className="absolute inset-0 bg-[hsl(224,60%,12%)]/85" />
      <div className="relative container text-center text-white">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">Hành trình của</h2>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary mb-12">Manna Đất Vàng</h2>

        <p className="max-w-2xl mx-auto text-white/70 text-sm leading-relaxed mb-12">
          Khởi nguồn từ niềm đam mê với cây thảo dược Việt Nam, Nhà khoa học Nguyễn Phương Dung đã dành trọn tuổi thanh xuân để nghiên cứu và ứng dụng giá trị của "rừng thuốc" quê hương vào nông nghiệp bền vững.
        </p>

        {/* Active milestone detail */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-xl mx-auto mb-12 border border-white/10">
          <p className="text-secondary font-serif text-2xl font-bold mb-1">{milestones[active].year}</p>
          <h3 className="text-xl font-serif font-semibold mb-2">{milestones[active].title}</h3>
          <p className="text-white/70 text-sm leading-relaxed">{milestones[active].desc}</p>
        </div>

        {/* Timeline bar */}
        <div className="flex items-center justify-center gap-0 max-w-3xl mx-auto">
          {milestones.map((m, i) => (
            <button
              key={m.year}
              onClick={() => setActive(i)}
              className="flex-1 group relative"
            >
              <div className={`h-1 w-full ${i <= active ? "bg-secondary" : "bg-white/20"} transition-colors`} />
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all ${
                i === active ? "bg-secondary border-secondary scale-125" : i < active ? "bg-secondary border-secondary" : "bg-white/30 border-white/30"
              }`} />
              <p className={`mt-4 text-xs ${i === active ? "text-secondary font-semibold" : "text-white/50"} transition-colors`}>
                {m.year}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
