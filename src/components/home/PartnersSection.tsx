import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionTitle from "@/components/SectionTitle";

const PartnersSection = () => {
  const { data: partners = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data } = await supabase.from("partners").select("*").order("sort_order");
      return data || [];
    },
  });

  if (partners.length === 0) return null;

  const row1 = [...partners, ...partners];
  const row2 = [...partners.slice().reverse(), ...partners.slice().reverse()];

  return (
    <section className="py-16 overflow-hidden gradient-earth">
      <div className="container mb-8">
        <SectionTitle label="Hệ sinh thái" title="Đối tác của chúng tôi" />
      </div>
      {/* Row 1: left to right */}
      <div className="relative mb-6">
        <div className="flex animate-marquee gap-12 items-center" style={{ width: `${row1.length * 200}px` }}>
          {row1.map((p: any, i: number) => (
            <div key={`r1-${p.id}-${i}`} className="flex flex-col items-center min-w-[140px]">
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.name} className="h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" loading="lazy" />
              ) : (
                <div className="h-14 w-28 bg-card rounded flex items-center justify-center text-xs text-muted-foreground">{p.name}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Row 2: right to left */}
      <div className="relative">
        <div className="flex animate-marquee-reverse gap-12 items-center" style={{ width: `${row2.length * 200}px` }}>
          {row2.map((p: any, i: number) => (
            <div key={`r2-${p.id}-${i}`} className="flex flex-col items-center min-w-[140px]">
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.name} className="h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" loading="lazy" />
              ) : (
                <div className="h-14 w-28 bg-card rounded flex items-center justify-center text-xs text-muted-foreground">{p.name}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
