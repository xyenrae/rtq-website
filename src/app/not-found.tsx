"use client";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center mt-32">
      <div className="relative text-center">
        <div className="flex justify-center space-x-2 mb-8">
          <span className="text-9xl font-black text-green-500">4</span>
          <span className="text-9xl font-black text-green-500">0</span>
          <span className="text-9xl font-black text-green-500">4</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-700 mb-8 max-w-md mx-auto">
          Halaman yang Anda coba akses mungkin telah dihapus, dipindahkan, atau
          tidak tersedia.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-full font-semibold transition-colors hover:bg-green-600"
        >
          <span className="mr-2">Kembali ke Beranda</span>
          <FiArrowRight className="text-xl" />
        </Link>
      </div>
    </div>
  );
}
