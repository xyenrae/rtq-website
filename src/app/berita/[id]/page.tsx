"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSkeleton from "@/components/LoadingSkeleton";

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
    timeStyle: "short",
  }).format(date);
};

export default function BeritaDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [beritaDetail, setBeritaDetail] = useState<Berita | null>(null);
  const [latestBerita, setLatestBerita] = useState<Berita[]>([]);
  const [popularBerita, setPopularBerita] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [detailRes, latestRes, popularRes] = await Promise.all([
          supabase
            .from("berita")
            .select("*")
            .eq("id", id as string)
            .single(),
          supabase
            .from("berita")
            .select("*")
            .order("tanggal", { ascending: false })
            .limit(5),
          supabase
            .from("berita")
            .select("*")
            .order("views", { ascending: false })
            .limit(5),
        ]);

        if (detailRes.error) throw detailRes.error;
        if (latestRes.error) throw latestRes.error;
        if (popularRes.error) throw popularRes.error;

        setBeritaDetail(detailRes.data);
        setLatestBerita(latestRes.data);
        setPopularBerita(popularRes.data);

        // Update views
        await supabase
          .from("berita")
          .update({ views: (detailRes.data.views || 0) + 1 })
          .eq("id", id);

        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError("Gagal memuat berita. Silakan coba kembali.");
        router.push("/berita");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchAllData();
  }, [id, router]);

  if (isLoading) return <LoadingSkeleton />;

  if (error) return <ErrorMessage message={error} />;

  if (!beritaDetail) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <main className="flex-1">
          <article className="bg-white p-6 rounded-lg shadow-lg">
            <header className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {beritaDetail.judul}
              </h1>
              <p className="text-gray-500 text-sm">
                Dipublikasikan pada {formatDate(beritaDetail.tanggal)} •{" "}
                {beritaDetail.views} kali dibaca
              </p>
            </header>

            <div className="prose max-w-none text-gray-700">
              {beritaDetail.konten.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </main>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
              Berita Terbaru
            </h2>
            <div className="space-y-3">
              {latestBerita.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-800 line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(item.tanggal)}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
              Berita Populer
            </h2>
            <div className="space-y-3">
              {popularBerita.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-800 line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.views} kali dibaca
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </aside>
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
