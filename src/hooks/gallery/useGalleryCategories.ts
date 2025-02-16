// app/hooks/gallery/useGalleryCategories.ts
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

// Tipe untuk objek gallery (hasil join)
export interface GalleryImage {
  id: string;
  public_id: string;
  gallery_category_id: string;
  created_at: string;
}

// Tipe untuk kategori gallery, dengan properti "gallery" yang merupakan array GalleryImage
export interface GalleryCategory {
  id: string;
  title: string;
  folder: string;
  color_scheme: string;
  created_at: string;
  gallery: GalleryImage[]; // properti join
}

export function useGalleryCategories() {
  const [galleryCategories, setGalleryCategories] = useState<GalleryCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGalleryCategories() {
      // Query join untuk mengambil data kategori beserta data gallery-nya
      const { data, error } = await supabase
        .from("gallery_category")
        .select("*, gallery(*)")
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error fetching gallery categories:", error);
      } else {
        // Pastikan data dicast ke tipe GalleryCategory[]
        setGalleryCategories(data as GalleryCategory[]);
      }
      setLoading(false);
    }
    fetchGalleryCategories();
  }, []);

  return { galleryCategories, loading };
}
