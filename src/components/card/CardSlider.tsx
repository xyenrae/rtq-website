"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

// Data manual untuk program
const programs = [
  {
    id: 1,
    title: "Kelas Tahfidz",
    desc: "Program hafalan Al-Qur’an untuk anak-anak santri, dimulai dengan surat-surat pendek!",
  },
  {
    id: 2,
    title: "Khatam Al-Qur’an",
    desc: "Program intensif bagi santri yang siap menyelesaikan bacaan Al-Qur’an secara tartil!",
  },
  {
    id: 3,
    title: "Kelas Tahsin",
    desc: "Pembelajaran membaca Al-Qur’an dengan tajwid yang benar menggunakan Metode Yanbu’a!",
  },
  {
    id: 4,
    title: "Kelas Doa Harian",
    desc: "Mengajarkan doa sehari-hari untuk membentuk kebiasaan yang Islami sejak dini.",
  },
  {
    id: 5,
    title: "Kelas Akhlak Islami",
    desc: "Menanamkan nilai-nilai Islami seperti adab terhadap orang tua, guru, dan teman.",
  },
  {
    id: 6,
    title: "Kelas Ibadah",
    desc: "Pembelajaran tata cara shalat, wudhu, dan ibadah lainnya sesuai tuntunan nabi Muhammad SAW.",
  },
  {
    id: 7,
    title: "Kelas Bahasa Arab Dasar",
    desc: "Pengenalan kosakata dan kalimat sederhana untuk memperkuat pemahaman Al-Qur'an",
  },
  {
    id: 8,
    title: "Kelas Hadroh",
    desc: "Pelatihan seni musik Islami untuk melatih kreativitas dan menanamkan kecintaan pada shalawat",
  },
];

export default function CardSlider() {
  return (
    <div className="relative px-4">
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
            "swiper-pagination-bullet !bg-gray-300 !h-2 !w-8 !rounded-sm",
          bulletActiveClass: "!bg-green-500",
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            freeMode: false,
          },
          768: {
            slidesPerView: 2,
            freeMode: true,
          },
          1024: {
            slidesPerView: 3,
            freeMode: true,
          },
        }}
        wrapperClass="items-stretch"
        className="!pb-12 !overflow-visible"
      >
        {programs.map((program) => (
          <SwiperSlide key={program.id}>
            <div className="rounded-xl border-2 border-yellow-200 border-dotted overflow-hidden h-200 py-6">
              <div className="relative flex justify-center">
                <div className="bg-yellow-50 p-6 w-fit rounded-full">
                  <Image
                    src={`/images/program-${program.id}.png`}
                    alt={program.title}
                    width={75}
                    height={75}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              <div className="px-6 mt-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold mb-2 text-center">
                  {program.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 text-center flex-1">
                  {program.desc}
                </p>
                <div className="flex justify-center">
                  <button className="border border-yellow-200 py-2 px-4 rounded-lg mt-6">
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
