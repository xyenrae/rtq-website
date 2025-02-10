"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

// Konfigurasi Cloudinary
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dd5bhcryt";

// Interface untuk kategori galeri
interface GalleryCategory {
  title: string;
  folder: string;
  images: string[];
}

// Data galeri (disesuaikan dengan folder dan nama file Cloudinary)
const galleryCategories: GalleryCategory[] = [
  {
    title: "Momen Wisuda",
    folder: "RTQ AL-Hikmah/wisuda", // Pastikan folder ini ada di Cloudinary
    images: ["image-1", "image-2", "image-3"], // Pastikan nama file ini ada di Cloudinary
  },
  {
    title: "Momen Wisata",
    folder: "RTQ AL-Hikmah/wisata",
    images: ["image-1", "image-2", "image-3"],
  },
  {
    title: "Momen Karnaval",
    folder: "RTQ AL-Hikmah/karnaval",
    images: ["image-1", "image-2", "image-3"],
  },
];

// Fungsi untuk membangun URL Cloudinary dengan transformasi
const getCloudinaryUrl = (
  publicId: string,
  transformations: string = "f_auto,q_auto,w_800,h_600,c_fill"
) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${encodeURIComponent(
    publicId
  )}`;
};

// Fungsi untuk mendapatkan URL placeholder blur
const getBlurDataURL = (publicId: string) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/e_blur:500,q_1,w_50/${encodeURIComponent(
    publicId
  )}`;
};

// Komponen utama GaleriPage
export default function GaleriPage() {
  // State untuk manajemen gambar
  const [selectedPublicId, setSelectedPublicId] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );

  // Menggabungkan semua gambar dari semua kategori
  const allImages = galleryCategories.flatMap((category) =>
    category.images.map((imageName) => ({
      publicId: `${category.folder}/${imageName}`,
      categoryTitle: category.title,
    }))
  );

  // Mengurutkan gambar berdasarkan nama file
  const sortedImages = [...allImages].sort((a, b) =>
    b.publicId.localeCompare(a.publicId)
  );

  // Preload gambar untuk meningkatkan performa
  const preloadImage = (publicId: string) => {
    if (typeof window !== "undefined" && !preloadedImages.has(publicId)) {
      const img = new window.Image();
      img.src = getCloudinaryUrl(
        publicId,
        "f_auto,q_auto,w_1920,h_1080,c_fill"
      );
      img.onload = () => {
        setPreloadedImages((prev) => new Set(prev).add(publicId));
      };
    }
  };

  // Efek samping untuk memastikan gambar terpilih dipreload
  useEffect(() => {
    if (selectedPublicId && !preloadedImages.has(selectedPublicId)) {
      preloadImage(selectedPublicId);
    }
  }, [selectedPublicId]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Galeri Kegiatan</h1>
      </header>

      {/* Section Terbaru */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Terbaru</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedImages.map(({ publicId, categoryTitle }, index) => (
            <div
              key={publicId}
              className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              onClick={() => {
                setIsImageLoading(true);
                setSelectedPublicId(publicId);
              }}
              onMouseEnter={() => preloadImage(publicId)}
            >
              {/* Container Gambar */}
              <div className="relative h-0 pb-[100%]">
                <Image
                  src={getCloudinaryUrl(publicId)}
                  alt={`Kegiatan ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index < 4}
                  placeholder="blur"
                  blurDataURL={getBlurDataURL(publicId)}
                />
              </div>
              {/* Overlay Judul Kategori */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg font-semibold">
                  {categoryTitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox untuk Gambar Detail */}
      {selectedPublicId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setSelectedPublicId(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup */}
            <button
              className="absolute -top-8 right-0 text-white text-3xl font-bold z-10 hover:text-gray-200 transition-colors"
              onClick={() => setSelectedPublicId(null)}
              aria-label="Tutup"
            >
              &times;
            </button>
            {/* Loading Spinner */}
            <div className="relative w-full h-full">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-transparent"></div>
                </div>
              )}
              {/* Gambar Detail */}
              <Image
                src={getCloudinaryUrl(
                  selectedPublicId,
                  "w_1920,h_1080,c_fill,f_auto,q_auto"
                )}
                alt="Detail Kegiatan"
                width={1920}
                height={1080}
                className={`object-contain rounded-lg shadow-lg transition-opacity duration-300 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  width: "auto",
                  height: "auto",
                }}
                placeholder="blur"
                blurDataURL={getBlurDataURL(selectedPublicId)}
                priority
                onLoadingComplete={() => setIsImageLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
