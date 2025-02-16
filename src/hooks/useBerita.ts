"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

export interface Berita {
  id: string;
  judul: string;
  tanggal: string;
  konten: string;
  views: number;
  gambar: string;
  kategori?: string;
}

type CacheType = {
  [category: string]: {
    [page: number]: Berita[];
  };
};

export function useBerita(selectedCategory: string) {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<CacheType>({});

  // Bungkus fetchBerita dengan useCallback agar bisa dijadikan dependency useEffect
  const fetchBerita = useCallback(
    async (currentPage: number, reset: boolean = false) => {
      setIsLoading(true);
      try {
        if (cacheRef.current[selectedCategory]?.[currentPage]) {
          const cachedData = cacheRef.current[selectedCategory][currentPage];
          if (reset) {
            setBerita(cachedData);
          } else {
            setBerita((prev) => [...prev, ...cachedData]);
          }
          if (cachedData.length < 6) setHasMore(false);
          return;
        }

        let query = supabase
          .from("berita")
          .select("*")
          .order("tanggal", { ascending: false })
          .range((currentPage - 1) * 6, currentPage * 6 - 1);

        if (selectedCategory !== "Semua") {
          query = query.eq("kategori", selectedCategory);
        }

        const { data, error } = await query;
        if (error) throw error;

        if (!cacheRef.current[selectedCategory]) {
          cacheRef.current[selectedCategory] = {};
        }
        cacheRef.current[selectedCategory][currentPage] = data;

        if (reset) {
          setBerita(data);
        } else {
          setBerita((prev) => [...prev, ...data]);
        }
        if (data.length < 6) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching berita:", err);
        setError("Gagal memuat berita. Silakan coba kembali.");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory]
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setBerita([]);
    fetchBerita(1, true);
  }, [selectedCategory, fetchBerita]);

  useEffect(() => {
    if (page === 1) return;
    fetchBerita(page, false);
  }, [page, fetchBerita]);

  return { berita, isLoading, error, page, setPage, hasMore };
}
