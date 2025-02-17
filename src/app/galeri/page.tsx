"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import LoadMoreSpinner from "@/components/ui/LoadMoreSpinner";
import { useGalleryCategories } from "@/hooks/gallery/useGalleryCategories";
import { getCloudinaryUrl } from "@/utils/cloudinary";
import { FiDownload } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import SkeletonGaleri from "@/components/skeleton/galeri/SkeletonGaleri";

export default function GaleriPage() {
  const { galleryCategories, loading } = useGalleryCategories();

  const [selectedPublicId, setSelectedPublicId] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(12);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const [albumImages, setAlbumImages] = useState<
    { publicId: string; categoryTitle: string }[] | null
  >(null);

  const sortedImages = galleryCategories
    .flatMap((category) =>
      (category.gallery || []).map((img) => ({
        publicId: img.public_id,
        categoryTitle: category.title,
      }))
    )
    .sort((a, b) => b.publicId.localeCompare(a.publicId));

  const lightboxImages = albumImages || sortedImages;

  const displayedImages = sortedImages.slice(0, visibleCount);

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
      if (selectedPublicId === null) return;
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % lightboxImages.length
          : (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
      setIsImageLoading(true);
      setSelectedPublicId(lightboxImages[newIndex].publicId);
      setCurrentIndex(newIndex);
    },
    [selectedPublicId, currentIndex, lightboxImages]
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

  useEffect(() => {
    if (visibleCount >= sortedImages.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 12, sortedImages.length));
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [visibleCount, sortedImages.length]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentIndex, 300);
    }
  }, [currentIndex]);

  if (loading) return <SkeletonGaleri />;

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
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
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

      {/* Gallery Grid Section dengan Infinite Scroll */}
      <section id="gallery-grid" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Momen Terbaru
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedImages.map(({ publicId, categoryTitle }, index) => (
            <div
              key={`${publicId}-${index}`}
              className="relative group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => {
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
        {visibleCount < sortedImages.length && (
          <>
            <LoadMoreSpinner />
            <div ref={observerRef} className="h-1" />
          </>
        )}
      </section>

      {/* Enhanced Lightbox */}
      {selectedPublicId && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === lightboxRef.current && setSelectedPublicId(null)
          }
        >
          <div className="w-full max-w-7xl h-full flex flex-col">
            {/* Top Bar */}
            <div className="flex justify-between items-center p-4 bg-gray-800/30 backdrop-blur-lg rounded-t-xl border-b border-gray-700">
              <div className="flex items-center gap-4">
                <button
                  className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                  onClick={() => setSelectedPublicId(null)}
                >
                  <span className="text-2xl text-white">×</span>
                </button>
                <div className="text-sm text-gray-300">
                  {currentIndex + 1} of {lightboxImages.length}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="p-2.5 hover:bg-gray-700/50 rounded-full transition-colors group"
                  onClick={() => {
                    const imageUrl = getCloudinaryUrl(
                      selectedPublicId,
                      "w_1920,h_1080,c_fill"
                    );
                    const link = document.createElement("a");
                    link.href = imageUrl;
                    link.download = `${selectedPublicId}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <FiDownload className="text-xl text-white group-hover:text-green-400 transition-colors" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="relative flex-1 flex items-center justify-center">
              {/* Image Container */}
              <div className="relative w-full h-full flex items-center justify-center p-8">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-green-500" />
                  </div>
                )}
                <div className="relative max-w-4xl w-full h-full shadow-2xl rounded-xl overflow-hidden">
                  <Image
                    key={selectedPublicId}
                    src={getCloudinaryUrl(
                      selectedPublicId,
                      "w_1920,h_1080,c_fill"
                    )}
                    alt="Detail Kegiatan"
                    fill
                    className={`object-contain transition-opacity duration-300 ${
                      isImageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    priority
                    onLoadingComplete={() => setIsImageLoading(false)}
                  />
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10 sm:hidden">
                <button
                  className="p-4 hover:bg-gray-800/50 rounded-full backdrop-blur-sm transition-all"
                  onClick={() => handleImageNavigation("prev")}
                >
                  <div className="text-3xl text-white bg-gray-900/30 p-3 rounded-full hover:bg-gray-900/50">
                    ←
                  </div>
                </button>
                <button
                  className="p-4 hover:bg-gray-800/50 rounded-full backdrop-blur-sm transition-all"
                  onClick={() => handleImageNavigation("next")}
                >
                  <div className="text-3xl text-white bg-gray-900/30 p-3 rounded-full hover:bg-gray-900/50">
                    →
                  </div>
                </button>
              </div>

              {/* Desktop Navigation Arrows */}
              <button
                className="absolute left-4 z-10 p-4 hover:bg-gray-800/50 rounded-full backdrop-blur-sm transition-all -translate-x-2 hover:translate-x-0 hidden sm:block"
                onClick={() => handleImageNavigation("prev")}
              >
                <div className="text-3xl text-white bg-gray-900/30 p-3 rounded-full hover:bg-gray-900/50">
                  ←
                </div>
              </button>
              <button
                className="absolute right-4 z-10 p-4 hover:bg-gray-800/50 rounded-full backdrop-blur-sm transition-all translate-x-2 hover:translate-x-0 hidden sm:block"
                onClick={() => handleImageNavigation("next")}
              >
                <div className="text-3xl text-white bg-gray-900/30 p-3 rounded-full hover:bg-gray-900/50">
                  →
                </div>
              </button>
            </div>

            <div className="h-32 bg-gray-800/30 backdrop-blur-lg border-t border-gray-700 p-4">
              <Swiper
                spaceBetween={10}
                slidesPerView="auto"
                centeredSlides={true}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className="h-full"
              >
                {lightboxImages.map((img, idx) => (
                  <SwiperSlide
                    key={`${img.publicId}-${idx}`}
                    style={{ width: "auto" }}
                  >
                    <div
                      className={`relative h-full aspect-video cursor-pointer transition-all ${
                        idx === currentIndex
                          ? "ring-4 ring-green-500 scale-105"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setSelectedPublicId(img.publicId);
                      }}
                    >
                      <Image
                        src={getCloudinaryUrl(
                          img.publicId,
                          "w_200,h_120,c_fill"
                        )}
                        alt="Thumbnail"
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700/30">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{
                  width: `${
                    ((currentIndex + 1) / lightboxImages.length) * 100
                  }%`,
                }}
              />
            </div>

            {/* Caption */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              {lightboxImages[currentIndex]?.categoryTitle}
            </div>
          </div>
        </div>
      )}

      {showScrollToTop && <ScrollToTopButton />}
    </div>
  );
}
