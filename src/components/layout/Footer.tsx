import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12 py-8">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Logo & Deskripsi */}
        <div className="flex flex-col items-center md:items-start">
          <Image
            src="/images/logo-rtq-white.png"
            alt="Logo RTQ"
            width={80}
            height={80}
          />
          <p className="mt-4 text-gray-300">
            Membentuk generasi Qurani yang berakhlak mulia
          </p>
        </div>

        {/* Link Cepat */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4">Navigasi Cepat</h3>
          <div className="space-y-2">
            <FooterLink href="/berita" label="Berita" />
            <FooterLink href="/galeri" label="Galeri" />
            <FooterLink href="/kontak" label="Kontak" />
            <FooterLink href="/admin" label="Admin" />
          </div>
        </div>

        {/* Kontak */}
        <div className="flex flex-col items-center md:items-end">
          <h3 className="text-lg font-bold mb-4">Kontak Kami</h3>
          <div className="space-y-2 text-gray-300">
            <p>📌 Jl. Pendidikan No. 123, Jakarta</p>
            <p>📞 (021) 1234-5678</p>
            <p>📧 info@rtq-alikhlas.id</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
        © 2024 RTQ Al-Ikhlas. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="hover:text-blue-400 transition-colors">
      {label}
    </Link>
  );
}
