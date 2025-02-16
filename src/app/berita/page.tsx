"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useBerita } from "@/hooks/useBerita";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import LoadMoreSpinner from "@/components/ui/LoadMoreSpinner";

const categories = [
  "Semua",
  "Pendidikan",
  "Kegiatan",
  "Pengumuman",
  "Prestasi",
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
};

const previewVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
};

export default function BeritaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const { berita, isLoading, setPage, hasMore } = useBerita(selectedCategory);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const [persistentBerita, setPersistentBerita] = useState(berita);

  useEffect(() => {
    if (berita.length > 0) {
      setPersistentBerita(berita);
    }
  }, [berita]);

  const effectiveBerita = berita.length > 0 ? berita : persistentBerita;

  const previewBerita = effectiveBerita[0] || null;

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading) return;
    const currentObserverElement = observerRef.current; // salin ke variabel lokal
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );
    if (currentObserverElement) {
      observer.observe(currentObserverElement);
    }
    return () => {
      if (currentObserverElement) {
        observer.unobserve(currentObserverElement);
      }
    };
  }, [isLoading, hasMore, setPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading && effectiveBerita.length === 0) return <LoadingSkeleton />;

  const newsGrid = effectiveBerita.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview berita */}
      <AnimatePresence mode="wait">
        {previewBerita && (
          <Link href={`/berita/${previewBerita.id}`} className="cursor-pointer">
            <motion.section
              key={previewBerita.id} // gunakan id preview sebagai key
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
                  {previewBerita.konten}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-4 text-sm text-gray-300"
                >
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                    {previewBerita.kategori}
                  </span>
                  <span>{formatDate(previewBerita.tanggal)}</span>
                </motion.div>
              </div>
            </motion.section>
          </Link>
        )}
      </AnimatePresence>

      {/* Filter kategori */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {/* Dropdown untuk mobile */}
          <div className="sm:hidden w-full">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none bg-white border border-gray-200 text-gray-700 font-medium"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* Tombol untuk desktop */}
          <div className="hidden sm:flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-xl font-medium transition duration-300 ${
                  selectedCategory === category
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-green-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid berita */}
      <motion.section
        className="container mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {newsGrid.map((item, index) => (
          <motion.article
            key={`${item.id}-${index}`}
            className="group cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col sm:flex-row"
          >
            <Link href={`/berita/${item.id}`} className="flex flex-1">
              {/* Gambar */}
              <div className="relative w-34 sm:w-1/3 h-34 bg-gray-300">
                <Image
                  src={item.gambar || "/placeholder.jpg"}
                  alt={item.judul}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {/* Konten */}
              <div className="py-2 px-3 flex flex-col justify-between flex-1">
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
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span>{formatDate(item.tanggal)}</span>
                  <span className="mx-2">•</span>
                  <span>{item.views} views</span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </motion.section>

      {/* Loading indicator saat infinite scroll fetch data */}
      {isLoading && effectiveBerita.length > 0 && <LoadMoreSpinner />}

      {/* Sentinel element untuk infinite scroll */}
      <div ref={observerRef} className="h-1" />

      {showScrollToTop && <ScrollToTopButton />}
    </div>
  );
}

// Skeleton loader yang disesuaikan untuk tampilan mobile dan desktop
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 animate-pulse">
    <div className="container mx-auto px-4 py-8">
      {/* Skeleton untuk Hero Preview */}
      <div className="relative h-60 sm:h-96 mb-6 bg-gray-300 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      {/* Skeleton untuk Filter Kategori */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <div className="w-full sm:hidden h-10 bg-gray-300 rounded-xl" />
        <div className="hidden sm:flex gap-4">
          {categories.map((_, index) => (
            <div key={index} className="w-20 h-10 bg-gray-300 rounded-xl" />
          ))}
        </div>
      </div>
      {/* Skeleton untuk Grid Berita */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="group cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-row"
          >
            <div className="relative w-32 sm:w-1/3 h-32 bg-gray-300" />
            <div className="p-4 flex flex-col justify-between flex-1">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-300 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
