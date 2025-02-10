"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Calendar, ChevronLeft, Clock } from "lucide-react";

interface Berita {
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
    timeStyle: "short",
  }).format(date);
};

const estimateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export default function BeritaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [beritaDetail, setBeritaDetail] = useState<Berita | null>(null);
  const [latestBerita, setLatestBerita] = useState<Berita[]>([]);
  const [relatedBerita, setRelatedBerita] = useState<Berita[]>([]);
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

        // Fetch related news after we have the category
        if (detailRes.data?.kategori) {
          const relatedRes = await supabase
            .from("berita")
            .select("*")
            .eq("kategori", detailRes.data.kategori)
            .neq("id", id)
            .limit(3);

          if (relatedRes.error) throw relatedRes.error;
          setRelatedBerita(relatedRes.data);
        }

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

  const NewsCard = ({ item }: { item: Berita }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/berita/${item.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={item.gambar || "/placeholder-news.jpg"}
            alt={item.judul}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {estimateReadTime(item.konten || "")} menit baca
            </span>
          </div>
          <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
            {item.judul}
          </h3>
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(item.tanggal)}
            </span>
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {item.views}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorMessage message={error} />;
  if (!beritaDetail) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className=" top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/berita"
            className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Kembali ke Berita
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* Main Article */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {beritaDetail.gambar && (
                  <div className="relative h-[480px] w-full">
                    <Image
                      src={beritaDetail.gambar}
                      alt={beritaDetail.judul}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  </div>
                )}

                <div className="p-8">
                  <header className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      {beritaDetail.kategori && (
                        <span className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                          {beritaDetail.kategori}
                        </span>
                      )}
                    </div>

                    <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                      {beritaDetail.judul}
                    </h1>

                    <div className="flex items-center space-x-4 text-gray-500 text-sm">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(beritaDetail.tanggal)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {beritaDetail.views} views
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {estimateReadTime(beritaDetail.konten)} menit baca
                      </span>
                    </div>
                  </header>

                  <div className="prose max-w-none text-gray-700 text-lg leading-relaxed">
                    {beritaDetail.konten.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-6">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] overflow-y-auto space-y-8 pb-8">
            {/* Latest News */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-l-4 border-green-500 pl-3">
                Berita Terbaru
              </h2>
              <div className="space-y-6">
                {latestBerita.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.id}`}
                    className="group flex space-x-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                        {item.judul}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(item.tanggal)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          </aside>
        </div>

        {/* Related News */}
        {relatedBerita.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-8 text-gray-800 border-l-4 border-green-500 pl-3">
              Berita Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBerita.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

const SkeletonLoader = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    </nav>

    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
            <div className="h-[480px] bg-gray-300"></div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="h-4 w-24 bg-gray-300 rounded-full"></div>
                <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
                <div className="flex space-x-4">
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          {[...Array(2)].map((_, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
            >
              <div className="h-6 w-32 bg-gray-300 rounded mb-6"></div>
              <div className="space-y-6">
                {[...Array(5)].map((_, itemIndex) => (
                  <div key={itemIndex} className="flex space-x-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full bg-gray-300 rounded"></div>
                      <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl"
    >
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{message}</h3>
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
        >
          Coba Lagi
        </motion.button>
        <Link href="/berita">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
          >
            Kembali ke Berita
          </motion.button>
        </Link>
      </div>
    </motion.div>
  </div>
);
