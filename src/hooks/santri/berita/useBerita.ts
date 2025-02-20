"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export function useBerita(selectedCategory: string = "Semua") {
  const [berita, setBerita] = useState([]);
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
          .select("*, kategori_berita:kategori_id (nama)")
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
