"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function ProgramKami() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 px-4 py-8">
        {/* Image Section */}
        <div className="flex-1 relative w-full h-[300px] sm:h-[400px] lg:h-[500px] mt-8 lg:mt-0">
          <Image
            src="/images/hero-2.svg"
            alt=""
            fill
            className=" object-center"
            priority
          />
        </div>

        {/* Text Section */}
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-2xl lg:text-3xl text-gray-800">
            Program Kami
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Belajar Al-Qur&#39;an adalah investasi akhirat. Di RTQ Al-Hikmah,
            setiap santri diajarkan membaca ayat suci dan menghidupkan
            nilai-nilai Islam dalam kehidupan sehari-hari.
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 text-white rounded-lg p-4 bg-green-500">
            {[
              { number: "17+", title: "Tahun", subtitle: "Pengalaman" },
              { number: "24+", title: "Santri Baru", subtitle: "Setiap Tahun" },
              { number: "15+", title: "Santri Juara", subtitle: "Lomba" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-bold text-xl lg:text-2xl">{stat.number}</p>
                <p className="text-sm lg:text-base">{stat.title}</p>
                <p className="text-sm lg:text-base">{stat.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/images/gt.png"
                alt="Icon"
                width={25}
                height={25}
                className="flex-shrink-0"
              />
              <p className="ml-2 text-gray-700">
                Setiap santri istimewa, kami bantu capai yang terbaik.
              </p>
            </div>
            <div className="flex items-center">
              <Image
                src="/images/gt.png"
                alt="Icon"
                width={25}
                height={25}
                className="flex-shrink-0"
              />
              <p className="ml-2 text-gray-700">
                Guru yang berdedikasi untuk mencetak generasi Islami.
              </p>
            </div>
          </div>

          {/* Button Section */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-400 py-3 px-6 rounded-full text-white font-medium w-fit hover:bg-yellow-500 transition-colors"
          >
            Lihat Detail
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Detail Program Kami
              </h3>
              <p className="text-gray-600 mb-6">
                Belajar Al-Qur’an di RTQ Al-Hikmah tidak hanya tentang membaca,
                tapi juga tentang{" "}
                <span className="font-semibold">
                  memahami nilai-nilai Islam
                </span>{" "}
                yang bisa diterapkan sehari-hari. Kami percaya bahwa{" "}
                <span className="font-semibold">setiap santri istimewa</span>,
                dan kami siap membantu mereka mencapai potensi terbaik.
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
