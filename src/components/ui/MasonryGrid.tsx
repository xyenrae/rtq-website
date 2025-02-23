"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useResizeObserver } from "@wojtekmaj/react-hooks";

// Define an interface for the image data
interface ImageData {
  id: string;
  image: string;
  galeri_nama: string;
  width: number;
  height: number;
  created_at: string;
}

const MasonryGrid = ({ images }: { images: ImageData[] }) => {
  const [columnCount, setColumnCount] = useState(4);
  const [containerWidth, setContainerWidth] = useState(0);

  // Create a ref for the grid container
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Menggunakan ResizeObserver untuk mendeteksi lebar kontainer
  useResizeObserver(
    gridRef.current, // Element to observe
    undefined, // Options (optional)
    (entries: ResizeObserverEntry[]) => {
      if (!entries || entries.length === 0) return;
      const [entry] = entries;
      if (entry && entry.contentRect) {
        setContainerWidth(entry.contentRect.width);
      }
    }
  );

  // Menyesuaikan jumlah kolom berdasarkan lebar kontainer
  useEffect(() => {
    if (!containerWidth) return;
    if (containerWidth < 640) {
      setColumnCount(1);
    } else if (containerWidth < 1024) {
      setColumnCount(2);
    } else if (containerWidth < 1536) {
      setColumnCount(3);
    } else {
      setColumnCount(4);
    }
  }, [containerWidth]);

  // Membagi gambar ke dalam kolom-kolom
  const columns = Array.from({ length: columnCount }, () => [] as ImageData[]);
  images.forEach((image, index) => {
    columns[index % columnCount].push(image);
  });

  // Animasi untuk item gambar
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div ref={gridRef} className="w-full">
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="grid gap-6 content-start">
            {column.map((image) => {
              const aspectRatio = image.width / image.height;
              const baseHeight = 400;
              const calculatedHeight = baseHeight * (1 / aspectRatio);
              return (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3 }}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg"
                  style={{ height: `${calculatedHeight}px` }}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={image.image}
                      alt={image.galeri_nama}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={image.id === images[0]?.id}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="font-semibold truncate">
                      {image.galeri_nama}
                    </h3>
                    <p className="text-sm">
                      {new Date(image.created_at).toLocaleDateString("id-ID", {
                        dateStyle: "long",
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGrid;
