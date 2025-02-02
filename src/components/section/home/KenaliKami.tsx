"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function KenaliKami() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const items = [
    {
      title: "Membangun Generasi Qur'ani Sejak Dini",
      content:
        "Kami di RTQ Al-Hikmah percaya bahwa setiap anak memiliki potensi yang luar biasa. Dengan pendekatan yang penuh kasih dan dedikasi, kami membimbing mereka untuk mengenal dan mencintai Al-Qur'an sejak usia dini. Temukan bagaimana kami mendidik dengan metode yang efektif dan menyenangkan.",
    },
    {
      title: "Pendidikan dengan Metode Yanbu'a",
      content:
        "Metode Yanbu'a adalah pendekatan yang kami gunakan untuk mengajarkan Al-Qur'an dengan cara yang terstruktur dan menyenangkan. Melalui tahapan pembelajaran yang disesuaikan dengan usia, santri kami belajar dengan percaya diri dan penuh semangat. Mari bergabung dan lihat bagaimana metode ini membantu anak Anda berkembang.",
    },
    {
      title: "Mengasah Potensi Anak dengan Kurikulum Islami Terbaik",
      content:
        "Setiap anak berhak mendapatkan pendidikan terbaik, dan kami berkomitmen untuk memberikan itu. Di RTQ Al-Hikmah, kami memadukan kurikulum islami yang holistik dengan pembelajaran yang menyenangkan, sehingga anak-anak tidak hanya cerdas, tetapi juga berakhlak mulia.",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row w-full gap-8">
      <div className="flex-1 flex flex-col gap-4 px-4">
        <p className="text-2xl font-semibold mb-8">Kenali Kami Lebih Dekat</p>

        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
                className={`w-full flex justify-between items-center p-4 transition-colors ${
                  activeIndex === index ? "bg-yellow-400" : "hover:bg-gray-50"
                }`}
              >
                <h3
                  className={`text-lg font-medium text-gray-800 text-start ${
                    activeIndex === index ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item.title}
                </h3>
                <ChevronDown
                  className={`text-gray-600 transform transition-transform ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <div className="p-4">
                  <p className="text-gray-600 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative w-full h-full min-h-[400px]">
        <Image
          src="/images/hero-2.png"
          alt="Ilustrasi pembelajaran"
          fill
          className="object-contain object-center"
          priority
        />
      </div>
    </div>
  );
}
