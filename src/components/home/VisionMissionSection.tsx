import heroAbout from "@/assets/hero-about.jpg";
import { getOptimizedImageUrl } from "@/lib/image";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LucideIcon } from "@/lib/lucideIcon";

const VisionMissionSection = () => {
  const { data: rows = [] } = useQuery({
    queryKey: ["vision_mission"],
    queryFn: async () => {
      const { data } = await supabase
        .from("vision_mission")
        .select("*")
        .order("sort_order");
      return data || [];
    },
  });

  const header = rows.find((r: any) => r.section_key === "header");
  const cards = rows.filter((r: any) => r.section_key !== "header");

  if (rows.length === 0) return null;

  return (
    <section className="py-16 md:py-20 gradient-earth">
      <div className="container">
        {header && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {header.eyebrow && (
              <p className="font-serif italic text-2xl md:text-3xl text-muted-foreground mb-3">
                {header.eyebrow}
              </p>
            )}
            {header.title && (
              <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                {header.title}
              </h2>
            )}
            {header.description && (
              <p className="mt-5 text-muted-foreground leading-relaxed whitespace-pre-line">
                {header.description}
              </p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((c: any, idx: number) => (
            <article
              key={c.id}
              className={`relative rounded-2xl overflow-hidden shadow-card group min-h-[420px] ${
                idx === 0 ? "gradient-navy" : "gradient-primary"
              }`}
            >
              <img
                src={getOptimizedImageUrl(c.image_url || heroAbout, { width: 900, quality: 70 })}
                alt={c.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
              />
              <div className="relative h-full flex flex-col justify-end p-8 md:p-10 text-primary-foreground">
                <div className="w-12 h-12 rounded-full border-2 border-primary-foreground/80 flex items-center justify-center mb-4">
                  <LucideIcon name={c.icon_name} className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-2xl md:text-3xl mb-3">{c.title}</h3>
                <p className="text-sm md:text-base leading-relaxed text-primary-foreground/90 whitespace-pre-line">
                  {c.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;