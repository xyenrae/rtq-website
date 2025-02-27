"use client";
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
  FiImage,
} from "react-icons/fi";
import Image from "next/image";
import { useGuru } from "@/hooks/admin/guru/useGuru";

const GuruTable = () => {
  const {
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
  } = useGuru();

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Guru</h1>
          <p className="text-gray-600 mt-1">
            Total {filteredTeachers.length} guru ditemukan
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-6 text-gray-400" />
            <input
              type="text"
              placeholder="Cari guru..."
              className="pl-10 pr-4 py-2.5 border rounded-xl w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-green-700 transition-colors"
            onClick={() => {
              setShowModal(true);
              setEditingTeacher(null);
              setFormData(formInitState);
              setImagePreview(null);
            }}
          >
            <FiPlus className="text-lg" />
            <span>Tambah Guru</span>
          </motion.button>
        </div>
      </div>

      {/* Table */}
      {filteredTeachers.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["nama", "peran"].map((key) => (
                  <th
                    key={key}
                    className="px-5 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort(key as keyof typeof formData)}
                  >
                    <div className="flex items-center gap-2">
                      {key === "nama" ? "Nama" : "Peran"}
                      {sortConfig?.key === key &&
                        (sortConfig.direction === "asc" ? (
                          <FiArrowUp className="text-green-600" />
                        ) : (
                          <FiArrowDown className="text-green-600" />
                        ))}
                    </div>
                  </th>
                ))}
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  Gambar
                </th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">
                      {teacher.nama}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{teacher.peran}</td>
                  <td className="px-5 py-4">
                    {teacher.image_url ? (
                      <Image
                        src={teacher.image_url}
                        alt={teacher.nama}
                        width={80}
                        height={80}
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada gambar</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50"
                        onClick={() => {
                          setEditingTeacher(teacher);
                          setFormData(teacher);
                          setShowModal(true);
                          setImagePreview(teacher.image_url);
                        }}
                      >
                        <FiEdit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                        onClick={() => handleDelete(teacher.id)}
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
          <p className="text-gray-500">Tidak ada data guru ditemukan</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-gray-600">
          Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, filteredTeachers.length)} dari{" "}
          {filteredTeachers.length}
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingTeacher ? "Edit Guru" : "Buat Guru Baru"}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingTeacher(null);
                    setFormData(formInitState);
                    setImagePreview(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nama Guru
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

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Peran Guru
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={formData.peran}
                        onChange={(e) =>
                          setFormData({ ...formData, peran: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Upload Gambar
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center aspect-video">
                        {imagePreview ? (
                          <>
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              width={300}
                              height={300}
                              className="w-full h-full object-cover rounded-lg mb-4"
                              onError={() => setImagePreview(null)}
                            />
                            <label className="cursor-pointer text-sm text-green-600 hover:text-green-700">
                              Ganti Gambar
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      await handleImageUpload(file);
                                    } catch {
                                      setImagePreview(null);
                                    }
                                  }
                                }}
                              />
                            </label>
                          </>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center text-center">
                            <FiImage className="text-3xl text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              Seret gambar atau klik untuk upload
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl"
                    onClick={() => {
                      setShowModal(false);
                      setEditingTeacher(null);
                      setFormData(formInitState);
                      setImagePreview(null);
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
                    {editingTeacher ? "Simpan Perubahan" : "Tambah Guru"}
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

export default GuruTable;
