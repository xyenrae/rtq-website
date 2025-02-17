import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";

export interface News {
  id: string;
  judul: string;
  tanggal: string;
  konten: string;
  gambar: string;
  kategori_id: string;
  // Hasil join: ambil nama kategori dari tabel kategori
  kategori?: {
    nama: string;
  };
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
  // State untuk filter kategori; default "Semua" menandakan tidak ada filter
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const formInitState = {
    judul: "",
    // Gunakan kategori_id untuk menyimpan id kategori yang dipilih
    kategori_id: "",
    konten: "",
    gambar: "",
    tanggal: new Date().toISOString().split("T")[0],
  };
  const [formData, setFormData] = useState(formInitState);

  const itemsPerPage = 8;

  // Fungsi untuk mengupload file ke Cloudinary ke folder 'rtq-alhikmah/berita'
  const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration not found");
    }
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    // Sesuaikan parameter untuk menentukan folder dan resource_type
    formData.append("folder", "rtq-alhikmah/berita");
    formData.append("resource_type", "image");

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Cloudinary upload failed");
    }
    const data = await response.json();
    return data.secure_url;
  };

  const fetchNews = async () => {
    try {
      let query = supabase
        .from("berita")
        .select("*, kategori:kategori_id (nama)")
        .order("tanggal", { ascending: false });

      if (selectedCategory !== "Semua") {
        query = query.eq("kategori_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      toast.error("Gagal memuat berita");
    }
  };

  // Panggil fetchNews saat pertama kali load dan saat selectedCategory berubah
  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  // Sorting data berita
  const sortedNews = [...news].sort((a, b) => {
    if (!sortConfig) return 0;
    const key = sortConfig.key;
    let aValue: any = a[key];
    let bValue: any = b[key];

    // Jika sorting berdasarkan kategori, bandingkan nama kategori
    if (key === "kategori") {
      aValue = a.kategori?.nama || "";
      bValue = b.kategori?.nama || "";
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
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
      if (editingNews) {
        const { error } = await supabase
          .from("berita")
          .update(formData)
          .eq("id", editingNews.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("berita").insert([formData]);
        if (error) throw error;
      }
      toast.success("Data berhasil disimpan!");
      fetchNews();
      setShowModal(false);
      setFormData(formInitState);
    } catch (error) {
      toast.error("Gagal menyimpan data");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Handle upload gambar menggunakan Cloudinary dengan preview
  const handleImageUpload = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    try {
      const imageUrl = await uploadFileToCloudinary(file);
      setFormData((prev) => ({ ...prev, gambar: imageUrl }));
      toast.success("Gambar berhasil diupload!");
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      toast.error("Gagal mengupload gambar ke Cloudinary");
    }
  };

  // Handle hapus berita
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("berita").delete().eq("id", id);
      if (error) throw error;
      toast.success("Berita berhasil dihapus!");
      fetchNews();
    } catch (error) {
      toast.error("Gagal menghapus berita");
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
