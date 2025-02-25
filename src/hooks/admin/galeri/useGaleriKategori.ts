"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export interface GalleryCategory {
  id: string;
  nama: string;
}

export function useGalleryCategory() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<GalleryCategory | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof GalleryCategory;
    direction: "asc" | "desc";
  } | null>(null);

  const formInitState = { id: "", nama: "" };
  const [formData, setFormData] = useState<GalleryCategory>(formInitState);

  const itemsPerPage = 10;

  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("galeri_kategori")
        .select("*", { count: "exact" });
      if (searchTerm) {
        query = query.ilike("nama", `%${searchTerm}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast.error("Gagal memuat kategori");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, supabase]);

  const requestSort = (key: keyof GalleryCategory) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;

    if (a[key] < b[key]) {
      return direction === "asc" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredCategories = sortedCategories.filter((category) =>
    category.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("galeri_kategori")
          .update({ nama: formData.nama })
          .eq("id", formData.id);

        if (error) throw error;
        toast.success("Kategori berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("galeri_kategori")
          .insert([{ nama: formData.nama }]);

        if (error) throw error;
        toast.success("Kategori berhasil ditambahkan");
      }

      setShowModal(false);
      setEditingCategory(null);
      setFormData(formInitState);
      await fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    try {
      const { error } = await supabase
        .from("galeri_kategori")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Kategori berhasil dihapus");
      await fetchCategories();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menghapus kategori"
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    showModal,
    setShowModal,
    editingCategory,
    setEditingCategory,
    sortConfig,
    requestSort,
    formData,
    setFormData,
    itemsPerPage,
    filteredCategories,
    totalPages,
    paginatedCategories,
    handleSubmit,
    handleDelete,
    formInitState,
  };
}
