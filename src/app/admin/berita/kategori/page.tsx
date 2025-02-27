"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiSearch,
  FiChevronsLeft,
  FiChevronsRight,
  FiArrowUp,
  FiArrowDown,
  FiX,
} from "react-icons/fi";
import { useKategori } from "@/hooks/admin/berita/useNewsCategory";
import { toast } from "react-toastify";

const KategoriTable: React.FC = () => {
  const {
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
    error,
  } = useKategori();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Kelola Kategori Berita
          </h1>
          <p className="text-gray-600 mt-1">
            Total {filteredKategories.length} kategori ditemukan
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-6 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kategori..."
              className="pl-10 pr-4 py-2.5 border rounded-xl w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-green-700 transition-colors"
            onClick={() => setShowModal(true)}
          >
            <FiPlus className="text-lg" />
            <span>Tambah Baru</span>
          </motion.button>
        </div>
      </div>

      {/* Table */}
      {filteredKategories.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-5 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("nama")}
                >
                  <div className="flex items-center gap-2">
                    Nama
                    {sortConfig?.key === "nama" &&
                      (sortConfig.direction === "asc" ? (
                        <FiArrowUp className="text-green-600" />
                      ) : (
                        <FiArrowDown className="text-green-600" />
                      ))}
                  </div>
                </th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedKategories.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-5 py-4 max-w-xs">
                    <div className="line-clamp-2">{item.nama}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                        onClick={() => {
                          setEditingKategori(item);
                          setFormData(item);
                          setShowModal(true);
                        }}
                      >
                        <FiEdit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FiTrash size={18} />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada data kategori ditemukan</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-gray-600">
          Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, filteredKategories.length)} dari{" "}
          {filteredKategories.length}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <FiChevronsLeft size={20} />
          </motion.button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3.5 py-1.5 rounded-lg ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <FiChevronsRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white rounded-2xl w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingKategori ? "Edit Kategori" : "Buat Kategori Baru"}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingKategori(null);
                    setFormData(formInitState);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nama Kategori
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl"
                    onClick={() => {
                      setShowModal(false);
                      setEditingKategori(null);
                      setFormData(formInitState);
                    }}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    {editingKategori ? "Simpan Perubahan" : "Buat Kategori"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KategoriTable;
