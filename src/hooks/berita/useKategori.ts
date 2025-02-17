"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export interface Kategori {
  id: string;
  nama: string;
}

export function useKategori() {
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKategori = async () => {
      const { data, error } = await supabase
        .from("kategori")
        .select("*")
        .order("nama", { ascending: true });
      if (error) {
        setError("Gagal memuat kategori.");
      } else {
        setKategori(data);
      }
      setIsLoading(false);
    };

    fetchKategori();
  }, []);

  return { kategori, isLoading, error };
}
