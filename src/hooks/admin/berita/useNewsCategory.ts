"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export interface Kategori {
  id: string;
  nama: string;
}

export function useKategori() {
  const [kategories, setKategories] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingKategori, setEditingKategori] = useState<Kategori | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Kategori;
    direction: "asc" | "desc";
  } | null>(null);

  // Form state
  const formInitState = { id: "", nama: "" };
  const [formData, setFormData] = useState<Kategori>(formInitState);

  const itemsPerPage = 10;

  const supabase = createClient();

  const requestSort = (key: keyof Kategori) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredKategories = kategories.filter((kategori) =>
    kategori.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedKategories = [...filteredKategories].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedKategories.length / itemsPerPage);
  const paginatedKategories = sortedKategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchKategories = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("berita_kategori")
        .select("*", { count: "exact" });
      if (searchTerm) {
        query = query.ilike("nama", `%${searchTerm}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      setKategories(data || []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Gagal memuat kategori"
      );
      toast.error("Gagal memuat kategori");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingKategori) {
        const { error } = await supabase
          .from("berita_kategori")
          .update({ nama: formData.nama })
          .eq("id", formData.id);

        if (error) throw error;
        toast.success("Kategori berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("berita_kategori")
          .insert([{ nama: formData.nama }]);

        if (error) throw error;
        toast.success("Kategori berhasil ditambahkan");
      }

      setShowModal(false);
      setEditingKategori(null);
      setFormData(formInitState);
      await fetchKategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      try {
        const { error } = await supabase
          .from("berita_kategori")
          .delete()
          .eq("id", id);

        if (error) throw error;
        toast.success("Kategori berhasil dihapus");
        await fetchKategories();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Gagal menghapus kategori"
        );
      }
    }
  };

  useEffect(() => {
    fetchKategories();
  }, [fetchKategories]);

  return {
    kategories,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    showModal,
    setShowModal,
    editingKategori,
    setEditingKategori,
    sortConfig,
    requestSort,
    formData,
    setFormData,
    itemsPerPage,
    filteredKategories,
    totalPages,
    paginatedKategories,
    handleSubmit,
    handleDelete,
    formInitState,
  };
}
