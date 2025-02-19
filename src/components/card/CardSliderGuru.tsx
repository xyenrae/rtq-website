"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

interface Guru {
  id: number;
  name: string;
  role: string;
  image_url: string;
}

export default function CardSliderGuru() {
  const [gurus, setGurus] = useState<Guru[]>([]);

  useEffect(() => {
    const fetchGurus = async () => {
      const { data, error } = await supabase.from("guru").select("*");
      if (error) {
        console.error("Error fetching guru data:", error);
      } else if (data) {
        setGurus(data);
      }
    };

    fetchGurus();
  }, []);

  return (
    <div className="relative px-4 overflow-hidden">
      <Swiper
        modules={[Mousewheel, FreeMode, Autoplay]}
        freeMode={true}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 0.5,
        }}
        slidesPerView="auto"
        spaceBetween={16}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="!pb-12"
      >
        {gurus.map((guru) => (
          <SwiperSlide key={guru.id} className="!w-[200px] !h-auto">
            <div className="overflow-hidden bg-white shadow-md rounded-lg">
              <div className="relative flex flex-col w-full h-full">
                {/* Gambar Guru */}
                <Image
                  src="/images/gallery-1.png"
                  alt={guru.name}
                  width={200}
                  height={100}
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Konten: Nama dan Peran */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                    {guru.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {guru.role}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
