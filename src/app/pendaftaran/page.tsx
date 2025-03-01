"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaMapPin,
  FaClock,
  FaInfoCircle,
  FaBuilding,
  FaUsers,
  FaClipboardCheck,
} from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { MdOutlineEmail } from "react-icons/md";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { createClient } from "@/utils/supabase/client";
import { FiChevronDown } from "react-icons/fi";

// Variants untuk animasi hero section
const heroVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Variants untuk animasi pada AnimatedCard - durasi ditingkatkan untuk kehalusan
const newsCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

// Komponen pembungkus animasi dengan tipe props
const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  return (
    <motion.div
      ref={ref}
      variants={newsCardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface CollapsibleInfoProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
}

// Perbaikan animasi pada collapse content dengan timing dan easing yang lebih smooth
const collapsibleContentVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
      opacity: { duration: 0.3 },
    },
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
      opacity: { duration: 0.3, delay: 0.1 },
    },
  },
};

const CollapsibleInfo: React.FC<CollapsibleInfoProps> = ({
  icon,
  title,
  description,
  isOpen,
  onToggle,
}) => {
  return (
    <AnimatedCard className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
      <div
        className={`flex items-center justify-between p-5 cursor-pointer transition-all duration-300 ${
          isOpen
            ? "bg-green-500 text-white hover:bg-green-600"
            : "hover:bg-gray-50"
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div className={`mr-4 ${isOpen ? "text-white" : "text-green-600"}`}>
            {icon}
          </div>
          <h4
            className={`text-lg font-semibold ${
              isOpen ? "text-white" : "text-gray-700"
            }`}
          >
            {title}
          </h4>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <FiChevronDown
            className={isOpen ? "text-white" : "text-gray-500"}
            size={20}
          />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={collapsibleContentVariants}
            className="overflow-hidden border-t border-gray-100 bg-gray-50"
          >
            <div className="p-5">
              <p className="text-gray-600">{description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedCard>
  );
};

// Variants untuk container dengan efek stagger yang lebih halus
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const RegistrationPage = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const supabase = createClient();

  // Mengambil nomor WhatsApp dan email dari Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("phone_number, email")
        .limit(1);

      if (error) {
        console.error("Error fetching settings:", error);
      } else {
        const settings = data[0];
        setWhatsappNumber(settings?.phone_number);
        setEmail(settings?.email);
      }
    };

    fetchSettings();
  }, [supabase]);

  const steps = [
    {
      icon: <FaMapPin className="w-8 h-8 mb-4" />,
      title: "Kunjungi Lembaga Kami",
      description:
        "Datang langsung ke lokasi RTQ kami selama jam kerja (13.30 - 16.30)",
    },
    {
      icon: <FaInfoCircle className="w-8 h-8 mb-4" />,
      title: "Konsultasi & Tes Kemampuan Baca Santri",
      description:
        "Ustadzah akan menjelaskan program membaca, melakukan tes kemampuan baca santri, dan menentukan jilid yang sesuai berdasarkan hasil tes.",
    },
    {
      icon: <FaClock className="w-8 h-8 mb-4" />,
      title: "Mulai Membaca Jilid",
      description:
        "Ikuti jadwal yang telah ditentukan dan mulai pembelajaran dengan membaca jilid yang telah ditetapkan",
    },
  ];

  const infoItems = [
    {
      icon: <FaInfoCircle className="w-6 h-6" />,
      title: "Penjelasan Program",
      description:
        "Santri belajar membaca Al-Qur'an dengan sistem kartu prestasi. Setiap halaman yang dibaca dicatat di kartu, dan jika sudah sampai halaman terakhir, akan diadakan tashih (evaluasi) untuk naik ke jilid berikutnya",
    },
    {
      icon: <FaBuilding className="w-6 h-6" />,
      title: "Fasilitas Pembelajaran",
      description:
        "Lembaga kami memiliki 2 lantai dengan total 5 ruang belajar, dan juga terdapat tempat wudhu, toilet, dan kantin. Setiap ruang dilengkapi kipas angin dan meja belajar yang nyaman",
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Ustadzah yang Telah Berpengalaman",
      description:
        "Ustadzah kami dengan sabar membimbing santri, memberikan contoh bacaan, dan menyesuaikan metode agar santri lebih mudah memahami",
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      title: "Jadwal Belajar",
      description:
        "Kegiatan belajar dilaksanakan Sabtu-Kamis (Jumat libur). Jam pertama (13.30-14.45) untuk jilid 0-3, dan jam kedua (15.00-16.25) untuk jilid 4-7 dan Al-Qur'an",
    },
    {
      icon: <FaClipboardCheck className="w-6 h-6" />,
      title: "Program Imtihan",
      description:
        "Program evaluasi resmi dari Yayasan Lajnah Muroqobah Yanbu'a (LMY) sebagai syarat kelulusan santri dari RTQ AL-Hikmah. Imtihan menandakan santri telah menyelesaikan seluruh program dan berhak mengikuti wisuda",
    },
    {
      icon: <GiGraduateCap className="w-10 h-10" />,
      title: "Wisuda",
      description:
        "Wisuda merupakan acara resmi untuk merayakan kelulusan dan penyelesaian seluruh program di RTQ AL-Hikmah",
    },
  ];

  // Set default active index ke 0 sehingga indeks pertama terbuka secara default
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="container mx-auto px-4 py-16"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          {/* Text Section */}
          <div className="flex-1 order-2 lg:order-1 relative z-10">
            <div className="max-w-2xl mx-auto lg:mx-0 sm:text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                  Yanbu'a Islami
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Informasi <br />
                <span className="relative whitespace-nowrap text-green-600">
                  <span className="relative z-10">
                    Pendaftaran <br />
                  </span>
                </span>
                RTQ Al-Hikmah
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Bimbingan membaca Al-Qur'an untuk anak usia dini dengan metode
                Yanbu'a
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex-1 order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
              <Image
                src="/images/hero-3.svg"
                alt="Hero Image"
                width={500}
                height={500}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Registration Steps */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-green-500 mb-12">
          Proses Pendaftaran
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <AnimatedCard
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="text-green-500 flex justify-center">
                {step.icon}
              </div>
              <div className="text-center md:text-start">
                <h3 className="text-xl font-semibold mb-4 text-gray-500">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-20">
        <AnimatedCard className="bg-green-500 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Butuh Bantuan?</h2>
          <p className="text-lg mb-8">Hubungi kami melalui kontak berikut:</p>

          <div className="flex justify-center gap-6">
            <a
              href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full hover:bg-green-50 transition-colors"
            >
              <FaWhatsapp className="w-5 h-5" />
              WhatsApp
            </a>

            <a
              href={email ? `mailto:${email}` : "#"}
              className="flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full hover:bg-green-50 transition-colors"
            >
              <MdOutlineEmail className="w-5 h-5" />
              Email
            </a>
          </div>
        </AnimatedCard>
      </section>

      {/* Additional Info Section with improved animation */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h3 className="text-3xl font-semibold text-gray-700 mb-4">
            Informasi Tambahan
          </h3>
          <p className="text-gray-600 mb-6">
            Klik pada item berikut untuk melihat informasi lebih detail tentang
            program kami
          </p>
        </div>

        <motion.div
          className="max-w-3xl mx-auto space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {infoItems.map((item, index) => (
            <CollapsibleInfo
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              isOpen={activeIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default RegistrationPage;
