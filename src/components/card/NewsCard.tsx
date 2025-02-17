"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Interface untuk data berita
export interface Berita {
  id: string;
  judul: string;
  tanggal: string;
  konten: string;
  views: number;
  gambar?: string;
  kategori?: string | { nama: string }; // Memperbaiki tipe kategori
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
  index?: number; // Membuat index opsional
}

export default function NewsCard({ item, index }: NewsCardProps) {
  return (
    <motion.article
      key={index !== undefined ? `${item.id}-${index}` : item.id} // Memastikan index hanya digunakan jika tersedia
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
                {typeof item.kategori === "string"
                  ? item.kategori // Jika kategori adalah string
                  : item.kategori.nama}{" "}
                {/* Jika kategori adalah objek */}
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
  );
}
