import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionTitle from "@/components/SectionTitle";

const PatentsSection = () => {
  const { data: patents = [] } = useQuery({
    queryKey: ["patents"],
    queryFn: async () => {
      const { data } = await supabase.from("patents").select("*").order("sort_order");
      return data || [];
    },
  });
  const [selected, setSelected] = useState(0);

  if (patents.length === 0) return null;

  return (
    <section className="py-20 section-navy">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Uy tín & Chất lượng</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-serif font-bold text-white">Sở hữu độc quyền sáng chế</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {patents.map((p: any, i: number) => (
            <button
              key={p.id}
              onClick={() => setSelected(i)}
              className={`rounded-xl overflow-hidden border-2 transition-all ${selected === i ? "border-secondary shadow-lg scale-[1.02]" : "border-transparent hover:border-secondary/30"}`}
            >
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-40 bg-white/10 flex items-center justify-center text-white/50 text-sm">{p.title}</div>
              )}
            </button>
          ))}
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center max-w-2xl mx-auto border border-white/10">
          <h3 className="text-xl font-serif font-semibold text-white mb-2">{patents[selected]?.title}</h3>
          {patents[selected]?.description && (
            <p className="text-white/70 text-sm leading-relaxed">{patents[selected].description}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PatentsSection;
