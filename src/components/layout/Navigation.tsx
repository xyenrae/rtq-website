import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-rtq.png"
            alt="Logo RTQ"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold">RTQ Al-Hikmah</span>
        </Link>

        <div className="hidden md:flex gap-6">
          <NavLink href="/" label="Beranda" />
          <NavLink href="/berita" label="Berita" />
          <NavLink href="/pendaftaran" label="Pendaftaran" />
          <NavLink href="/galeri" label="Galeri" />
          <NavLink href="/kontak" label="Kontak" />
        </div>

        <Link
          href="/admin"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Login Admin
        </Link>
      </div>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-blue-600 transition-colors"
    >
      {label}
    </Link>
  );
}
