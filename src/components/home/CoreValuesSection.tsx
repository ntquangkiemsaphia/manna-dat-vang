import SectionTitle from "@/components/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LucideIcon } from "@/lib/lucideIcon";
import { getOptimizedImageUrl } from "@/lib/image";

const CoreValuesSection = () => {
  const { data: values = [] } = useQuery({
    queryKey: ["core_values"],
    queryFn: async () => {
      const { data } = await supabase
        .from("core_values")
        .select("*")
        .order("sort_order");
      return data || [];
    },
  });

  if (values.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <SectionTitle label="Giá trị" title="Giá trị cốt lõi" />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {values.map((v: any) => (
            <div key={v.id} className="flex flex-col items-center text-center">
              <div
                className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-card overflow-hidden transition-transform hover:-translate-y-1 ${
                  v.is_highlight
                    ? "gradient-primary text-primary-foreground"
                    : "bg-accent text-primary"
                }`}
              >
                {v.image_url ? (
                  <img
                    src={getOptimizedImageUrl(v.image_url, { width: 240, quality: 75 })}
                    alt={v.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <LucideIcon
                    name={v.icon_name}
                    className="w-10 h-10 md:w-12 md:h-12"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <p className="mt-4 text-sm md:text-base font-medium text-foreground max-w-[160px]">
                {v.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;