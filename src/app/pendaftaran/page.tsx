"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaMapPin,
  FaClock,
  FaInfoCircle,
  FaBuilding,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { createClient } from "@/utils/supabase/client";

// Variants untuk animasi hero section
const heroVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Variants untuk animasi pada AnimatedCard
const newsCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
      description: "Datang langsung ke lokasi RTQ kami selama jam kerja",
    },
    {
      icon: <FaInfoCircle className="w-8 h-8 mb-4" />,
      title: "Konsultasi dengan Guru",
      description: "Tim guru kami akan menjelaskan program dan jadwal belajar",
    },
    {
      icon: <FaClock className="w-8 h-8 mb-4" />,
      title: "Mulai Belajar",
      description: "Ikuti jadwal yang telah ditentukan dan mulai pembelajaran",
    },
  ];

  const infoItems = [
    {
      icon: <FaInfoCircle className="w-10 h-10" />,
      title: "Penjelasan Program",
      description:
        "Dapatkan penjelasan detail mengenai program belajar kami dari para ahli.",
    },
    {
      icon: <FaBuilding className="w-10 h-10" />,
      title: "Fasilitas Pembelajaran",
      description:
        "Kunjungi fasilitas lengkap dan modern yang mendukung proses belajar.",
    },
    {
      icon: <FaUsers className="w-10 h-10" />,
      title: "Tim Pengajar Profesional",
      description:
        "Bertemu dengan pengajar berpengalaman dan ramah yang siap mendampingi Anda.",
    },
    {
      icon: <FaClock className="w-10 h-10" />,
      title: "Jadwal yang Fleksibel",
      description:
        "Atur jadwal belajar sesuai dengan kebutuhan dan ketersediaan Anda.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section dengan Framer Motion */}
      <motion.div
        className="container mx-auto px-4 py-16"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          {/* Text Section */}
          <div className="flex-1 order-2 lg:order-1 relative z-10">
            <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                  Yanbu&#39;a Islami
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
                Bimbingan membaca Al-Qur&#39;an untuk anak usia dini dengan
                metode yang menyenangkan dan islami
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

      {/* Additional Info Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-semibold text-gray-700 mb-4">
            Informasi Tambahan
          </h3>
          <p className="text-gray-600 mb-8">
            Setelah datang ke lembaga, Anda akan mendapatkan pengalaman belajar
            yang lengkap dan menyenangkan melalui:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {infoItems.map((item, index) => (
              <AnimatedCard
                key={index}
                className="flex items-start bg-white p-6 rounded-xl shadow-md transition-transform hover:scale-105"
              >
                <div className="text-green-600 mr-8">{item.icon}</div>
                <div className="text-left">
                  <h4 className="text-xl font-semibold text-gray-700">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegistrationPage;
