"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useBerita } from "@/hooks/santri/berita/useBerita"; // Import hook useBerita

// Interface untuk data berita
export interface Berita {
  id: string;
  judul: string;
  created_at: string;
  konten: string;
  views: number;
  gambar?: string;
  kategori?: { nama: string };
  ringkasan?: string;
  waktu_baca?: number;
}

// Fungsi untuk memformat tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
};

// Props untuk komponen NewsCard
interface NewsCardProps {
  item: Berita;
}

// Komponen NewsCard
function NewsCard({ item }: NewsCardProps) {
  return (
    <motion.article
      key={item.id}
      className="group cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col sm:flex-row"
    >
      <Link href={`/berita/${item.id}`} className="grid grid-cols-6">
        {/* Gambar */}
        <div className="relative w-full bg-gray-300 col-span-2 rounded-l-lg">
          <Image
            src={item.gambar || "/placeholder.jpg"}
            alt={item.judul}
            fill
            className="object-cover rounded-l-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {/* Konten */}
        <div className="py-2 px-3 flex flex-col justify-between col-span-4">
          <div>
            {item.kategori && (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium mb-1">
                {item.kategori.nama}
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
              {item.judul}
            </h3>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <span>{formatDate(item.created_at)}</span>
            <span className="mx-2">•</span>
            <span>{item.views} views</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// Komponen utama untuk menampilkan daftar berita
export default function BeritaList({
  selectedCategory,
}: {
  selectedCategory: string;
}) {
  const { berita, isLoading, setPage, hasMore } = useBerita(selectedCategory);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {berita.map((item, index) => (
            <NewsCard key={index} item={item} />
          ))}
        </div>
      )}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
}
