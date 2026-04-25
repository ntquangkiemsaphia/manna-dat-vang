import { useState } from "react";
import journeyBg from "@/assets/journey-bg.jpg";
import { useJourneyMilestones } from "@/hooks/useJourneyMilestones";

const JourneySection = () => {
  const { data: milestones = [] } = useJourneyMilestones();
  const [active, setActive] = useState(0);

  const safeActive = Math.min(active, Math.max(milestones.length - 1, 0));
  const current = milestones[safeActive];

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
        {current && (
          <div
            key={current.id}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-xl mx-auto mb-12 border border-white/10 animate-fade-in"
          >
            <p className="text-secondary font-serif text-2xl font-bold mb-4">{current.year}</p>
            {current.image_url ? (
              <div className="mx-auto mb-5 w-40 h-40 rounded-full overflow-hidden border-4 border-secondary/60 shadow-2xl ring-4 ring-secondary/20">
                <img
                  src={current.image_url}
                  alt={current.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="mx-auto mb-5 w-40 h-40 rounded-full border-4 border-dashed border-white/30 flex items-center justify-center text-white/40 text-xs text-center px-2">
                Chưa có ảnh
              </div>
            )}
            <h3 className="text-xl font-serif font-semibold mb-2">{current.title}</h3>
            <p className="text-white/70 text-sm leading-relaxed">{current.description}</p>
          </div>
        )}

        {/* Timeline bar */}
        <div className="flex items-stretch justify-center gap-0 max-w-3xl mx-auto">
          {milestones.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className="flex-1 group relative pt-3 pb-2"
            >
              <div className="relative h-4 flex items-center">
                <div className={`h-1 w-full ${i <= safeActive ? "bg-secondary" : "bg-white/20"} transition-colors`} />
                <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all ${
                  i === safeActive ? "bg-secondary border-secondary scale-125" : i < safeActive ? "bg-secondary border-secondary" : "bg-white/30 border-white/30"
                }`} />
              </div>
              <p className={`mt-6 text-xs ${i === safeActive ? "text-secondary font-semibold" : "text-white/50"} transition-colors whitespace-nowrap`}>
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
