"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { FiDownload } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import SkeletonGaleri from "@/components/skeleton/galeri/SkeletonGaleri";
import { useGaleri, GaleriImage } from "@/hooks/santri/galeri/useGaleri";
import { useGaleriKategori } from "@/hooks/santri/galeri/useGaleriKategori";
import LoadMoreSpinner from "@/components/ui/LoadMoreSpinner";
import { motion, AnimatePresence } from "framer-motion";

type GaleriImageWithCategory = GaleriImage;

const INITIAL_LOAD_COUNT = 4;
const LOAD_MORE_COUNT = 4;

const newsCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function GaleriPage() {
  const { galeri, loading: loadingGaleri } = useGaleri();
  const { kategori, loading: loadingKategori } = useGaleriKategori();
  const loading = loadingGaleri || loadingKategori;

  const sortedImages = useMemo(
    () =>
      galeri
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
    [galeri]
  );

  const categories = useMemo(
    () =>
      kategori.map((cat) => ({
        id: cat.id,
        title: cat.nama,
        images: sortedImages.filter((img) => img.galeri_kategori_id === cat.id),
      })),
    [kategori, sortedImages]
  );

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [albumImages, setAlbumImages] = useState<
    GaleriImageWithCategory[] | null
  >(null);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );

  const lightboxRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const lightboxImages = albumImages || sortedImages;
  const displayedImages = sortedImages.slice(0, visibleCount);
  const hasMoreImages = visibleCount < sortedImages.length;

  const preloadImage = useCallback(
    (imageObj: GaleriImageWithCategory) => {
      if (typeof window !== "undefined" && !preloadedImages.has(imageObj.id)) {
        const img = new window.Image();
        img.src = imageObj.image;
        img.onload = () => {
          setPreloadedImages((prev) => new Set(prev).add(imageObj.id));
        };
      }
    },
    [preloadedImages]
  );

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreImages) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) =>
          Math.min(prev + LOAD_MORE_COUNT, sortedImages.length)
        );
        setIsLoadingMore(false);
      }, 500); // Simulate network delay
    }
  }, [isLoadingMore, hasMoreImages, sortedImages.length]);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || !hasMoreImages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [loading, hasMoreImages, loadMore]);

  const handleImageNavigation = useCallback(
    (direction: "prev" | "next") => {
      if (selectedImageId === null) return;
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % lightboxImages.length
          : (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
      setIsImageLoading(true);
      setSelectedImageId(lightboxImages[newIndex].id);
      setCurrentIndex(newIndex);
    },
    [selectedImageId, currentIndex, lightboxImages]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedImageId) {
        if (e.key === "ArrowRight") handleImageNavigation("next");
        if (e.key === "ArrowLeft") handleImageNavigation("prev");
        if (e.key === "Escape") setSelectedImageId(null);
      }
    },
    [selectedImageId, handleImageNavigation]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (selectedImageId && lightboxImages.length > 0) {
      const nextIndex = (currentIndex + 1) % lightboxImages.length;
      const prevIndex =
        (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
      preloadImage(lightboxImages[nextIndex]);
      preloadImage(lightboxImages[prevIndex]);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedImageId, currentIndex, preloadImage, lightboxImages]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentIndex, 300);
    }
  }, [currentIndex]);

  if (loading) return <SkeletonGaleri />;

  const selectedImage = lightboxImages.find(
    (img) => img.id === selectedImageId
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {sortedImages.length > 0 && (
            <Image
              src={sortedImages[0].image}
              alt="Hero Background"
              fill
              className="object-cover transform scale-105"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white animate-fade-in-up">
            Galeri Kegiatan
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Jejak kenangan dan cerita inspiratif – dokumentasi setiap momen
            berharga.
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

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Kategori Kegiatan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-80">
                {category.images.length > 0 && (
                  <Image
                    src={category.images[0].image}
                    alt={category.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm">{category.images.length} Foto</p>
                  <button
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
                    onClick={() => {
                      if (category.images.length > 0) {
                        setAlbumImages(category.images);
                        setSelectedImageId(category.images[0].id);
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

      {/* Gallery Grid with Infinite Scroll */}
      <section id="gallery-grid" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Momen Terbaru
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedImages.map((img, index) => (
              <div
                key={img.id}
                className="relative group cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  setAlbumImages(null);
                  setIsImageLoading(true);
                  setSelectedImageId(img.id);
                  setCurrentIndex(
                    sortedImages.findIndex((item) => item.id === img.id)
                  );
                }}
                onMouseEnter={() => preloadImage(img)}
              >
                <motion.div
                  variants={newsCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <div className="relative h-72 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={img.image}
                      alt={`Activity ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < INITIAL_LOAD_COUNT}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="font-semibold truncate">
                        {img.galeri_nama}
                      </h3>
                      <p className="text-sm">
                        {new Date(img.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More Indicator */}
        {hasMoreImages && (
          <div
            ref={loadMoreRef}
            className="flex justify-center items-center mt-8 h-16"
          >
            {isLoadingMore ? <LoadMoreSpinner /> : <div className="h-8 w-8" />}
          </div>
        )}
      </section>

      {/* Lightbox Component */}
      {selectedImageId && selectedImage && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === lightboxRef.current && setSelectedImageId(null)
          }
        >
          <div className="w-full max-w-7xl h-full flex flex-col">
            {/* Top Bar */}
            <div className="flex justify-between items-center p-4 bg-gray-800/30 backdrop-blur-lg rounded-t-xl border-b border-gray-700">
              <div className="flex items-center gap-4">
                <button
                  className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                  onClick={() => setSelectedImageId(null)}
                >
                  <span className="text-2xl text-white">×</span>
                </button>
                <div className="text-sm text-gray-300">
                  {currentIndex + 1} dari {lightboxImages.length}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="p-2.5 hover:bg-gray-700/50 rounded-full transition-colors group"
                  onClick={() => {
                    if (selectedImage) {
                      const link = document.createElement("a");
                      link.href = selectedImage.image;
                      link.download = `${
                        selectedImage.galeri_nama || selectedImage.id
                      }.jpg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                >
                  <FiDownload className="text-xl text-white group-hover:text-green-400 transition-colors" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="relative flex-1 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center p-8">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-green-500" />
                  </div>
                )}
                <div className="relative max-w-4xl w-full h-full shadow-2xl rounded-xl overflow-hidden">
                  <Image
                    key={selectedImage.id}
                    src={selectedImage.image}
                    alt={selectedImage.galeri_nama || "Detail Kegiatan"}
                    fill
                    className={`object-contain transition-opacity duration-300 ${
                      isImageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    priority
                    onLoadingComplete={() => setIsImageLoading(false)}
                  />
                </div>
              </div>

              {/* Mobile Navigation Arrows */}
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

            {/* Thumbnail Slider */}
            <div className="h-32 bg-gray-800/30 backdrop-blur-lg border-t border-gray-700 p-4">
              <Swiper
                spaceBetween={10}
                slidesPerView="auto"
                centeredSlides={true}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className="h-full"
                initialSlide={currentIndex}
              >
                {lightboxImages.map((img, idx) => (
                  <SwiperSlide
                    key={`${img.id}-${idx}`}
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
                        setSelectedImageId(img.id);
                        setIsImageLoading(true);
                      }}
                    >
                      <Image
                        src={img.image}
                        alt={img.galeri_nama || "Thumbnail"}
                        fill
                        className="object-cover rounded-sm"
                        sizes="150px"
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
              {selectedImage.galeri_nama || "Detail Kegiatan"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
