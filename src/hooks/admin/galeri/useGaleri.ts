"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import { z } from "zod";
import { getImageSize } from "react-image-size"; // pastikan library ini sudah terinstall

// Interface untuk item galeri (sudah termasuk width dan height)
export interface GalleryItem {
  id: string;
  galeri_kategori_id: string;
  image: string;
  created_at: string;
  width: number;
  height: number;
  galeri_kategori?: {
    nama: string;
  };
}

// Interface untuk konfigurasi pengurutan
interface SortConfig {
  key: keyof GalleryItem;
  direction: "asc" | "desc";
}

// Zod schema untuk validasi data form (sudah menambahkan width dan height)
export const galleryItemSchema = z.object({
  galeri_kategori_id: z.string().min(1, "Kategori harus dipilih"),
  image: z.string().min(1, "Gambar harus diupload"),
  width: z.number().gt(0, "Lebar gambar harus lebih dari 0"),
  height: z.number().gt(0, "Tinggi gambar harus lebih dari 0"),
});

// Custom hook untuk mengelola galeri
export function useGallery() {
  // State untuk data galeri dan kategori
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; nama: string }[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const itemsPerPage = 12;

  // Form state; pastikan menambahkan width dan height
  const formInitState = {
    galeri_kategori_id: "",
    image: "",
    width: 0,
    height: 0,
  };
  const [formData, setFormData] = useState<Partial<GalleryItem>>(formInitState);

  // Fungsi untuk mengambil data galeri dari Supabase (join dengan kategori)
  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from("galeri")
        .select("*, galeri_kategori:galeri_kategori_id(nama)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setGalleryItems(data || []);
    } catch {
      toast.error("Gagal memuat galeri");
    }
  };

  // Fungsi untuk mengambil data kategori
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("galeri_kategori")
        .select("id, nama");
      if (error) throw error;
      setCategories(data || []);
    } catch {
      toast.error("Gagal memuat kategori");
    }
  };

  // Ambil data galeri dan kategori saat komponen dirender atau saat kategori berubah
  useEffect(() => {
    fetchGallery();
    fetchCategories();
  }, [selectedCategory]);

  // Fungsi untuk pengurutan data
  const requestSort = (key: keyof GalleryItem) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Mengurutkan data galeri berdasarkan konfigurasi
  const sortedItems = [...galleryItems].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (key === "created_at") {
      const timeA = new Date(a[key]).getTime();
      const timeB = new Date(b[key]).getTime();
      return direction === "asc" ? timeA - timeB : timeB - timeA;
    }
    if (key === "galeri_kategori") {
      const nameA = a.galeri_kategori?.nama || "";
      const nameB = b.galeri_kategori?.nama || "";
      return direction === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    const valueA = a[key];
    const valueB = b[key];
    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // Filter data berdasarkan pencarian (berdasarkan nama kategori)
  const filteredItems = sortedItems.filter((item) =>
    item.galeri_kategori?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fungsi untuk submit form (tambah atau edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = galleryItemSchema.safeParse(formData);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0] || "Validasi gagal";
      toast.error(firstError);
      return;
    }
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("galeri")
          .update(formData)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Item berhasil diperbarui");
      } else {
        const { error } = await supabase.from("galeri").insert([formData]);
        if (error) throw error;
        toast.success("Item berhasil ditambahkan");
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData(formInitState);
      setImagePreview(null);
      await fetchGallery();
    } catch {
      toast.error("Gagal menyimpan data");
      if (formData.image) {
        const filePath = formData.image.split("/").pop();
        await supabase.storage.from("galeri-images").remove([filePath || ""]);
      }
    }
  };

  // Fungsi untuk mengupload gambar dan otomatis mendapatkan width & height menggunakan react-image-size
  const handleImageUpload = async (file: File) => {
    // Tampilkan toast loading dan simpan id-nya
    const toastId = toast.loading("Sedang mengupload gambar...");
    try {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `public/${fileName}`;
      const { data, error } = await supabase.storage
        .from("galeri-images")
        .upload(filePath, file);
      if (error) throw error;
      if (!data?.path) {
        throw new Error("Path tidak tersedia");
      }
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/galeri-images/${data.path}`;
      if (!publicUrl || publicUrl.trim() === "") {
        throw new Error("Gambar URL kosong");
      }
      // Menggunakan react-image-size untuk mendapatkan dimensi gambar
      const { width, height } = await getImageSize(publicUrl);
      // Update formData dengan image URL serta width dan height
      setFormData((prev) => ({ ...prev, image: publicUrl, width, height }));
      // Update toast menjadi sukses
      toast.update(toastId, {
        render: "Gambar berhasil diupload",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      return publicUrl;
    } catch {
      // Update toast menjadi error
      toast.update(toastId, {
        render: "Gagal mengupload gambar",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      throw new Error("Gagal mengupload gambar");
    }
  };

  // Fungsi untuk menghapus item galeri
  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return;
    try {
      if (imageUrl) {
        const filePath = imageUrl.replace(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`,
          ""
        );
        if (filePath) {
          await supabase.storage.from("galeri-images").remove([filePath]);
        }
      }
      const { error } = await supabase.from("galeri").delete().eq("id", id);
      if (error) throw error;
      toast.success("Item berhasil dihapus");
      await fetchGallery();
    } catch {
      toast.error("Gagal menghapus item");
    }
  };

  return {
    galleryItems,
    categories,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    showModal,
    setShowModal,
    editingItem,
    setEditingItem,
    sortConfig,
    requestSort,
    imagePreview,
    setImagePreview,
    formData,
    setFormData,
    itemsPerPage,
    filteredItems,
    totalPages,
    paginatedItems,
    handleSubmit,
    handleImageUpload,
    handleDelete,
    formInitState,
    selectedCategory,
    setSelectedCategory,
  };
}
