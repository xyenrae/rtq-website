"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const formatName = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const fullName = data.user.user_metadata.full_name || "User";
        setUserFullName(formatName(fullName));
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const fullName = session.user.user_metadata.full_name || "User";
          setUserFullName(formatName(fullName));
        } else if (event === "SIGNED_OUT") {
          setUserFullName(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi untuk logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    toast.success("Anda telah berhasil logout.");
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
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

        {/* Navigasi */}
        <div className="hidden md:flex gap-6 text-lg">
          <NavLink href="/" label="Beranda" isScrolled={isScrolled} />
          <NavLink href="/berita" label="Berita" isScrolled={isScrolled} />
          <NavLink
            href={userFullName ? "/pendaftaran" : "/pendaftaran"}
            label={userFullName ? "Data Diri" : "Pendaftaran"}
            isScrolled={isScrolled}
          />
          <NavLink href="/kontak" label="Kontak" isScrolled={isScrolled} />
        </div>

        {/* Sapaan Pengguna atau Tombol Login */}
        {userFullName ? (
          <div className="relative" ref={dropdownRef}>
            {/* Nama Pengguna */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
              className={`text-gray-600 underline font-medium transition-all duration-300 ${
                isScrolled ? "text-base" : "text-lg"
              } focus:outline-none`}
            >
              Hai, {userFullName}
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-red-500 border border-gray-200 rounded shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="flex justify-center w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600 rounded transition-all duration-300"
                >
                  <Image
                    src={"/images/logout.svg"}
                    alt=""
                    width={20}
                    height={20}
                  ></Image>
                  <span className="ml-1 my-auto">Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className={`bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-all duration-300 ${
              isScrolled ? "px-3 py-1.5 text-sm" : "px-4 py-2"
            }`}
          >
            Login Sekarang
          </Link>
        )}
      </div>
    </nav>
  );
}

// Komponen NavLink
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
