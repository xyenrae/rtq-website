"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import LoadingSkeleton from "@/components/LoadingSkeleton"; // Buat komponen skeleton loading

interface Berita {
  id: string;
  judul: string;
  tanggal: string;
  konten: string;
  views: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
};

export default function BeritaPage() {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const { data, error } = await supabase
          .from("berita")
          .select("*")
          .order("tanggal", { ascending: false });

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

  if (isLoading) return <LoadingSkeleton />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-green-500 pb-2">
        Berita Terkini
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {berita.map((item) => (
          <article
            key={item.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
                  {item.judul}
                </h2>
                <p className="text-gray-500 text-sm mb-3">
                  {formatDate(item.tanggal)} • {item.views} kali dibaca
                </p>
                <p className="text-gray-600 line-clamp-3 leading-relaxed">
                  {item.konten}
                </p>
              </div>
              <Link
                href={`/berita/${item.id}`}
                className="mt-4 inline-block text-green-600 hover:text-green-800 font-medium transition-colors"
              >
                Baca Selengkapnya →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="container mx-auto px-4 py-8 max-w-6xl">
    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
      <p className="text-red-600">⚠️ {message}</p>
    </div>
  </div>
);
