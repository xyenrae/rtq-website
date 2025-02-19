import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="text-gray-600 mt-12 py-8">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Logo & Deskripsi */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo-rtq.png"
              alt="Logo RTQ"
              width={100}
              height={100}
              className="transition-all duration-300"
            />
            <div className="flex flex-col">
              <span className={`font-bold text-green-500 text-4xl`}>
                Al-Hikmah
              </span>
              <span className={`text-green-500`}>
                Cinta Al-Qur&#39;an, Cinta Ilmu
              </span>
            </div>
          </Link>
          <p className="mt-4 text-center md:text-left">
            Kami berkomitmen untuk memberikan kesempatan belajar yang sesuai
            dengan usia bagi setiap anak yang terdaftar di RTQ Al-Hikmah.
          </p>
        </div>

        {/* Link Cepat */}
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-4">Navigasi Cepat</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full justify-items-center">
            <div className="space-y-2">
              <FooterLink href="/" label="Beranda" />
              <FooterLink href="/berita" label="Berita" />
              <FooterLink href="/pendaftaran" label="Pendaftaran" />
            </div>
            <div className="space-y-2">
              <FooterLink href="/galeri" label="Galeri" />
              <FooterLink href="/kontak" label="Kontak" />
              <FooterLink href="/login" label="Admin" />
            </div>
          </div>
        </div>

        {/* Kontak */}
        <div className="flex flex-col items-center md:items-end">
          <h3 className="text-2xl font-bold mb-4">Kontak Kami</h3>
          <div className="space-y-2 text-gray-600 text-center md:text-right">
            <p>Ds. Ngurensiti Rt.06, Rw.01, Kec.Wedarijaksa, Kab.Pati</p>
            <p>6285641111160</p>
            <p>alhikmahngurensiti@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-400">
        © 2025 RTQ Al-Hikmah. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="hover:font-medium transition-colors block text-gray-600 hover:text-green-500"
    >
      {label}
    </Link>
  );
}
