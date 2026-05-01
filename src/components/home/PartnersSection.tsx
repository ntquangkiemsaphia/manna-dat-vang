import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionTitle from "@/components/SectionTitle";
import { getOptimizedImageUrl } from "@/lib/image";

const PartnersSection = () => {
  const { data: partners = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data } = await supabase.from("partners").select("*").order("sort_order");
      return data || [];
    },
  });

  if (partners.length === 0) return null;

  // Duplicate exactly once so the -50% translate loops seamlessly
  const loop = [...partners, ...partners];

  return (
    <section className="py-16 overflow-hidden gradient-earth">
      <div className="container mb-8">
        <SectionTitle label="Hệ sinh thái" title="Đối tác của chúng tôi" />
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-marquee gap-16 items-center w-max">
          {loop.map((p: any, i: number) => (
            <div key={`${p.id}-${i}`} className="flex items-center justify-center shrink-0 min-w-[160px]">
              {p.logo_url ? (
                <img
                  src={getOptimizedImageUrl(p.logo_url, { width: 320, quality: 75 })}
                  alt={p.name}
                  className="h-16 w-auto object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="h-16 w-32 bg-card rounded flex items-center justify-center text-xs text-muted-foreground">
                  {p.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
