"use client";
import { useState, useRef, useEffect } from "react";
import { useBerita } from "@/hooks/santri/berita/useBerita";
import { useKategori } from "@/hooks/santri/berita/useBeritaKategori";
import { motion } from "framer-motion";
import LoadMoreSpinner from "@/components/ui/LoadMoreSpinner";
import CardBerita from "@/components/card/CardBerita";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function BeritaPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeTab, setActiveTab] = useState("terbaru");
  const { berita, isLoading, setPage, hasMore } = useBerita(selectedCategory);
  const { kategori } = useKategori();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Tambahkan opsi "Semua" secara manual ke data kategori
  const categories = [{ id: "", nama: "Semua" }, ...kategori];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, setPage]);

  const sortedBerita = [...berita].sort((a, b) => {
    if (activeTab === "terpopuler") {
      return b.views - a.views;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-white shadow-sm"
      >
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Berita & Informasi
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Temukan informasi terkini seputar kegiatan akademik, prestasi siswa,
            dan pengumuman penting lainnya di lembaga kami.
          </p>
        </div>
      </motion.div>

      {/* Filter & Tabs Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all
                  ${
                    selectedCategory === category.id
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                  }`}
              >
                {category.nama}
              </button>
            ))}
          </div>

          {/* View Tabs */}
          <div className="flex gap-4 bg-white rounded-lg p-1">
            <button
              onClick={() => setActiveTab("terbaru")}
              className={`px-4 py-2 rounded-lg text-sm transition-all
                ${
                  activeTab === "terbaru"
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Terbaru
            </button>
            <button
              onClick={() => setActiveTab("terpopuler")}
              className={`px-4 py-2 rounded-lg text-sm transition-all
                ${
                  activeTab === "terpopuler"
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Terpopuler
            </button>
          </div>
        </div>

        {/* News Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedBerita.map((item) => (
            <CardBerita key={item.id} item={item} />
          ))}
        </motion.div>

        {/* Loading & Observer */}
        <div ref={observerTarget} className="h-10 mt-8">
          {isLoading && <LoadMoreSpinner />}
        </div>
      </div>
    </div>
  );
}
