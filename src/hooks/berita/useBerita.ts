"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

// Definisikan tipe untuk kategori dan berita
export interface Kategori {
  nama: string;
}

export interface Berita {
  id: string;
  judul: string;
  tanggal: string;
  konten: string;
  views: number;
  gambar: string;
  kategori_id: string;
  ringkasan: string;
  waktu_baca: number;
  // Pastikan properti kategori didefinisikan sebagai objek, bukan string.
  kategori?: Kategori;
}

export function useBerita(selectedCategory: string = "Semua") {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 10;

  // Reset berita ketika kategori berubah
  useEffect(() => {
    setBerita([]);
    setPage(1);
    setHasMore(true);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchBerita = async () => {
      setIsLoading(true);
      let query = supabase
        .from("berita")
        // Lakukan join ke tabel kategori (alias: kategori) untuk mengambil nama kategori
        .select("*, kategori:kategori_id (nama)")
        .order("tanggal", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      // Jika kategori terpilih bukan "Semua", filter berdasarkan kategori_id
      if (selectedCategory !== "Semua") {
        query = query.eq("kategori_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching berita:", error);
      } else if (data) {
        setBerita((prev) => [...prev, ...data]);
        if (data.length < pageSize) {
          setHasMore(false);
        }
      }
      setIsLoading(false);
    };

    fetchBerita();
  }, [page, selectedCategory]);

  return { berita, isLoading, setPage, hasMore };
}
