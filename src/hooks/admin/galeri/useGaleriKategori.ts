"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";

// Interface untuk kategori galeri
export interface GalleryCategory {
  id: string;
  nama: string; // Kolom 'nama' sesuai dengan tabel Supabase
}

export function useGalleryCategory() {
  // State management
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<GalleryCategory | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof GalleryCategory;
    direction: "asc" | "desc";
  } | null>(null);

  // Form state
  const formInitState = { id: "", nama: "" }; // Kolom 'nama' sesuai dengan tabel Supabase
  const [formData, setFormData] = useState<GalleryCategory>(formInitState);

  const itemsPerPage = 10;

  // Fetch data kategori galeri dari Supabase
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("galeri_kategori") // Nama tabel di Supabase
        .select("*", { count: "exact" });

      if (searchTerm) {
        query = query.ilike("nama", `%${searchTerm}%`); // Kolom 'nama' sesuai dengan tabel Supabase
      }

      const { data, error } = await query;

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat kategori");
      toast.error("Gagal memuat kategori");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk mengatur pengurutan
  const requestSort = (key: keyof GalleryCategory) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Mengurutkan kategori berdasarkan konfigurasi pengurutan
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

  const filteredCategories = sortedCategories.filter(
    (category) => category.nama.toLowerCase().includes(searchTerm.toLowerCase()) // Kolom 'nama' sesuai dengan tabel Supabase
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
        // Tambah kategori baru
        const { error } = await supabase
          .from("galeri_kategori") // Nama tabel di Supabase
          .insert([{ nama: formData.nama }]); // Kolom 'nama' sesuai dengan tabel Supabase

        if (error) throw error;
        toast.success("Kategori berhasil ditambahkan");
      }

      // Reset state setelah submit
      setShowModal(false);
      setEditingCategory(null);
      setFormData(formInitState);
      await fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  // Handle hapus kategori
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    try {
      const { error } = await supabase
        .from("galeri_kategori") // Nama tabel di Supabase
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

  // Efek samping untuk memuat data kategori saat searchTerm berubah
  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  // Return semua state dan fungsi yang dibutuhkan
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
