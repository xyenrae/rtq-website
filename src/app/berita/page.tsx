"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useBerita } from "@/hooks/useBerita";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

// Daftar kategori
const categories = [
  "Semua",
  "Pendidikan",
  "Kegiatan",
  "Pengumuman",
  "Prestasi",
];

// Fungsi untuk memformat tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
};

// Variabel animasi untuk preview dengan persistent effect
const previewVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function BeritaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const { berita, isLoading, error } = useBerita(selectedCategory);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  // Simpan preview berita terakhir yang tampil
  const [previewBerita, setPreviewBerita] = useState<any>(null);
  // Flag untuk mendeteksi initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Update previewBerita saat data baru sudah siap
  useEffect(() => {
    if (!isLoading && berita.length > 0) {
      setPreviewBerita(berita[0]);
      if (isInitialLoad) setIsInitialLoad(false);
    }
  }, [isLoading, berita, isInitialLoad]);

  // Efek untuk menampilkan tombol scroll ke atas
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (error) return <ErrorMessage message={error} />;
  // Pada initial load, tampilkan skeleton loader
  if (isInitialLoad) return <LoadingSkeleton />;

  // Untuk card berita, ambil tiga item setelah preview
  const cardBerita = berita.slice(1, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section dengan Persistent Preview */}
      <AnimatePresence mode="wait">
        {previewBerita && (
          <motion.section
            key={selectedCategory} // Memicu animasi saat kategori berubah
            variants={previewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="relative h-96 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              {previewBerita.gambar && (
                <Image
                  src={previewBerita.gambar}
                  alt="Featured News"
                  fill
                  className="object-cover transform scale-105"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
            <div className="relative z-10 text-center px-4 max-w-4xl space-y-4">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg"
              >
                Informasi Terkini
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-200"
              >
                Tetap update dengan perkembangan terbaru dari komunitas kami
              </motion.p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Category Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {/* Mobile: Dropdown */}
          <div className="sm:hidden w-full">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-6 py-3 rounded-xl outline-none bg-white border-2 border-gray-200 text-gray-700 font-medium"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* Desktop: Buttons */}
          <div className="hidden sm:flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-green-600 shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Card Berita Grid (3 item) */}
      <motion.section
        className="container mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {cardBerita.map((item, index) => (
          <motion.article
            key={`${item.id}-${index}`}
            className="relative group cursor-pointer bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col sm:flex-row"
          >
            <Link href={`/berita/${item.id}`} className="flex flex-1">
              {/* Gambar */}
              <div className="relative w-full sm:w-1/3 h-32 sm:h-auto">
                <Image
                  src={item.gambar || "/placeholder.jpg"}
                  alt={item.judul}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {/* Konten */}
              <div className="p-2 sm:p-4 flex flex-col justify-between flex-1">
                <div>
                  {item.kategori && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium mb-1">
                      {item.kategori}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {item.judul}
                  </h3>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{formatDate(item.tanggal)}</span>
                  <span className="mx-2">•</span>
                  <span>{item.views} views</span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </motion.section>

      {/* Tombol Scroll ke Atas */}
      {showScrollToTop && <ScrollToTopButton />}
    </div>
  );
}

// Komponen Skeleton Loader untuk initial load (tampilan konsisten untuk desktop dan mobile)
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 animate-pulse">
    <div className="container mx-auto px-4 py-8">
      {/* Skeleton untuk Hero Preview */}
      <div className="relative h-96 mb-8 bg-gray-300 rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>
      {/* Skeleton untuk Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <div className="sm:hidden w-full h-12 bg-gray-300 rounded-xl" />
        <div className="hidden sm:flex gap-4">
          {categories.map((_, index) => (
            <div key={index} className="w-24 h-10 bg-gray-300 rounded-xl" />
          ))}
        </div>
      </div>
      {/* Skeleton untuk Card Berita (3 item) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="w-full sm:w-1/3 h-32 sm:h-auto bg-gray-300" />
            <div className="flex-1 p-4 space-y-4">
              <div className="h-4 bg-gray-300 rounded w-1/3" />
              <div className="h-6 bg-gray-300 rounded w-4/5" />
              <div className="h-4 bg-gray-300 rounded w-2/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Komponen Pesan Error
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-red-50 border border-red-200 p-8 rounded-2xl max-w-md text-center">
      <div className="text-red-600 text-5xl mb-4">⚠️</div>
      <h3 className="text-red-600 text-xl font-semibold mb-4">{message}</h3>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  </div>
);
