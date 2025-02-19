"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useBerita } from "@/hooks/santri/berita/useBerita";
import { useKategori } from "@/hooks/santri/berita/useBeritaKategori";
import LoadMoreSpinner from "@/components/ui/LoadMoreSpinner";
import NewsCard from "@/components/card/NewsCard";

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
  const { kategori } = useKategori();
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    const currentElement = observerRef.current;
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [isLoading, hasMore, setPage]);

  if (isLoading && berita.length === 0) return <LoadingSkeleton />;

  const previewBerita = berita[0] || null;
  const newsGrid = berita.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Berita */}
      <AnimatePresence mode="wait">
        {previewBerita && (
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
                  {previewBerita.konten}
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
                  <span>{formatDate(previewBerita.tanggal)}</span>
                </motion.div>
              </div>
            </motion.section>
          </Link>
        )}
      </AnimatePresence>

      {/* Filter Kategori */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {/* Dropdown untuk mobile */}
          <div className="sm:hidden w-full">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none bg-white border border-gray-200 text-gray-700 font-medium"
            >
              <option value="Semua">Semua</option>
              {kategori.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
          {/* Tombol untuk desktop */}
          <div className="hidden sm:flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory("Semua")}
              className={`px-5 py-2 rounded-xl font-medium transition duration-300 ${
                selectedCategory === "Semua"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-green-600"
              }`}
            >
              Semua
            </button>
            {kategori.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedCategory(item.id)}
                className={`px-5 py-2 rounded-xl font-medium transition duration-300 ${
                  selectedCategory === item.id
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-green-600"
                }`}
              >
                {item.nama}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Berita */}
      <motion.section
        className="container mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {newsGrid.length > 0 ? (
          newsGrid.map((item, index) => (
            <NewsCard key={`${item.id}-${index}`} item={item} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            Tidak ada berita untuk kategori ini.
          </p>
        )}
      </motion.section>

      {isLoading && berita.length > 0 && <LoadMoreSpinner />}

      <div ref={observerRef} className="h-1" />
    </div>
  );
}

// Skeleton loader sebagai fallback saat loading data
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
          {kategoriDummy.map((_, index) => (
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

const kategoriDummy = [1, 2, 3, 4];
