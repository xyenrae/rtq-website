"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export const useViewCounter = (beritaId: string) => {
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
  }, [beritaId]);
};
