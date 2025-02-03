import Image from "next/image";

export default function Berita() {
  return (
    <div className="container">
      <p className="font-bold text-2xl">Berita Terbaru</p>
      <p className="text-lg mt-2">
        Kami terus berinovasi untuk memberikan pengalaman belajar terbaik bagi
        setiap anak, sesuai dengan kebutuhan dan <br /> tahap perkembangannya.
      </p>
      <div className="grid grid-cols-3 gap-5 mt-4">
        <div className="border border-2 rounded-t-3xl pb-4">
          <Image
            src="/images/gallery-1.png"
            alt="Ilustrasi pembelajaran"
            width={1000}
            height={300}
            priority
            className="rounded-t-3xl"
          />
          <div className="flex mt-2 ml-4 text-sm text-gray-600">
            <Image
              src="/images/user.png"
              alt="Ilustrasi pembelajaran"
              width={20}
              height={20}
              priority
            />
            <p className="ml-1">by Admin</p>
            <Image
              src="/images/date.png"
              alt="Ilustrasi pembelajaran"
              width={20}
              height={20}
              priority
              className="ml-4"
            />
            <p className="ml-1">3 Februari 2025</p>
          </div>
          <p className="mx-4 mt-2 text-xl">
            Pendaftaran TPQ Al-Hikmah 2025 Kini Dibuka!
          </p>
        </div>
        <div className="border border-2 rounded-t-3xl pb-4">
          <Image
            src="/images/gallery-1.png"
            alt="Ilustrasi pembelajaran"
            width={1000}
            height={300}
            priority
            className="rounded-t-3xl"
          />
          <div className="flex mt-2 ml-4 text-sm text-gray-600">
            <Image
              src="/images/user.png"
              alt="Ilustrasi pembelajaran"
              width={20}
              height={20}
              priority
            />
            <p className="ml-1">by Admin</p>
            <Image
              src="/images/date.png"
              alt="Ilustrasi pembelajaran"
              width={20}
              height={20}
              priority
              className="ml-4"
            />
            <p className="ml-1">3 Februari 2025</p>
          </div>
          <p className="mx-4 mt-2 text-xl">
            Pendaftaran TPQ Al-Hikmah 2025 Kini Dibuka!
          </p>
        </div>
        <div className="border border-2 rounded-t-3xl pb-4">
          <Image
            src="/images/gallery-1.png"
            alt="Ilustrasi pembelajaran"
            width={1000}
            height={300}
            priority
            className="rounded-t-3xl"
          />
          <div className="flex mt-2 ml-4 text-sm text-gray-600">
            <Image
              src="/images/user.png"
              alt="Ilustrasi pembelajaran"
              width={20}
              height={20}
              priority
            />
            <p className="ml-1">by Admin</p>
            <Image
              src="/images/date.png"
              alt="Ilustrasi pembelajaran"
              width={20}
              height={20}
              priority
              className="ml-4"
            />
            <p className="ml-1">3 Februari 2025</p>
          </div>
          <p className="mx-4 mt-2 text-xl">
            Pendaftaran TPQ Al-Hikmah 2025 Kini Dibuka!
          </p>
        </div>
      </div>
    </div>
  );
}
