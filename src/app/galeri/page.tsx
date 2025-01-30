import Image from "next/image";

const images = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
];

export default function GaleriPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Galeri Kegiatan</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Image
              src={src}
              alt={`Kegiatan ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
