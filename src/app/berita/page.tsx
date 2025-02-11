"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

// Interface untuk berita
interface Berita {
  id: string;
  judul: string;
  tanggal: string;
  konten: string;
  views: number;
  gambar: string;
  kategori?: string; // Kolom kategori opsional
}

// Fungsi untuk memformat tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
};

// Variabel animasi
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

export default function BeritaPage() {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [page, setPage] = useState(1); // Halaman saat ini
  const [hasMore, setHasMore] = useState(true); // Apakah ada data lagi?
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Fungsi untuk memanggil data dari Supabase
  const fetchBerita = async (reset: boolean = false) => {
    try {
      // Jika reset, kita hapus data lama dan set ulang status pagination
      if (reset) {
        setBerita([]);
        setHasMore(true);
      }

      let query = supabase
        .from("berita")
        .select("*")
        .order("tanggal", { ascending: false })
        .range((page - 1) * 6, page * 6 - 1);

      if (selectedCategory !== "Semua") {
        query = query.eq("kategori", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Jika reset, langsung set data; jika tidak, gabungkan dengan data lama
      if (reset) {
        setBerita(data);
      } else {
        setBerita((prev) => [...prev, ...data]);
      }

      // Jika data yang didapat kurang dari 6, tidak ada lagi data selanjutnya
      if (data.length < 6) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching berita:", err);
      setError("Gagal memuat berita. Silakan coba kembali.");
    } finally {
      setIsLoading(false);
    }
  };

  // Daftar kategori
  const categories = [
    "Semua",
    "Pendidikan",
    "Kegiatan",
    "Pengumuman",
    "Prestasi",
  ];

  // Saat kategori berubah, reset halaman ke 1
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [selectedCategory]);

  // Efek untuk fetch data berdasarkan perubahan page atau selectedCategory
  useEffect(() => {
    if (page === 1) {
      fetchBerita(true); // Reset data ketika page = 1
    } else {
      fetchBerita(false); // Tambahkan data untuk infinite scroll
    }
  }, [page, selectedCategory]);

  // Ref untuk observer infinite scroll
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efek infinite scroll
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading]);

  // Tampilkan skeleton atau error bila diperlukan
  if (isLoading && page === 1) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {berita[0]?.gambar && (
            <Image
              src={berita[0].gambar}
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
      </section>

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

      {/* News Grid */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
      >
        {berita.map((item, index) => (
          // Jika ternyata masih ada kemungkinan duplikasi id, gunakan composite key:
          <motion.article
            key={`${item.id}-${index}`}
            variants={cardVariants}
            className="relative group cursor-pointer bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col sm:flex-row"
          >
            <Link href={`/berita/${item.id}`} className="flex flex-1">
              {/* Gambar */}
              <div className="relative w-4/12 sm:w-1/3 h-32 sm:h-auto">
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

        {/* Loader untuk infinite scroll */}
        {hasMore && (
          <div ref={loaderRef} className="col-span-full text-center py-4">
            <p className="text-gray-500">Memuat lebih banyak...</p>
          </div>
        )}
      </motion.section>

      {/* Tombol Scroll ke Atas */}
      {showScrollToTop && <ScrollToTopButton />}
    </div>
  );
}

// Komponen Skeleton Loading
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="relative h-80 rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
              <div className="h-4 w-1/3 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-4/5 bg-gray-300 rounded"></div>
              <div className="h-4 w-2/5 bg-gray-300 rounded"></div>
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
