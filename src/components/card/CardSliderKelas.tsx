"use client";
import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, FreeMode, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

interface Kelas {
  id: number;
  title: string;
  desc: string;
  fullDesc: string;
  image: string;
}

const programs: Kelas[] = [
  {
    id: 1,
    title: "Kelas Tahfidz",
    desc: "Program hafalan Al-Qur'an untuk anak-anak santri, dimulai dengan hafalan surat-surat pendek!",
    fullDesc:
      "Kelas ini dirancang untuk membantu santri menghafal Al-Qur'an secara bertahap. Dimulai dari surat-surat pendek, santri akan diajarkan teknik menghafal yang efektif dan menyenangkan. Dengan bimbingan guru yang berpengalaman, setiap santri akan merasa termotivasi untuk mencapai target hafalan mereka.",
    image: "/images/program-1.png",
  },
  {
    id: 2,
    title: "Khatam Al-Qur'an",
    desc: "Program membaca bagi para santri yang ingin menyelesaikan bacaan Al-Qur'an secara tartil!",
    fullDesc:
      "Program ini ditujukan bagi santri yang ingin menyelesaikan bacaan Al-Qur'an secara tartil (lancar dan benar). Dengan metode pembelajaran yang terstruktur, santri akan dibimbing untuk membaca Al-Qur'an dengan tajwid yang baik dan benar. Program ini juga mencakup evaluasi berkala untuk memastikan kemajuan santri.",
    image: "/images/program-2.png",
  },
  {
    id: 3,
    title: "Kelas Tahsin",
    desc: "Pembelajaran membaca Al-Qur'an dengan tajwid yang benar menggunakan Metode Yanbu'a!",
    fullDesc:
      "Kelas Tahsin difokuskan pada perbaikan bacaan Al-Qur'an. Dengan menggunakan Metode Yanbu'a, santri akan belajar membaca Al-Qur'an dengan tajwid yang benar. Guru akan memberikan panduan langkah demi langkah agar santri dapat membaca dengan lancar dan percaya diri.",
    image: "/images/program-3.png",
  },
  {
    id: 4,
    title: "Kelas Doa Harian",
    desc: "Mengajarkan doa kehidupan sehari-hari untuk membentuk kebiasaan yang Islami sejak dini.",
    fullDesc:
      "Kelas ini mengajarkan santri berbagai doa harian yang penting dalam kehidupan sehari-hari. Dengan mempelajari doa-doa ini, santri akan terbiasa berdoa dalam berbagai situasi, seperti ketika bangun tidur, makan, bepergian, dan sebagainya. Kelas ini juga mencakup penjelasan makna doa agar santri lebih memahami artinya.",
    image: "/images/program-4.png",
  },
  {
    id: 5,
    title: "Kelas Akhlak Islami",
    desc: "Menanamkan nilai-nilai Islami seperti adab terhadap orang tua, kepada guru, dan teman.",
    fullDesc:
      "Kelas Akhlak Islami bertujuan untuk menanamkan nilai-nilai Islam dalam kehidupan sehari-hari. Santri akan belajar tentang pentingnya berakhlak mulia, seperti hormat kepada orang tua, sopan santun kepada guru, dan kerjasama dengan teman. Kelas ini juga mencakup diskusi dan praktik langsung untuk memperkuat pemahaman santri.",
    image: "/images/program-5.png",
  },
];

export default function CardSliderProgram() {
  const [selectedProgram, setSelectedProgram] = useState<Kelas | null>(null);

  const handleOpenPopup = (program: Kelas) => {
    setSelectedProgram(program);
  };

  const handleClosePopup = () => {
    setSelectedProgram(null);
  };

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
        mousewheel={{ forceToAxis: true, sensitivity: 0.5 }}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1, freeMode: false },
          768: { slidesPerView: 2, freeMode: true },
          1024: { slidesPerView: 3, freeMode: true },
        }}
        wrapperClass="items-stretch"
        className="!pb-12 !overflow-x-hidden"
      >
        {programs.map((program) => (
          <SwiperSlide key={program.id}>
            <div className="rounded-xl border-2 border-yellow-200 border-dotted overflow-hidden bg-white transition-shadow duration-300 py-6 hover:shadow-lg">
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
                <p className="text-md text-gray-600 line-clamp-3 text-center flex-1">
                  {program.desc}
                </p>
                {/* Button */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => handleOpenPopup(program)}
                    className="border border-yellow-200 py-2 px-4 rounded-lg text-yellow-600 font-medium hover:bg-yellow-50 transition-colors duration-300 relative overflow-hidden group"
                  >
                    <span className="text-sm sm:text-md relative z-10">
                      Lihat Detail
                    </span>
                    <span className="absolute inset-0 bg-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal Popup (menggunakan Framer Motion) */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOutsideClick}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-8 relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FiX size={24} />
              </button>
              {/* Modal Content */}
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedProgram.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProgram.fullDesc}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
