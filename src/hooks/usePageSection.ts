import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PageSection = {
  id: string;
  page: string;
  section: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  image_url: string | null;
  sort_order: number;
};

export const usePageSection = (page: string, section: string) =>
  useQuery({
    queryKey: ["page_sections", page, section],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page", page)
        .eq("section", section)
        .maybeSingle();
      return (data || null) as PageSection | null;
    },
  });

export const usePageSections = () =>
  useQuery({
    queryKey: ["page_sections", "all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_sections")
        .select("*")
        .order("page")
        .order("sort_order");
      return (data || []) as PageSection[];
    },
  });
