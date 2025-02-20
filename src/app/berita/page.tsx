"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useBerita } from "@/hooks/santri/berita/useBerita";
import { useKategori } from "@/hooks/santri/berita/useBeritaKategori";
import LoadMoreSpinner from "@/components/ui/LoadMoreSpinner";
import { useInView } from "react-intersection-observer";

// Fungsi untuk format tanggal
const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(
    new Date(dateString)
  );

// Animation variants untuk preview
const previewVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Komponen PreviewBerita
const PreviewBerita = ({ previewBerita }: { previewBerita: any }) => {
  if (!previewBerita) return null;
  return (
    <AnimatePresence mode="wait">
      <Link href={`/berita/${previewBerita.id}`} className="cursor-pointer">
        <motion.section
          key={previewBerita.id}
          layout
          variants={previewVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="relative h-60 sm:h-96 flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            {previewBerita.gambar && (
              <Image
                src={previewBerita.gambar}
                alt={previewBerita.judul}
                fill
                className="object-cover transform scale-105"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl space-y-4">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg"
            >
              {previewBerita.judul}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-gray-200"
            >
              {previewBerita.ringkasan}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4 text-sm text-gray-300"
            >
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                {previewBerita.kategori?.nama}
              </span>
              <span>{formatDate(previewBerita.created_at)}</span>
            </motion.div>
          </div>
        </motion.section>
      </Link>
    </AnimatePresence>
  );
};

// Komponen CategoryFilter (khusus untuk memilih kategori)
const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
  kategori,
}: {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  kategori: any[];
}) => {
  return (
    <section className="sticky top-24 z-10 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Dropdown untuk mobile */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="sm:hidden w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="Semua">Semua</option>
            {kategori.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))}
          </select>

          {/* Tombol untuk desktop */}
          <div className="hidden sm:flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory("Semua")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === "Semua"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Semua
            </button>
            {kategori.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedCategory(item.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === item.id
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {item.nama}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Komponen NewsCard untuk grid berita
const newsCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const NewsCard = ({ item }: { item: any }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      variants={newsCardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <Link href={`/berita/${item.id}`}>
        <div className="relative h-48 w-full">
          {item.gambar && (
            <Image
              src={item.gambar}
              alt={item.judul}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-600 text-sm px-2 py-1 rounded-full">
              {item.kategori?.nama}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(item.created_at)}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-2 line-clamp-2">
            {item.judul}
          </h2>
          <p className="text-gray-600 line-clamp-3">{item.ringkasan}</p>
        </div>
      </Link>
    </motion.div>
  );
};

// Halaman utama BeritaPage
export default function BeritaPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const { berita, isLoading, setPage, hasMore } = useBerita(selectedCategory);
  const { kategori } = useKategori();

  // Infinite scroll trigger
  const [ref, inView] = useInView({ threshold: 0 });
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, isLoading, setPage]);

  // Ambil berita pertama sebagai preview dan sisanya untuk grid
  const previewBerita = berita.length > 0 ? berita[0] : null;
  const newsGrid = berita.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Preview Berita */}
      {previewBerita && <PreviewBerita previewBerita={previewBerita} />}

      {/* Filter Kategori */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        kategori={kategori}
      />

      {/* Grid Berita */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {newsGrid.map((item, index) => (
              <NewsCard key={`${item.id}-${index}`} item={item} />
            ))}
          </AnimatePresence>
        </div>

        {/* Infinite scroll trigger */}
        <div ref={ref} className="h-10 flex items-center justify-center mt-8">
          {isLoading && <LoadMoreSpinner />}
        </div>

        {/* Empty state */}
        {!isLoading && berita.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl text-gray-600">
              Tidak ada berita untuk kategori ini.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
