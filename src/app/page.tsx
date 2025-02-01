import CardSliderProgram from "@/components/card/CardSliderProgram";
import CardSliderJilid from "@/components/card/CardSliderJilid";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mt-16">
      {/* Hero Section */}
      <section>
        <div className="flex w-full items-center">
          <div className="flex-1 grid gap-4">
            <p className="text-green-500 font-semibold text-xl">
              Yanbu&#39;a Islami
            </p>
            <p className="text-5xl font-bold">
              Membentuk Santri <br /> Cinta Al-Qur&#39;an <br /> Sejak Dini
            </p>
            <p className="text-gray-600 text-lg">
              Yuk, Bergabung Bersama Kami!
            </p>
            <button className="bg-yellow-400 text-black rounded-full w-fit p-3 px-6 hover:bg-yellow-500 transition-colors">
              Daftar Sekarang
            </button>
          </div>

          <div className="flex-1 relative w-full h-full min-h-[400px]">
            <Image
              src="/images/hero.svg"
              alt=""
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>
      </section>
      <section className="mt-32 overflow-hidden">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Program Unggulan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Program pembelajaran Al-Qur&#39;an terstruktur untuk berbagai usia
              dengan kurikulum berbasis Metode Yanbu&#39;a
            </p>
          </div>

          <CardSliderProgram />
        </div>
      </section>
      <section className="mt-32">
        <div className="flex w-full">
          <div className="flex-1 relative w-full h-full min-h-[400px]">
            <Image
              src="/images/hero-2.png"
              alt=""
              fill
              className="object-contain object-center"
              priority
            />
          </div>
          <div className="flex-1 flex flex-col gap-4 px-4">
            <p className="font-bold text-2xl">Program Kami</p>
            <p className="pr-6">
              Belajar Al-Qur&#39;an adalah investasi akhirat. Di RTQ Al-Hikmah,
              setiap santri diajarkan membaca ayat suci dan menghidupkan
              nilai-nilai Islam dalam kehidupan sehari-hari.
            </p>
            <div className="grid grid-cols-3 text-white rounded-lg p-4 bg-green-500 mt-2">
              <div className="text-center">
                <p className="font-bold">14+</p>
                <p>Tahun</p>
                <p>Pengalaman</p>
              </div>
              <div className="text-center">
                <p className="font-bold">14+</p>
                <p>Santri Baru</p>
                <p>Setiap Tahun</p>
              </div>
              <div className="text-center">
                <p className="font-bold">14+</p>
                <p>Santri Juara di</p>
                <p>Berbagai Lomba</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex">
                <Image
                  src="/images/gt.png"
                  alt=""
                  width={25}
                  height={25}
                ></Image>
                <p className="ml-2">
                  Setiap santri istimewa, kami bantu capai yang terbaik.
                </p>
              </div>
              <div className="flex mt-2">
                <Image
                  src="/images/gt.png"
                  alt=""
                  width={25}
                  height={25}
                ></Image>
                <p className="ml-2">
                  Guru yang berdedikasi untuk mencetak generasi Islami.
                </p>
              </div>
            </div>
            <button className="bg-yellow-400 py-3 px-9 rounded-full w-fit text-white mt-4">
              Lihat Detail
            </button>
          </div>
        </div>
      </section>
      <section className="mt-32 overflow-hidden">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Program Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              RTQ Al-Hikmah didirikan pada 1974 dengan visi untuk membimbing
              generasi Qur&#39;ani melalui pendidikan Islami yang berkualitas.
            </p>
          </div>

          <CardSliderJilid />
        </div>
      </section>
    </div>
  );
}
