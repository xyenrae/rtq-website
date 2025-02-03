"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
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
        modules={[Pagination, Mousewheel, FreeMode]}
        spaceBetween={30}
        slidesPerView={3}
        freeMode={true}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 0.5,
        }}
        pagination={{
          clickable: true,
          bulletClass:
            "swiper-pagination-bullet !bg-gray-300 !h-1 !w-8 !rounded-sm",
          bulletActiveClass: "!bg-green-500",
        }}
        breakpoints={{
          0: {
            slidesPerView: 2,
            freeMode: false,
          },
          768: {
            slidesPerView: 3,
            freeMode: true,
          },
          1024: {
            slidesPerView: 4,
            freeMode: true,
          },
        }}
        wrapperClass="items-stretch"
        className="!pb-12"
      >
        {programs.map((program) => (
          <SwiperSlide key={program.id}>
            <div className="overflow-hidden flex flex-col h-full bg-white hover:shadow-lg transition-shadow">
              <div className="relative flex w-full h-full">
                <Image
                  src={`/images/guru-${program.id}.png`}
                  alt={program.title}
                  width={400}
                  height={300}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute bottom-0 w-full bg-white rounded-t-2xl text-center pt-3">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mb-6 flex-1">
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
