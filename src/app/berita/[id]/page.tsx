"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiEye, FiCalendar, FiChevronLeft, FiClock } from "react-icons/fi";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useKategori } from "@/hooks/santri/berita/useBeritaKategori";
import ShareDropdown from "@/components/ui/ShareDropdown";
import CardRelatedBerita from "@/components/card/CardRelatedBerita";

interface Berita {
  id: string;
  judul: string;
  created_at: string;
  konten: string;
  views: number;
  gambar?: string;
  kategori_id: string;
  ringkasan?: string;
  waktu_baca: number;
  kategori?: {
    nama: string;
  };
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
  const supabase = createClient();

  // Ambil data kategori dari hook useKategori
  const { kategori } = useKategori();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Ambil detail berita, berita terbaru, dan berita populer secara bersamaan
        const [detailRes, latestRes, popularRes] = await Promise.all([
          supabase
            .from("berita")
            .select("*")
            .eq("id", id as string)
            .single(),
          supabase
            .from("berita")
            .select("*")
            .order("created_at", { ascending: false })
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

        if (detailRes.data?.kategori_id) {
          const relatedRes = await supabase
            .from("berita")
            .select("*, kategori:berita_kategori(nama)")
            .eq("kategori_id", detailRes.data.kategori_id)
            .neq("id", id)
            .limit(3);

          if (relatedRes.error) throw relatedRes.error;
          setRelatedBerita(relatedRes.data);
          console.log("related: ", relatedRes.data);
        }

        // Update views melalui fungsi RPC untuk increment secara atomik
        const { data: newViews, error: rpcError } = await supabase.rpc(
          "increment_views",
          { row_id: id }
        );
        if (rpcError) throw rpcError;

        // Perbarui state beritaDetail dengan nilai views terbaru dari RPC
        setBeritaDetail((prev) => (prev ? { ...prev, views: newViews } : prev));

        setError(null);
      } catch (error: unknown) {
        console.error("Error:", error);
        setError("Gagal memuat berita. Silakan coba kembali.");
        router.push("/berita");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchAllData();
  }, [id, router, supabase]);

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorMessage message={error} />;
  if (!beritaDetail) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 w-screen overflow-hidden">
      {/* Navigation */}
      <nav className="top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/berita"
            className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <FiChevronLeft className="w-5 h-5 mr-2" />
            Kembali ke Berita
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="lg:container lg:px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-9 space-y-8">
            {/* Main Article */}
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <div className="rounded-2xl shadow-sm overflow-hidden border border-gray-100 w-full">
                {/* Hero Image */}
                {beritaDetail.gambar && (
                  <motion.div
                    className="relative h-[560px] w-full group overflow-hidden"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Image
                      src={beritaDetail.gambar}
                      alt={beritaDetail.judul}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      priority
                    />
                  </motion.div>
                )}

                {/* Floating Meta Section */}
                <div className="relative -mt-16">
                  <div className="bg-white container py-8 rounded-2xl rounded-br-none">
                    <header className="mb-4">
                      <div className="flex justify-between gap-4 mb-6">
                        <div className="flex items-center space-x-4">
                          {/* Tampilkan kategori menggunakan data dari useKategori */}
                          {beritaDetail.kategori_id && (
                            <motion.span
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium shadow-sm"
                            >
                              {
                                kategori.find(
                                  (k) => k.id === beritaDetail.kategori_id
                                )?.nama
                              }
                            </motion.span>
                          )}
                          {/* Interactive Time Widget */}
                          <div className="flex items-center space-x-2 text-gray-600">
                            <FiCalendar className="w-5 h-5" />
                            <span className="font-medium">
                              {new Date(
                                beritaDetail.created_at
                              ).toLocaleDateString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="hidden lg:flex items-center space-x-1.5 text-gray-600 ml-2">
                            <FiEye className="w-5 h-5" />
                            <span className="font-medium">
                              {beritaDetail.views}
                            </span>
                          </div>
                        </div>

                        <div className="hidden lg:flex items-center space-x-3">
                          <div className="flex items-center space-x-1.5 text-gray-600">
                            <FiClock className="w-5 h-5" />
                            <span className="font-medium">
                              {estimateReadTime(beritaDetail.konten)} min read
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex -mt-4 mb-4 lg:hidden justify-between">
                        <div className="flex items-center space-x-1.5 text-gray-600">
                          <FiClock className="w-5 h-5" />
                          <span className="font-medium">
                            {estimateReadTime(beritaDetail.konten)} min read
                          </span>
                        </div>
                        <div className="flex lg:hidden items-center space-x-1.5 text-gray-600 ml-2">
                          <FiEye className="w-5 h-5" />
                          <span className="font-medium">
                            {beritaDetail.views}
                          </span>
                        </div>
                      </div>

                      <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 leading-tight tracking-tight"
                      >
                        {beritaDetail.judul}
                      </motion.h1>
                    </header>

                    {/* Article Content */}
                    <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed">
                      {beritaDetail.konten
                        .split("\n")
                        .map((paragraph, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative group mb-8"
                          >
                            <p className="text-lg leading-8 text-gray-700">
                              {paragraph}
                              <button className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-400 hover:text-gray-600">
                                <span className="text-2xl">·</span>
                              </button>
                            </p>
                          </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                      <ShareDropdown
                        title={beritaDetail.judul}
                        url={window.location.href}
                      />
                    </div>
                  </div>
                </div>

                {/* Author & Social Proof Section */}
                <div className="border-t border-gray-200 mt-8 py-8 px-8">
                  <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-green-500">
                        <Image
                          src="/images/logo-rtq.png"
                          alt="Penulis"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">by Admin</h4>
                        <p className="text-gray-600">RTQ AL-Hikmah</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ y: -2 }}
                        className="text-gray-600 hover:text-green-600"
                      >
                        <FaTwitter className="w-6 h-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{ y: -2 }}
                        className="text-gray-600 hover:text-green-600"
                      >
                        <FaInstagram className="w-6 h-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{ y: -2 }}
                        className="text-gray-600 hover:text-green-600"
                      >
                        <FaLinkedin className="w-6 h-6" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>

          {/* Sidebar: Latest News */}
          <aside className="col-span-12 lg:col-span-3 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] overflow-y-auto space-y-8 pb-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
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
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          </aside>
        </div>

        {/* Related News */}
        <h2 className="text-xl font-bold mb-8 text-gray-800 border-l-4 border-green-500 pl-3 ml-4 lg:mt-8">
          Berita Terkait
        </h2>
        <motion.section
          className="container mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {relatedBerita.length > 0 ? (
            relatedBerita.map((item) => (
              <CardRelatedBerita key={item.id} item={item} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              Tidak ada berita untuk kategori ini.
            </p>
          )}
        </motion.section>
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
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
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
              className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
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
      className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm"
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
