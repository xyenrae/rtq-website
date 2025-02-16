// app/hooks/gallery/useGalleries.ts
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export interface GalleryImage {
  id: string;
  public_id: string;
  gallery_category_id: string;
  created_at: string;
}

export function useGalleries() {
  const [galleries, setGalleries] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGalleries() {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error fetching galleries:", error);
      } else {
        setGalleries(data as GalleryImage[]);
      }
      setLoading(false);
    }
    fetchGalleries();
  }, []);

  return { galleries, loading };
}
