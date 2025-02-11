import Image from "next/image";

export default function ProgramKami() {
  return (
    <div className="flex flex-col lg:flex-row w-full gap-8 px-4 py-8 sm:px-0 sm:container">
      {/* Image Section */}
      <div className="flex-1 relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
        <Image
          src="/images/hero-2.png"
          alt="Ilustrasi pembelajaran"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Text Section */}
      <div className="flex-1 flex flex-col gap-6">
        <p className="font-bold text-2xl lg:text-3xl text-gray-800">
          Program Kami
        </p>
        <p className="text-gray-600 leading-relaxed pr-6">
          Belajar Al-Qur&#39;an adalah investasi akhirat. Di RTQ Al-Hikmah,
          setiap santri diajarkan membaca ayat suci dan menghidupkan nilai-nilai
          Islam dalam kehidupan sehari-hari.
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 text-white rounded-lg p-4 bg-green-500">
          {[
            { number: "14+", title: "Tahun", subtitle: "Pengalaman" },
            { number: "14+", title: "Santri Baru", subtitle: "Setiap Tahun" },
            {
              number: "14+",
              title: "Santri Juara",
              subtitle: "Lomba",
            },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-bold text-xl lg:text-2xl">{stat.number}</p>
              <p className="text-sm lg:text-base">{stat.title}</p>
              <p className="text-sm lg:text-base">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-4 space-y-4">
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

        {/* Button */}
        <button className="bg-yellow-400 py-3 px-6 rounded-full text-white font-medium mt-4 w-fit hover:bg-yellow-500 transition-colors">
          Lihat Detail
        </button>
      </div>
    </div>
  );
}
