"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Interface untuk berita
interface Berita {
  id: string;
  judul: string;
  tanggal: string;
  konten: string;
  views: number;
  gambar: string;
  kategori?: string;
}

// Fungsi untuk memformat tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
};

// Animasi container dan card
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
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

  // Fetch data berita dari Supabase
  useEffect(() => {
    const fetchBerita = async () => {
      try {
        let query = supabase
          .from("berita")
          .select("*")
          .order("tanggal", { ascending: false });
        if (selectedCategory !== "Semua") {
          query = query.eq("kategori", selectedCategory);
        }
        const { data, error } = await query;
        if (error) throw error;
        setBerita(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching berita:", error);
        setError("Gagal memuat berita. Silakan coba kembali.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBerita();
  }, [selectedCategory]);

  // Daftar kategori
  const categories = [
    "Semua",
    "Pendidikan",
    "Kegiatan",
    "Pengumuman",
    "Prestasi",
  ];

  // Skeleton loading jika data sedang dimuat
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
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
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* News Grid */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {berita.map((item) => (
          <motion.article
            key={item.id}
            variants={cardVariants}
            className="relative group cursor-pointer"
          >
            <Link href={`/berita/${item.id}`}>
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                <Image
                  src={item.gambar || "/placeholder.jpg"}
                  alt={item.judul}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-3">
                  {item.kategori && (
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                      {item.kategori}
                    </span>
                  )}
                  <h3 className="text-xl font-bold line-clamp-2">
                    {item.judul}
                  </h3>
                  <div className="flex items-center text-sm opacity-80">
                    <span>{formatDate(item.tanggal)}</span>
                    <span className="mx-2">•</span>
                    <span>{item.views} views</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </motion.section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Tetap Terhubung</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Dapatkan notifikasi langsung ketika ada berita terbaru dengan
            berlangganan newsletter kami
          </p>
          <div className="flex justify-center gap-4">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="px-6 py-3 rounded-full bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white/80"
            />
            <button className="px-8 py-3 bg-white text-green-600 rounded-full hover:bg-gray-100 transition-colors font-semibold">
              Berlangganan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Komponen Skeleton Loading
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
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
