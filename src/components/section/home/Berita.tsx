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
  gambar?: string;
  kategori?: string;
}

// Fungsi untuk memformat tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
};

// Animasi untuk card
const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export default function Berita() {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data berita dari Supabase
  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const { data, error } = await supabase
          .from("berita")
          .select("*")
          .order("tanggal", { ascending: false })
          .limit(3); // Menampilkan 3 berita terbaru

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
  }, []);

  // Skeleton Loader
  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-start">
          Berita Terbaru
        </h1>
        <p className="mt-4 text-gray-600 text-start">
          Kami menyediakan berita terkini tentang program belajar, kegiatan
          sehari-hari, pengumuman penting, dan pencapaian dari Santri RTQ
          Al-Hikmah.
        </p>
      </motion.div>

      {/* Berita Grid */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
      >
        {berita.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col sm:flex-row"
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
                  {/* Kategori */}
                  {item.kategori && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium mb-1">
                      {item.kategori}
                    </span>
                  )}
                  {/* Judul dengan line-clamp */}
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {item.judul}
                  </h3>
                </div>
                {/* Tanggal */}
                <div className="flex justify-end">
                  <p className="text-sm text-gray-500">
                    {formatDate(item.tanggal)}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Button Lihat Semua */}
      <div className="flex justify-center mt-8">
        <Link
          href="/berita"
          className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
        >
          Lihat Semua Berita
        </Link>
      </div>
    </div>
  );
}

// Skeleton Loader
const SkeletonLoader = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="animate-pulse text-center mb-12">
      <div className="h-10 w-64 bg-gray-300 rounded-full mx-auto mb-4"></div>
      <div className="h-6 w-96 bg-gray-300 rounded-full mx-auto"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row"
        >
          {/* Gambar Placeholder */}
          <div className="relative w-4/12 sm:w-1/3 h-32 sm:h-auto bg-gray-300"></div>

          {/* Konten Placeholder */}
          <div className="p-2 sm:p-4 flex flex-col justify-between flex-1 space-y-4">
            {/* Kategori Placeholder */}
            <div className="h-4 w-24 bg-gray-300 rounded-full"></div>

            {/* Judul Placeholder */}
            <div className="h-6 w-48 bg-gray-300 rounded-full"></div>

            {/* Tanggal Placeholder */}
            <div className="h-4 w-32 bg-gray-300 rounded-full self-end"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{message}</h3>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  </div>
);
