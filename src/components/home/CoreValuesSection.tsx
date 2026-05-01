import { Award, Leaf, ShieldCheck, Rocket, Heart } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const values = [
  { icon: Award, title: "Chất lượng tuyệt đối", highlight: false },
  { icon: Leaf, title: "Phát triển bền vững", highlight: false },
  { icon: ShieldCheck, title: "Uy tín – Niềm tin", highlight: true },
  { icon: Rocket, title: "Đổi mới & Khát vọng vươn xa", highlight: false },
  { icon: Heart, title: "Con người là trung tâm", highlight: false },
];

const CoreValuesSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <SectionTitle label="Giá trị" title="Giá trị cốt lõi" />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center">
                <div
                  className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-card transition-transform hover:-translate-y-1 ${
                    v.highlight
                      ? "gradient-primary text-primary-foreground"
                      : "bg-accent text-primary"
                  }`}
                >
                  <Icon className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-sm md:text-base font-medium text-foreground max-w-[160px]">
                  {v.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;