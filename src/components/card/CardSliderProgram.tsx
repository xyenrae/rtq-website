"use client";
import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, FreeMode, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

// Interface untuk program
interface Program {
  id: number;
  title: string;
  desc: string;
  fullDesc: string;
  image: string;
}

// Data manual untuk program
const programs: Program[] = [
  {
    id: 1,
    title: "Kelas Tahfidz",
    desc: "Program hafalan Al-Qur’an untuk anak-anak santri, dimulai dengan surat-surat pendek!",
    fullDesc:
      "Kelas ini dirancang untuk membantu santri menghafal Al-Qur'an secara bertahap. Dimulai dari surat-surat pendek, santri akan diajarkan teknik menghafal yang efektif dan menyenangkan. Dengan bimbingan guru yang berpengalaman, setiap santri akan merasa termotivasi untuk mencapai target hafalan mereka.",
    image: "/images/program-1.png",
  },
  {
    id: 2,
    title: "Khatam Al-Qur’an",
    desc: "Program intensif bagi santri yang siap menyelesaikan bacaan Al-Qur’an secara tartil!",
    fullDesc:
      "Program ini ditujukan bagi santri yang ingin menyelesaikan bacaan Al-Qur'an secara tartil (lancar dan benar). Dengan metode pembelajaran yang terstruktur, santri akan dibimbing untuk membaca Al-Qur'an dengan tajwid yang baik dan benar. Program ini juga mencakup evaluasi berkala untuk memastikan kemajuan santri.",
    image: "/images/program-2.png",
  },
  {
    id: 3,
    title: "Kelas Tahsin",
    desc: "Pembelajaran membaca Al-Qur’an dengan tajwid yang benar menggunakan Metode Yanbu’a!",
    fullDesc:
      "Kelas Tahsin difokuskan pada perbaikan bacaan Al-Qur'an. Dengan menggunakan Metode Yanbu'a, santri akan belajar membaca Al-Qur'an dengan tajwid yang benar. Guru akan memberikan panduan langkah demi langkah agar santri dapat membaca dengan lancar dan percaya diri.",
    image: "/images/program-3.png",
  },
  {
    id: 4,
    title: "Kelas Doa Harian",
    desc: "Mengajarkan doa sehari-hari untuk membentuk kebiasaan yang Islami sejak dini.",
    fullDesc:
      "Kelas ini mengajarkan santri berbagai doa harian yang penting dalam kehidupan sehari-hari. Dengan mempelajari doa-doa ini, santri akan terbiasa berdoa dalam berbagai situasi, seperti ketika bangun tidur, makan, bepergian, dan sebagainya. Kelas ini juga mencakup penjelasan makna doa agar santri lebih memahami artinya.",
    image: "/images/program-4.png",
  },
  {
    id: 5,
    title: "Kelas Akhlak Islami",
    desc: "Menanamkan nilai-nilai Islami seperti adab terhadap orang tua, guru, dan teman.",
    fullDesc:
      "Kelas Akhlak Islami bertujuan untuk menanamkan nilai-nilai Islam dalam kehidupan sehari-hari. Santri akan belajar tentang pentingnya berakhlak mulia, seperti hormat kepada orang tua, sopan santun kepada guru, dan kerjasama dengan teman. Kelas ini juga mencakup diskusi dan praktik langsung untuk memperkuat pemahaman santri.",
    image: "/images/program-5.png",
  },
];

export default function CardSliderProgram() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Handle open popup
  const handleOpenPopup = (program: Program) => {
    setSelectedProgram(program);
  };

  // Handle close popup
  const handleClosePopup = () => {
    setSelectedProgram(null);
  };

  // Handle click outside popup to close
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClosePopup();
    }
  };

  return (
    <div className="relative px-4">
      {/* Slider */}
      <Swiper
        modules={[Pagination, Mousewheel, FreeMode, Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        freeMode={true}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 0.5,
        }}
        loop={true} // Aktifkan infinite scroll
        autoplay={{
          delay: 3000, // Durasi autoplay (3 detik)
          disableOnInteraction: false, // Tetap autoplay meskipun user berinteraksi
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
        className="!pb-12 !overflow-x-hidden"
      >
        {programs.map((program) => (
          <SwiperSlide key={program.id}>
            <div className="rounded-xl border-2 border-yellow-200 border-dotted overflow-hidden bg-white transition-shadow duration-300 py-6">
              {/* Icon Section */}
              <div className="relative flex justify-center">
                <div className="bg-yellow-50 p-6 w-fit rounded-full transition-transform duration-300 hover:scale-110">
                  <Image
                    src={program.image}
                    alt={program.title}
                    width={75}
                    height={75}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              {/* Content Section */}
              <div className="px-6 mt-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">
                  {program.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 text-center flex-1">
                  {program.desc}
                </p>
                {/* Button with Creative Interaction */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => handleOpenPopup(program)}
                    className="border border-yellow-200 py-2 px-4 rounded-lg text-yellow-600 font-medium hover:bg-yellow-50 transition-colors duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Lihat Detail</span>
                    <span className="absolute inset-0 bg-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pop-up Detail */}
      {selectedProgram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOutsideClick} // Handle klik di luar pop-up
        >
          <div className="bg-white rounded-lg w-full mx-4 max-w-3xl p-8 relative overflow-hidden shadow-lg">
            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Text */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedProgram.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {selectedProgram.fullDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
