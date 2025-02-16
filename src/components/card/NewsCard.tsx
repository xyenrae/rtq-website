"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export interface Berita {
  id: string;
  judul: string;
  tanggal: string;
  konten: string;
  views: number;
  gambar?: string;
  kategori?: string;
  ringkasan?: string;
  waktu_baca?: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
};

interface NewsCardProps {
  item: Berita;
}

export default function NewsCard({ item }: NewsCardProps) {
  return (
    <motion.article
      className="group cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col sm:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
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
        <div className="p-2 pl-3 flex flex-col justify-between flex-1">
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
  );
}
