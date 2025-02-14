// app/admin/layout.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiMenu,
  FiX,
  FiGlobe,
  FiLogOut,
} from "react-icons/fi";
import { FaNewspaper, FaImage } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import LogoutModal from "@/components/ui/LogoutModal";

interface NavigationItem {
  name: string;
  href?: string; // dijadikan optional jika ada children
  icon?: React.ReactNode;
  children?: NavigationItem[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Buka submenu untuk pendaftaran secara default jika path-nya sesuai
  const [openSubMenu, setOpenSubMenu] = useState(
    pathname.startsWith("/admin/pendaftaran")
  );
  // Buka submenu untuk kelola website secara default jika path-nya sesuai
  const [openWebsiteSubMenu, setOpenWebsiteSubMenu] = useState(
    pathname.startsWith("/admin/website")
  );
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Update submenu pendaftaran saat path berubah
  useEffect(() => {
    if (pathname.startsWith("/admin/pendaftaran")) {
      setOpenSubMenu(true);
    } else {
      setOpenSubMenu(false);
    }
  }, [pathname]);

  // Update submenu kelola website saat path berubah
  useEffect(() => {
    if (pathname.startsWith("/admin/website")) {
      setOpenWebsiteSubMenu(true);
    } else {
      setOpenWebsiteSubMenu(false);
    }
  }, [pathname]);

  const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/admin", icon: <FiHome /> },
    { name: "Berita", href: "/admin/berita", icon: <FaNewspaper /> },
    { name: "Galeri", href: "/admin/galeri", icon: <FaImage /> },
    {
      name: "Pendaftaran",
      icon: <FiUsers />,
      children: [
        { name: "Data Santri", href: "/admin/pendaftaran/santri" },
        { name: "Data Orang Tua", href: "/admin/pendaftaran/orangtua" },
        { name: "Data Alamat", href: "/admin/pendaftaran/alamat" },
      ],
    },
    {
      name: "Kelola Website",
      icon: <FiGlobe />,
      children: [
        { name: "Guru", href: "/admin/website/guru" },
        { name: "Program", href: "/admin/website/program" },
      ],
    },
    { name: "Pengaturan", href: "/admin/pengaturan", icon: <FiSettings /> },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Anda telah berhasil logout.");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* Modal Konfirmasi Logout */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
      {/* Sidebar */}
      <motion.aside
        className={`flex flex-col justify-between fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-200 ease-in-out`}
      >
        <div>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-green-500">Admin Panel</h2>
          </div>

          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    {/* Parent item sebagai toggle (bukan Link) */}
                    <div
                      onClick={() =>
                        item.name === "Pendaftaran"
                          ? setOpenSubMenu(!openSubMenu)
                          : item.name === "Kelola Website" &&
                            setOpenWebsiteSubMenu(!openWebsiteSubMenu)
                      }
                      className="flex items-center p-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.icon && (
                        <span className="mr-3 text-xl">{item.icon}</span>
                      )}
                      {item.name}
                      <ChevronDown
                        className={`ml-auto transition-transform duration-200 ${
                          item.name === "Pendaftaran"
                            ? openSubMenu
                              ? "rotate-180"
                              : ""
                            : item.name === "Kelola Website" &&
                              openWebsiteSubMenu
                            ? "rotate-180"
                            : ""
                        }`}
                        size={16}
                      />
                    </div>
                    {item.name === "Pendaftaran" && openSubMenu && (
                      <div className="ml-6 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href!}
                            className={`flex items-center p-2 rounded-lg transition-colors ${
                              pathname === child.href
                                ? "bg-green-100 text-green-600 border-l-4 border-green-500"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    {item.name === "Kelola Website" && openWebsiteSubMenu && (
                      <div className="ml-6 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href!}
                            className={`flex items-center p-2 rounded-lg transition-colors ${
                              pathname === child.href
                                ? "bg-green-100 text-green-600 border-l-4 border-green-500"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-green-100 text-green-600 border-l-4 border-green-500"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon && (
                      <span className="mr-3 text-xl">{item.icon}</span>
                    )}
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
        {/* Tombol Logout di bagian paling bawah */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center p-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
          >
            <FiLogOut className="mr-3 text-xl" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 p-2 z-50 bg-green-500 text-white rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6">{children}</main>
    </div>
  );
}
