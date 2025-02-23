"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";

export interface News {
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
}

interface SortConfig {
  key: keyof News;
  direction: "asc" | "desc";
}

export const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Form initial state with automated fields
  const formInitState = {
    judul: "",
    konten: "",
    gambar: "",
    views: 0,
    kategori_id: "",
    ringkasan: "",
    waktu_baca: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const [formData, setFormData] = useState(formInitState);
  const itemsPerPage = 8;

  // Calculate reading time based on content length
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Fetch news from Supabase, dibungkus dalam useCallback agar stabil sebagai dependency
  const fetchNews = useCallback(async () => {
    try {
      let query = supabase
        .from("berita")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedCategory !== "Semua") {
        query = query.eq("kategori_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setNews(data || []);
    } catch {
      toast.error("Gagal memuat berita");
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Auto-update reading time when content changes
  useEffect(() => {
    if (formData.konten) {
      const readingTime = calculateReadingTime(formData.konten);
      setFormData((prev) => ({
        ...prev,
        waktu_baca: readingTime,
      }));
    }
  }, [formData.konten]);

  // Sorting logic
  const sortedNews = [...news].sort((a, b) => {
    if (!sortConfig) return 0;
    const key = sortConfig.key;

    let aValue = a[key];
    let bValue = b[key];

    if (aValue === undefined) aValue = "";
    if (bValue === undefined) bValue = "";

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const requestSort = (key: keyof News) => {
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

  // Filter and pagination
  const filteredNews = sortedNews.filter((item) =>
    item.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.gambar === "") {
      toast.error(`Gambar wajib diisi`);
      return;
    }
    const loadingToast = toast.loading("Menyimpan data...");

    try {
      const now = new Date().toISOString();
      const updatedFormData = {
        ...formData,
        updated_at: now,
        created_at: editingNews ? formData.created_at : now,
      };

      const { error } = editingNews
        ? await supabase
            .from("berita")
            .update(updatedFormData)
            .eq("id", editingNews.id)
            .select()
        : await supabase.from("berita").insert([updatedFormData]).select();

      if (error) throw error;

      toast.success(
        `Berita berhasil ${editingNews ? "diperbarui" : "dibuat"}!`
      );
      fetchNews();
      setShowModal(false);
      setFormData(formInitState);
      setImagePreview(null);
      setEditingNews(null);
    } catch {
      toast.error("Gagal menyimpan data");
      if (formData.gambar) {
        const filePath = formData.gambar.split("/").pop();
        await supabase.storage.from("berita-images").remove([filePath || ""]);
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `public/${fileName}`;

      const { data, error } = await supabase.storage
        .from("berita-images")
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("berita-images")
        .getPublicUrl(data.path);

      setFormData((prev) => ({
        ...prev,
        gambar: publicUrlData.publicUrl || "",
      }));

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Gagal mengupload gambar");
      throw error;
    }
  };

  // Handle news deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;

    const loadingToast = toast.loading("Menghapus berita...");
    try {
      const newsToDelete = news.find((item) => item.id === id);

      if (newsToDelete?.gambar) {
        const filePath = newsToDelete.gambar.split("/").pop();
        await supabase.storage.from("berita-images").remove([filePath || ""]);
      }

      const { error } = await supabase.from("berita").delete().eq("id", id);
      if (error) throw error;

      toast.success("Berita berhasil dihapus!");
      fetchNews();
    } catch {
      toast.error("Gagal menghapus berita");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return {
    news,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    showModal,
    setShowModal,
    editingNews,
    setEditingNews,
    sortConfig,
    requestSort,
    imagePreview,
    setImagePreview,
    formData,
    setFormData,
    itemsPerPage,
    filteredNews,
    totalPages,
    paginatedNews,
    handleSubmit,
    handleImageUpload,
    handleDelete,
    formInitState,
    selectedCategory,
    setSelectedCategory,
    fetchNews,
  };
};
