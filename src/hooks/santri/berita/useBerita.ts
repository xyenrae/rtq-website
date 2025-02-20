"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

// Define the Kategori interface
interface Kategori {
  nama: string;
}

// Define the Berita interface based on the provided fields
interface Berita {
  id: string;
  judul: string;
  konten: string;
  gambar: string;
  views: number;
  kategori_id: string;
  ringkasan: string;
  waktu_baca: number;
  created_at: string;
  updated_at: string;
  kategori: Kategori; // This matches the "kategori:kategori_id (nama)" in your query
}

export function useBerita(selectedCategory: string = "Semua") {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 6; // Reduced for better UX

  useEffect(() => {
    // Reset when category changes
    setBerita([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        setIsLoading(true);
        let query = supabase
          .from("berita")
          .select("*, kategori:kategori_id (nama)")
          .order("created_at", { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);

        if (selectedCategory !== "Semua") {
          query = query.eq("kategori_id", selectedCategory);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          setBerita((prev) => (page === 1 ? data : [...prev, ...data]));
          setHasMore(data.length === pageSize);
        }
      } catch (error) {
        console.error("Error fetching berita:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBerita();
  }, [page, selectedCategory]);

  return { berita, isLoading, setPage, hasMore };
}
