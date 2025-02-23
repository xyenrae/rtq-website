"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BsEye, BsClockFill, BsCalendarEvent } from "react-icons/bs";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface CardBeritaProps {
  item: {
    id: string;
    gambar: string;
    judul: string;
    views: number;
    kategori: {
      nama: string;
    };
    waktu_baca: number;
    ringkasan: string;
    created_at: string;
  };
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const CardBerita: React.FC<CardBeritaProps> = ({ item }) => {
  return (
    <motion.article
      variants={fadeInUp}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <Link href={`/berita/${item.id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.gambar}
            alt={item.judul}
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <BsEye className="text-gray-600" />
            <span className="text-gray-700">{item.views}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full line-clamp-2">
              {item.kategori.nama}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <BsClockFill className="mr-1" />
              {item.waktu_baca} min
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
            {item.judul}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">{item.ringkasan}</p>

          <div className="flex items-center text-sm text-gray-500">
            <BsCalendarEvent className="mr-2" />
            {format(new Date(item.created_at), "d MMMM yyyy", {
              locale: id,
            })}
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default CardBerita;
