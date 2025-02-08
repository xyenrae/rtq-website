"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dd5bhcryt";

interface GalleryCategory {
  title: string;
  folder: string;
  images: string[];
}

const galleryCategories: GalleryCategory[] = [
  {
    title: "Momen Wisuda",
    folder: "RTQ%20AL-Hikmah/wisuda",
    images: ["image-1", "image-2", "image-3"],
  },
  {
    title: "Momen Wisata",
    folder: "RTQ%20AL-Hikmah/wisata",
    images: ["image-1", "image-2", "image-3"],
  },
  {
    title: "Momen Karnaval",
    folder: "RTQ%20AL-Hikmah/karnaval",
    images: ["image-1", "image-2", "image-3"],
  },
];

const getCloudinaryUrl = (
  publicId: string,
  transformations: string = "f_auto,q_auto,w_500,h_500,c_fill"
) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

const getBlurDataURL = (publicId: string) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/e_blur:500,q_1,w_50/${publicId}`;
};

export default function GaleriPage() {
  const [selectedPublicId, setSelectedPublicId] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );

  const allImages = galleryCategories.flatMap((category) =>
    category.images.map((imageName) => ({
      publicId: `${category.folder}/${imageName}`,
      categoryTitle: category.title,
    }))
  );

  const sortedImages = [...allImages].sort((a, b) =>
    b.publicId.localeCompare(a.publicId)
  );

  const preloadImage = (publicId: string) => {
    if (!preloadedImages.has(publicId)) {
      // Gunakan window.Image untuk memastikan kita menggunakan konstruktor global
      const img = new window.Image();
      img.src = getCloudinaryUrl(publicId, "f_auto,q_auto,w_1920,h_1080,c_fit");
      img.onload = () => {
        setPreloadedImages((prev) => new Set(prev).add(publicId));
      };
    }
  };

  useEffect(() => {
    if (selectedPublicId && !preloadedImages.has(selectedPublicId)) {
      preloadImage(selectedPublicId);
    }
  }, [selectedPublicId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Galeri Kegiatan</h1>
        </header>

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
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg font-semibold">
                    {categoryTitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedPublicId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
            onClick={() => setSelectedPublicId(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-8 right-0 text-white text-3xl font-bold z-10 hover:text-gray-200 transition-colors"
                onClick={() => setSelectedPublicId(null)}
                aria-label="Tutup"
              >
                &times;
              </button>
              <div className="relative w-full h-full">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-transparent"></div>
                  </div>
                )}
                <Image
                  src={getCloudinaryUrl(
                    selectedPublicId,
                    "f_auto,q_auto,w_1920,h_1080,c_fit"
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
    </div>
  );
}
