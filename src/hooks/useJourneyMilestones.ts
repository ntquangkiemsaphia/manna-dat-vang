import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type JourneyMilestone = {
  id: string;
  year: string;
  title: string;
  description: string;
  image_url: string | null;
  sort_order: number;
};

export const useJourneyMilestones = () =>
  useQuery({
    queryKey: ["journey_milestones"],
    queryFn: async () => {
      const { data } = await supabase
        .from("journey_milestones")
        .select("*")
        .order("sort_order");
      return (data || []) as JourneyMilestone[];
    },
  });