"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export interface Teacher {
  id: string;
  nama: string;
  peran: string;
  image_url: string;
}

interface SortConfig {
  key: keyof Teacher;
  direction: "asc" | "desc";
}

export const useGuru = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form initial state
  const formInitState = {
    nama: "",
    peran: "",
    image_url: "",
  };
  const [formData, setFormData] = useState(formInitState);
  const itemsPerPage = 8;
  const supabase = createClient();

  // Fetch data guru dari Supabase
  const fetchTeachers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("guru").select("*");
      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      toast.error("Gagal memuat data guru");
      throw error;
    }
  }, [supabase]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Sorting
  const sortedTeachers = [...teachers].sort((a, b) => {
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

  const requestSort = (key: keyof Teacher) => {
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

  // Filter berdasarkan nama guru
  const filteredTeachers = sortedTeachers.filter((teacher) =>
    teacher.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle form submission: tambah atau update guru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.image_url === "") {
      toast.error("Gambar wajib diisi");
      return;
    }
    const loadingToast = toast.loading("Menyimpan data...");

    try {
      const updatedFormData = { ...formData };

      if (editingTeacher) {
        // Update guru
        const { error } = await supabase
          .from("guru")
          .update(updatedFormData)
          .eq("id", editingTeacher.id)
          .select();
        if (error) throw error;
        toast.success("Guru berhasil diperbarui!");
      } else {
        // Insert guru baru
        const { error } = await supabase
          .from("guru")
          .insert([updatedFormData])
          .select();
        if (error) throw error;
        toast.success("Guru berhasil ditambahkan!");
      }
      fetchTeachers();
      setShowModal(false);
      setFormData(formInitState);
      setImagePreview(null);
      setEditingTeacher(null);
    } catch (error) {
      toast.error("Gagal menyimpan data");
      if (formData.image_url) {
        const filePath = formData.image_url.split("/").pop();
        await supabase.storage.from("guru-images").remove([filePath || ""]);
      }
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Handle upload gambar ke bucket "guru-images"
  const handleImageUpload = async (file: File) => {
    try {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `public/${fileName}`;

      const { data, error } = await supabase.storage
        .from("guru-images")
        .upload(filePath, file);
      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("guru-images")
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

  // Handle hapus guru
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus guru ini?")) return;

    const loadingToast = toast.loading("Menghapus guru...");
    try {
      const teacherToDelete = teachers.find((item) => item.id === id);
      if (teacherToDelete?.image_url) {
        const filePath = teacherToDelete.image_url.split("/").pop();
        await supabase.storage.from("guru-images").remove([filePath || ""]);
      }

      const { error } = await supabase.from("guru").delete().eq("id", id);
      if (error) throw error;

      toast.success("Guru berhasil dihapus!");
      fetchTeachers();
    } catch (error) {
      toast.error("Gagal menghapus guru");
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return {
    teachers,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    showModal,
    setShowModal,
    editingTeacher,
    setEditingTeacher,
    sortConfig,
    requestSort,
    imagePreview,
    setImagePreview,
    formData,
    setFormData,
    itemsPerPage,
    filteredTeachers,
    totalPages,
    paginatedTeachers,
    handleSubmit,
    handleImageUpload,
    handleDelete,
    formInitState,
    fetchTeachers,
  };
};
