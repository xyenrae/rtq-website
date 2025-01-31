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
      <section className="mt-32">
        <div className="flex w-full flex-col items-center">
          <p className="font-semibold text-2xl">Program Unggulan</p>
          <p className="w-1/2 text-center mt-4">
            Program RTQ Kami mencakup berbagai tingkatan untuk anak-anak usia
            3-12 tahun, dengan kurikulum berbasis Metode Yanbu&#39;a dan
            pembentukan akhlak Islami.
          </p>
        </div>
        <div>card slider</div>
      </section>
    </div>
  );
}
