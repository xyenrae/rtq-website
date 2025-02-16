// app/galeri/page.tsx
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { useGalleryCategories } from "@/hooks/gallery/useGalleryCategories";
import { getCloudinaryUrl } from "@/components/utils/cloudinary";
import { log } from "console";

export default function GaleriPage() {
  const { galleryCategories, loading } = useGalleryCategories();

  // State lightbox dan navigasi
  const [selectedPublicId, setSelectedPublicId] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Jika pengguna memilih "Lihat Album", simpan kumpulan gambar khusus album tersebut.
  // Jika null, berarti lightbox diakses dari grid gambar (semua gambar).
  const [albumImages, setAlbumImages] = useState<
    { publicId: string; categoryTitle: string }[] | null
  >(null);

  // Gabungkan semua gambar dari setiap kategori menjadi satu array
  const sortedImages = galleryCategories
    .flatMap((category) =>
      (category.gallery || []).map((img) => ({
        publicId: img.public_id,
        categoryTitle: category.title,
      }))
    )
    .sort((a, b) => b.publicId.localeCompare(a.publicId));

  // Jika albumImages diset, gunakan itu; jika tidak, gunakan sortedImages
  const lightboxImages = albumImages || sortedImages;

  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );
  const preloadImage = useCallback(
    (publicId: string) => {
      if (typeof window !== "undefined" && !preloadedImages.has(publicId)) {
        const img = new window.Image();
        img.src = getCloudinaryUrl(publicId, "w_1920,h_1080,c_fill");
        img.onload = () => {
          setPreloadedImages((prev) => new Set(prev).add(publicId));
        };
      }
    },
    [preloadedImages]
  );

  const handleImageNavigation = useCallback(
    (direction: "prev" | "next") => {
      if (!selectedPublicId) return;
      const index = lightboxImages.findIndex(
        (img) => img.publicId === selectedPublicId
      );
      const newIndex =
        direction === "next"
          ? (index + 1) % lightboxImages.length
          : (index - 1 + lightboxImages.length) % lightboxImages.length;
      setIsImageLoading(true);
      setSelectedPublicId(lightboxImages[newIndex].publicId);
      setCurrentIndex(newIndex);
    },
    [selectedPublicId, lightboxImages]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedPublicId) {
        if (e.key === "ArrowRight") handleImageNavigation("next");
        if (e.key === "ArrowLeft") handleImageNavigation("prev");
        if (e.key === "Escape") setSelectedPublicId(null);
      }
    },
    [selectedPublicId, handleImageNavigation]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (selectedPublicId && lightboxImages.length > 0) {
      const nextIndex = (currentIndex + 1) % lightboxImages.length;
      const prevIndex =
        (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
      preloadImage(lightboxImages[nextIndex].publicId);
      preloadImage(lightboxImages[prevIndex].publicId);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedPublicId, currentIndex, preloadImage, lightboxImages]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <p>Loading gallery...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={getCloudinaryUrl(
              "RTQ AL-Hikmah/wisuda/image-1",
              "w_1920,h_1080,c_fill"
            )}
            alt="Background Hero"
            fill
            className="object-cover transform scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white animate-fade-in-up">
            Galeri Kegiatan
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Jejak Kenangan, Cerita Inspirasi - Dokumentasi Setiap Momen Berharga
          </p>
          <button
            className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg animate-fade-in-up delay-200"
            onClick={() =>
              document
                .getElementById("gallery-grid")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Jelajahi Galeri
          </button>
        </div>
      </section>

      {/* Kategori Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Kategori Kegiatan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {galleryCategories.map((category, idx) => (
            <div
              key={`${category.id}-${idx}`}
              className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-80">
                <Image
                  src={getCloudinaryUrl(category.gallery[0]?.public_id)}
                  alt={category.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={idx < 2}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.color_scheme} via-transparent to-transparent opacity-90`}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm">
                    {category.gallery?.length || 0}+ Foto
                  </p>
                  <button
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
                    onClick={() => {
                      // Filter hanya gambar dari kategori ini dan buka lightbox dengan album tersebut.
                      const album = sortedImages.filter(
                        (img) => img.categoryTitle === category.title
                      );
                      if (album.length > 0) {
                        setAlbumImages(album);
                        setSelectedPublicId(album[0].publicId);
                        setCurrentIndex(0);
                      }
                    }}
                  >
                    Lihat Album →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section id="gallery-grid" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Momen Terbaru
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedImages.map(({ publicId, categoryTitle }, index) => (
            <div
              key={`${publicId}-${index}`}
              className="relative group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                // Jika pengguna klik grid, gunakan semua gambar (reset albumImages)
                setAlbumImages(null);
                setIsImageLoading(true);
                setSelectedPublicId(publicId);
                setCurrentIndex(
                  sortedImages.findIndex((img) => img.publicId === publicId)
                );
              }}
              onMouseEnter={() => preloadImage(publicId)}
            >
              <div className="relative h-72 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={getCloudinaryUrl(publicId, "w_800,h_600,c_fill")}
                  alt={`Kegiatan ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw, 33vw, 25vw"
                  priority={index < 8}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="font-semibold truncate">{categoryTitle}</h3>
                  <p className="text-sm">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Lightbox */}
      {selectedPublicId && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === lightboxRef.current && setSelectedPublicId(null)
          }
        >
          <div className="relative max-w-6xl w-full max-h-[90vh]">
            {/* Navigation Controls */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-lg text-white text-2xl transition-all z-50"
              onClick={() => handleImageNavigation("prev")}
            >
              ←
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-lg text-white text-2xl transition-all z-50"
              onClick={() => handleImageNavigation("next")}
            >
              →
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/30 px-4 py-2 rounded-full text-white text-sm z-50">
              {currentIndex + 1} / {lightboxImages.length}
            </div>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 p-3 rounded-full backdrop-blur-lg text-white text-2xl transition-colors z-50"
              onClick={() => setSelectedPublicId(null)}
            >
              ✕
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
                </div>
              )}
              <Image
                key={selectedPublicId}
                src={getCloudinaryUrl(selectedPublicId, "w_1920,h_1080,c_fill")}
                alt="Detail Kegiatan"
                width={1920}
                height={1080}
                className={`object-contain rounded-xl transition-opacity duration-300 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                style={{ maxHeight: "80vh" }}
                priority
                onLoadingComplete={() => setIsImageLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
      {showScrollToTop && <ScrollToTopButton />}
    </div>
  );
}
