"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { supabase } from "@/lib/supabase/client";

interface News {
  id: string;
  judul: string;
  tanggal: string;
  konten: string;
  gambar: string;
  kategori: string;
}

const NewsTable = () => {
  const [news, setNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const itemsPerPage = 5;

  // Form state
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "",
    konten: "",
    gambar: "",
    tanggal: new Date().toISOString().split("T")[0],
  });

  // Fetch data
  const fetchNews = async () => {
    const { data } = await supabase
      .from("berita")
      .select("*")
      .order("tanggal", { ascending: false });

    if (data) setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle Search and Pagination
  const filteredNews = news.filter((item) =>
    item.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingNews) {
      // Update existing
      const { error } = await supabase
        .from("berita")
        .update(formData)
        .eq("id", editingNews.id);

      if (!error) fetchNews();
    } else {
      // Create new
      const { error } = await supabase.from("berita").insert([formData]);

      if (!error) fetchNews();
    }

    setShowModal(false);
    setFormData({
      judul: "",
      kategori: "",
      konten: "",
      gambar: "",
      tanggal: new Date().toISOString().split("T")[0],
    });
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      const { error } = await supabase.from("berita").delete().eq("id", id);

      if (!error) fetchNews();
    }
  };

  // Handle Edit
  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData(newsItem);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Kelola Berita
        </h2>

        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari berita..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-4 text-gray-400" />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <FiPlus /> Tambah Baru
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Judul</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                Kategori
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                Tanggal
              </th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {paginatedNews.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{item.judul}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {item.kategori}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {new Date(item.tanggal).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-500 hover:text-blue-600 p-2"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <FiTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <FiChevronLeft size={20} />
        </button>

        <span>
          Halaman {currentPage} dari {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* Modal Form */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {editingNews ? "Edit Berita" : "Tambah Berita Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formData.judul}
                  onChange={(e) =>
                    setFormData({ ...formData, judul: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Kategori
                  </label>
                  <select
                    required
                    className="w-full p-2 border rounded-lg"
                    value={formData.kategori}
                    onChange={(e) =>
                      setFormData({ ...formData, kategori: e.target.value })
                    }
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Artikel">Artikel</option>
                    <option value="Berita">Berita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={formData.tanggal}
                    onChange={(e) =>
                      setFormData({ ...formData, tanggal: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gambar</label>
                <input
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const { data } = await supabase.storage
                        .from("berita-images")
                        .upload(`/${Date.now()}-${file.name}`, file);

                      if (data) {
                        setFormData({ ...formData, gambar: data.path });
                      }
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Konten</label>
                <textarea
                  required
                  rows={6}
                  className="w-full p-2 border rounded-lg"
                  value={formData.konten}
                  onChange={(e) =>
                    setFormData({ ...formData, konten: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingNews(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  {editingNews ? "Simpan Perubahan" : "Tambah Berita"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NewsTable;
