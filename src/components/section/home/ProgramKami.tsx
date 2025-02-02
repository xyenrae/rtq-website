import Image from "next/image";
export default function ProgramKami() {
  return (
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
          setiap santri diajarkan membaca ayat suci dan menghidupkan nilai-nilai
          Islam dalam kehidupan sehari-hari.
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
            <Image src="/images/gt.png" alt="" width={25} height={25}></Image>
            <p className="ml-2">
              Setiap santri istimewa, kami bantu capai yang terbaik.
            </p>
          </div>
          <div className="flex mt-2">
            <Image src="/images/gt.png" alt="" width={25} height={25}></Image>
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
  );
}
