"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export interface Kelas {
  id: string;
  judul: string;
  short_desc: string;
  full_desc: string;
  image_url: string;
}

interface SortConfig {
  key: keyof Kelas;
  direction: "asc" | "desc";
}

export const useKelas = () => {
  const [kelases, setKelases] = useState<Kelas[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form initial state
  const formInitState = {
    judul: "",
    short_desc: "",
    full_desc: "",
    image_url: "",
  };
  const [formData, setFormData] = useState(formInitState);
  const itemsPerPage = 8;
  const supabase = createClient();

  // Fetch data kelas dari Supabase
  const fetchKelases = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("kelas").select("*");
      if (error) throw error;
      setKelases(data || []);
    } catch (error) {
      toast.error("Gagal memuat data kelas");
      throw error;
    }
  }, [supabase]);

  useEffect(() => {
    fetchKelases();
  }, [fetchKelases]);

  // Sorting
  const sortedKelases = [...kelases].sort((a, b) => {
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
    }
    return 0;
  });

  const requestSort = (key: keyof Kelas) => {
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

  // Filter data berdasarkan judul
  const filteredKelases = sortedKelases.filter((kelas) =>
    kelas.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredKelases.length / itemsPerPage);
  const paginatedKelases = filteredKelases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle form submission: tambah atau update kelas
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.image_url === "") {
      toast.error("Gambar wajib diisi");
      return;
    }
    const loadingToast = toast.loading("Menyimpan data...");

    try {
      const updatedFormData = { ...formData };

      if (editingKelas) {
        // Update kelas
        const { error } = await supabase
          .from("kelas")
          .update(updatedFormData)
          .eq("id", editingKelas.id)
          .select();
        if (error) throw error;
        toast.success("Kelas berhasil diperbarui!");
      } else {
        // Insert kelas baru
        const { error } = await supabase
          .from("kelas")
          .insert([updatedFormData])
          .select();
        if (error) throw error;
        toast.success("Kelas berhasil ditambahkan!");
      }
      fetchKelases();
      setShowModal(false);
      setFormData(formInitState);
      setImagePreview(null);
      setEditingKelas(null);
    } catch (error) {
      toast.error("Gagal menyimpan data");
      if (formData.image_url) {
        const filePath = formData.image_url.split("/").pop();
        await supabase.storage.from("kelas-images").remove([filePath || ""]);
      }
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Handle upload gambar ke bucket "kelas-images"
  const handleImageUpload = async (file: File) => {
    try {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `public/${fileName}`;

      const { data, error } = await supabase.storage
        .from("kelas-images")
        .upload(filePath, file);
      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("kelas-images")
        .getPublicUrl(data.path);

      setFormData((prev) => ({
        ...prev,
        image_url: publicUrlData.publicUrl || "",
      }));

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Gagal mengupload gambar");
      throw error;
    }
  };

  // Handle hapus kelas
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;

    const loadingToast = toast.loading("Menghapus kelas...");
    try {
      const kelasToDelete = kelases.find((item) => item.id === id);
      if (kelasToDelete?.image_url) {
        const filePath = kelasToDelete.image_url.split("/").pop();
        await supabase.storage.from("kelas-images").remove([filePath || ""]);
      }

      const { error } = await supabase.from("kelas").delete().eq("id", id);
      if (error) throw error;

      toast.success("Kelas berhasil dihapus!");
      fetchKelases();
    } catch (error) {
      toast.error("Gagal menghapus kelas");
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return {
    kelases,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    showModal,
    setShowModal,
    editingKelas,
    setEditingKelas,
    sortConfig,
    requestSort,
    imagePreview,
    setImagePreview,
    formData,
    setFormData,
    itemsPerPage,
    filteredKelases,
    totalPages,
    paginatedKelases,
    handleSubmit,
    handleImageUpload,
    handleDelete,
    formInitState,
    fetchKelases,
  };
};
