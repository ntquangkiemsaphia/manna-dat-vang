import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroAbout from "@/assets/hero-about.jpg";

const Catalog = () => {
  const { data: row, isLoading, isFetched } = useQuery({
    queryKey: ["catalog-public"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page", "catalog")
        .eq("section", "file")
        .maybeSingle();
      return data;
    },
  });

  const waiting = isLoading && !isFetched;
  const url = row?.cta_link || "";
  const title = row?.title || "Catalog sản phẩm";
  const subtitle = row?.subtitle || "Xem trực tiếp catalog sản phẩm Manna Đất Vàng";

  return (
    <Layout>
      <HeroBanner page="catalog" image={heroAbout} title={title} subtitle={subtitle} compact />

      <section className="py-12">
        <div className="container max-w-6xl">
          {waiting ? (
            <div className="h-[80vh] bg-muted animate-pulse rounded-lg" />
          ) : url ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-serif font-semibold text-foreground">{title}</h2>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <a href={url} target="_blank" rel="noreferrer">Mở tab mới</a>
                  </Button>
                  <Button className="gradient-primary text-primary-foreground border-0" asChild>
                    <a href={url} download>
                      <Download className="w-4 h-4 mr-1" /> Tải xuống
                    </a>
                  </Button>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-border shadow-card bg-muted">
                <object data={`${url}#view=FitH`} type="application/pdf" className="w-full h-[85vh]">
                  <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`} className="w-full h-[85vh]" title="Catalog PDF" />
                </object>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground italic py-20">
              Catalog chưa được cập nhật. Vui lòng quay lại sau.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;