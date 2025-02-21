"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
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
              Membentuk Santri Cinta
              <span className="relative whitespace-nowrap text-green-600">
                <span className="relative z-10"> Al-Qur&#39;an</span>
              </span>{" "}
              Sejak Dini
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Mari wujudkan generasi Qur&#39;ani bersama ratusan santri lainnya
            </p>
            <div className="flex flex-row gap-4 justify-center lg:justify-start">
              <Link href={`/pendaftaran`}>
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-green-200">
                  Daftar Sekarang
                </button>
              </Link>
              <button
                onClick={() => handleScroll("program-section")}
                className="border-2 border-green-600 text-green-700 hover:bg-green-50 px-8 py-4 rounded-full font-semibold transition-all"
              >
                Info Program
              </button>
            </div>
          </div>
        </div>
        {/* Image Section */}
        <div className="flex-1 order-1 lg:order-2 relative w-full h-[300px] sm:h-[400px] lg:h-[500px] mt-8 lg:mt-0">
          <Image
            src="/images/hero-1.svg"
            alt="Hero Image"
            fill
            className="object-center"
            priority
          />
        </div>
      </div>
    </div>
  );
}
