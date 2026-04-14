import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type NewsCategory = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

export const useNewsCategories = () =>
  useQuery<NewsCategory[]>({
    queryKey: ["news-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("news_categories").select("*").order("created_at");
      return (data as NewsCategory[]) || [];
    },
  });
