import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";

// Interface News diperbarui dengan kolom baru: views, ringkasan, dan waktu_baca
export interface News {
  id: string;
  judul: string;
  tanggal: string;
  konten: string;
  gambar: string;
  kategori_id: string;
  views: number; // Kolom baru: jumlah views
  ringkasan: string; // Kolom baru: ringkasan berita
  waktu_baca: number; // Kolom baru: waktu baca dalam menit
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

  // Form initial state diperbarui dengan kolom baru
  const formInitState = {
    judul: "",
    kategori_id: "",
    konten: "",
    gambar: "",
    tanggal: new Date().toISOString().split("T")[0],
    views: 0, // Default views: 0
    ringkasan: "", // Default ringkasan: kosong
    waktu_baca: 0, // Default waktu baca: 0 menit
  };

  const [formData, setFormData] = useState(formInitState);
  const itemsPerPage = 8;

  // Fetch berita dari Supabase
  const fetchNews = async () => {
    try {
      let query = supabase
        .from("berita")
        .select("*, kategori_id:kategori_id")
        .order("tanggal", { ascending: false });

      if (selectedCategory !== "Semua") {
        query = query.eq("kategori_id", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNews(data || []);
    } catch {
      toast.error("Gagal memuat berita");
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  // Sorting data berita
  const sortedNews = [...news].sort((a, b) => {
    if (!sortConfig) return 0;
    const key = sortConfig.key;

    // Handle kategori khusus (nested object)
    let aValue: string | number | undefined =
      key === "kategori" ? a.kategori?.nama : a[key];
    let bValue: string | number | undefined =
      key === "kategori" ? b.kategori?.nama : b[key];

    // Pastikan nilai tidak undefined sebelum membandingkan
    if (aValue === undefined) aValue = "";
    if (bValue === undefined) bValue = "";

    // Bandingkan nilai berdasarkan tipe data
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

  // Filter dan pagination (client-side)
  const filteredNews = sortedNews.filter((item) =>
    item.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle submit form untuk insert/update data berita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Menyimpan data...");
    try {
      const operation = editingNews ? "update" : "insert";
      const { data, error } = editingNews
        ? await supabase
            .from("berita")
            .update(formData)
            .eq("id", editingNews.id)
            .select()
        : await supabase.from("berita").insert([formData]).select();

      if (error) throw error;
      toast.success(
        `Berita berhasil ${editingNews ? "diperbarui" : "dibuat"}!`
      );
      fetchNews();
      setShowModal(false);
      setFormData(formInitState);
      setImagePreview(null);
    } catch (error) {
      toast.error("Gagal menyimpan data");
      // Rollback gambar jika gagal
      if (formData.gambar) {
        const filePath = formData.gambar.split("/").pop();
        await supabase.storage.from("berita-images").remove([filePath || ""]);
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Handle upload gambar ke Supabase Storage
  const handleImageUpload = async (file: File) => {
    try {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);

      // Generate unique filename
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `public/${fileName}`;

      // Upload gambar ke Supabase Storage
      const { data, error } = await supabase.storage
        .from("berita-images")
        .upload(filePath, file);

      if (error) throw error;

      // Dapatkan URL publik
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

  // Handle hapus berita
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;
    const loadingToast = toast.loading("Menghapus berita...");
    try {
      // Hapus gambar terkait jika ada
      if (formData.gambar) {
        const filePath = formData.gambar.split("/").pop();
        await supabase.storage.from("berita-images").remove([filePath || ""]);
      }

      const { error } = await supabase.from("berita").delete().eq("id", id);
      if (error) throw error;
      toast.success("Berita berhasil dihapus!");
      fetchNews();
    } catch (error) {
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
    fetchNews,
    sortedNews,
    filteredNews,
    totalPages,
    paginatedNews,
    handleSubmit,
    handleImageUpload,
    handleDelete,
    formInitState,
    selectedCategory,
    setSelectedCategory,
  };
};
