import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getOptimizedImageUrl } from "@/lib/image";

const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const PatentsSection = () => {
  const { data: patents = [] } = useQuery({
    queryKey: ["patents"],
    queryFn: async () => {
      const { data } = await supabase.from("patents").select("*").order("sort_order");
      return data || [];
    },
  });
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState<number | null>(null);

  if (patents.length === 0) return null;

  return (
    <section className="py-20 section-navy">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Tất cả xuất phát từ khoa học</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-serif font-bold text-white">Sở hữu độc quyền sáng chế</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
          {patents.map((p: any, i: number) => (
            <button
              key={p.id}
              onClick={() => {
                setSelected(i);
                setZoomed(i);
              }}
              className={`group w-[calc(50%-0.5rem)] sm:w-[200px] md:w-[220px] rounded-xl overflow-hidden border-2 bg-white/5 transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl ${selected === i ? "border-secondary shadow-lg scale-[1.02]" : "border-transparent hover:border-secondary/40"}`}
              style={{ aspectRatio: "1 / 1.4142" }}
            >
              {p.image_url ? (
                <img src={getOptimizedImageUrl(p.image_url, { width: 520, quality: 72 })} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/50 text-sm p-4 text-center">{p.title}</div>
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

      <Dialog open={zoomed !== null} onOpenChange={(o) => !o && setZoomed(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-0 shadow-none p-0 [&>button]:hidden">
          {zoomed !== null && patents[zoomed] && (
            <div className="relative animate-scale-in">
              <button
                type="button"
                onClick={() => setZoomed(null)}
                aria-label="Đóng"
                className="absolute -top-2 -right-2 z-10 w-10 h-10 rounded-full bg-white text-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <XIcon className="w-5 h-5" />
              </button>
              {patents[zoomed].image_url ? (
                <img
                  src={getOptimizedImageUrl(patents[zoomed].image_url, { width: 1400, quality: 78 })}
                  alt={patents[zoomed].title}
                  className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl bg-white"
                />
              ) : (
                <div className="w-full aspect-[1/1.4142] bg-white/10 rounded-xl flex items-center justify-center text-white">
                  {patents[zoomed].title}
                </div>
              )}
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-serif font-semibold">{patents[zoomed].title}</h3>
                {patents[zoomed].description && (
                  <p className="mt-1 text-white/80 text-sm max-w-2xl mx-auto">{patents[zoomed].description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PatentsSection;
