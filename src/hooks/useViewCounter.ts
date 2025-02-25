"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export const useViewCounter = (beritaId: string) => {
  const supabase = createClient();

  useEffect(() => {
    const incrementViews = async () => {
      // Get current views
      const { data: currentData } = await supabase
        .from("berita")
        .select("views")
        .eq("id", beritaId)
        .single();

      // Increment views
      const newViews = (currentData?.views || 0) + 1;

      await supabase
        .from("berita")
        .update({ views: newViews })
        .eq("id", beritaId);
    };

    incrementViews();
  }, [beritaId, supabase]);
};
