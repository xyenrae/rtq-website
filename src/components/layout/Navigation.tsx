"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-rtq.png"
            alt="Logo RTQ"
            width={isScrolled ? 80 : 100}
            height={isScrolled ? 80 : 100}
            className="transition-all duration-300"
          />
          <div className="flex flex-col">
            <span
              className={`font-bold text-green-500 transition-all duration-300 ${
                isScrolled ? "text-3xl" : "text-4xl"
              }`}
            >
              Al-Hikmah
            </span>
            <span
              className={`text-green-500 transition-all duration-300 ${
                isScrolled ? "text-xs" : "text-sm"
              }`}
            >
              Cinta Al-Qur&#39;an, Cinta Ilmu
            </span>
          </div>
        </Link>

        <div className="hidden md:flex gap-6 text-lg">
          <NavLink href="/" label="Beranda" isScrolled={isScrolled} />
          <NavLink href="/berita" label="Berita" isScrolled={isScrolled} />
          <NavLink
            href="/pendaftaran"
            label="Pendaftaran"
            isScrolled={isScrolled}
          />
          <NavLink href="/galeri" label="Galeri" isScrolled={isScrolled} />
          <NavLink href="/kontak" label="Kontak" isScrolled={isScrolled} />
        </div>

        <Link
          href="/admin"
          className={`bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-all duration-300 ${
            isScrolled ? "px-3 py-1.5 text-sm" : "px-4 py-2"
          }`}
        >
          Login Admin
        </Link>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  label,
  isScrolled,
}: {
  href: string;
  label: string;
  isScrolled: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative pb-1 text-gray-600 hover:font-medium transition-all duration-300 ${
        isScrolled ? "text-base" : "text-lg"
      } ${isActive ? "font-medium" : ""}`}
    >
      {label}
      {isActive && (
        <span className="absolute left-0 right-0 mx-auto bottom-0 w-1/2 h-0.5 bg-yellow-400 rounded-full"></span>
      )}
    </Link>
  );
}
