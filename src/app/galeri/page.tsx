// app/galeri/page.tsx
"use client";

import Image from "next/image";

// Ambil cloud name dari environment variable (fallback ke "dd5bhcryt" jika tidak ada)
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dd5bhcryt";

// Daftar public ID gambar yang telah kamu upload ke Cloudinary
// Perhatikan bahwa jika nama file dan folder memiliki spasi, Cloudinary secara internal menggunakannya seperti itu.
// Kita akan melakukan encoding URL nanti.
const galleryImages = [
  "RTQ AL-Hikmah/image 1.jpg",
  "RTQ AL-Hikmah/image 2.jpg",
  "RTQ AL-Hikmah/image 3.jpg",
  "RTQ AL-Hikmah/image 4.jpg",
  "RTQ AL-Hikmah/image 5.jpg",
  "RTQ AL-Hikmah/image 6.jpg",
];

// Fungsi untuk membangun URL Cloudinary dengan transformasi
const getCloudinaryUrl = (publicId: string) => {
  // Transformasi: resize dan crop ke ukuran 500x500 piksel
  const transformations = "w_500,h_500,c_fill";
  // Encode publicId agar spasi dan karakter khusus menjadi aman untuk URL
  const encodedPublicId = encodeURIComponent(publicId);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${encodedPublicId}`;
};

export default function GaleriPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Galeri Kegiatan</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.map((publicId, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Image
              src={getCloudinaryUrl(publicId)}
              alt={`Kegiatan ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
