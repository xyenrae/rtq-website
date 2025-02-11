"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

export default function CardSliderGuru() {
  const programs = [
    {
      id: 1,
      title: "Jilid Pemula",
      desc: "Guru",
      yrs: 4,
      days: 6,
      hrs: 1.1,
    },
    {
      id: 2,
      title: "Jilid 1",
      desc: "Guru",
      yrs: 5,
      days: 6,
      hrs: 1.1,
    },
    {
      id: 3,
      title: "Jilid 2",
      desc: "Guru",
      yrs: 6,
      days: 6,
      hrs: 1.1,
    },
    {
      id: 4,
      title: "Jilid 3",
      desc: "Guru",
      yrs: 7,
      days: 6,
      hrs: 1.1,
    },
    {
      id: 5,
      title: "Jilid 4",
      desc: "Guru",
      yrs: 8,
      days: 6,
      hrs: 1.1,
    },
    {
      id: 6,
      title: "Jilid 5",
      desc: "Guru",
      yrs: 9,
      days: 6,
      hrs: 1.1,
    },
    {
      id: 7,
      title: "Jilid 6",
      desc: "Guru",
      yrs: 10,
      days: 6,
      hrs: 1.1,
    },
    {
      id: 8,
      title: "Jilid 7",
      desc: "Guru",
      yrs: 11,
      days: 6,
      hrs: 1.1,
    },
    {
      id: 9,
      title: "Yanbu'a Tahajji",
      desc: "Guru",
      yrs: 11,
      days: 6,
      hrs: 1.1,
    },
  ];

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
        spaceBetween={16} // Minimal spasi antar slide
        loop={true} // Aktifkan infinite scroll
        autoplay={{
          delay: 3000, // Durasi autoplay (3 detik)
          disableOnInteraction: false, // Tetap autoplay meskipun user berinteraksi
        }}
        className="!pb-12"
      >
        {programs.map((program) => (
          <SwiperSlide
            key={program.id}
            className="!w-[200px] !h-auto" // Lebar slide disesuaikan
          >
            <div className="overflow-hidden bg-white shadow-md rounded-lg">
              <div className="relative flex flex-col w-full h-full">
                {/* Gambar */}
                <Image
                  src={`/images/guru-${program.id}.png`}
                  alt={program.title}
                  width={200}
                  height={100}
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Konten */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                    {program.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {program.desc}
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
