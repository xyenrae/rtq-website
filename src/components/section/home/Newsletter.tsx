import Image from "next/image";

export default function Newsletter() {
  return (
    <div className="container">
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <Image
            src="/images/newsletter.png"
            alt="Background Testimoni"
            fill
            className="object-cover object-center rounded-lg"
            priority
          />
        </div>

        <div className="relative z-20 py-24">
          <p className="font-bold text-white text-center text-2xl mb-6">
            Bergabung dengan Newsletter Kami
          </p>
          <p className="w-1/2 mx-auto text-center text-white mb-6">
            Dapatkan informasi terkini seputar kegiatan, program, dan tips
            pendidikan untuk anak Anda langsung di inbox. Bergabunglah dengan
            newsletter kami dan jadi yang pertama tahu tentang update terbaru di
            RTQ Al-Hikmah!
          </p>

          <form className="w-4/12 mx-auto">
            <div className="relative">
              <input
                type="text"
                id="email"
                className="block w-full p-4 ps-4 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 outline-none"
                placeholder="Your Email"
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-yellow-400 hover:bg-yellow-500 font-medium rounded-full text-sm px-4 py-2"
              >
                Ikuti Sekarang
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
