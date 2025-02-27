// app/admin/layout.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiHome, FiSettings, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { IoPeople } from "react-icons/io5";
import { FaNewspaper, FaImage } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LogoutModal from "@/components/ui/LogoutModal";

interface NavigationItem {
  name: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Set sidebar open by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [openSubMenu, setOpenSubMenu] = useState(
    pathname.startsWith("/admin/pendaftaran")
  );
  const [openBeritaSubMenu, setOpenBeritaSubMenu] = useState(
    pathname.startsWith("/admin/berita")
  );
  const [openGaleriSubMenu, setOpenGaleriSubMenu] = useState(
    pathname.startsWith("/admin/galeri")
  );

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Update submenu states based on current path
  useEffect(() => {
    if (pathname.startsWith("/admin/berita")) {
      setOpenBeritaSubMenu(true);
    } else {
      setOpenBeritaSubMenu(false);
    }

    if (pathname.startsWith("/admin/galeri")) {
      setOpenGaleriSubMenu(true);
    } else {
      setOpenGaleriSubMenu(false);
    }

    if (pathname.startsWith("/admin/pendaftaran")) {
      setOpenSubMenu(true);
    } else {
      setOpenSubMenu(false);
    }
  }, [pathname]);

  const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/admin", icon: <FiHome /> },
    {
      name: "Berita",
      icon: <FaNewspaper />,
      children: [
        { name: "Semua Berita", href: "/admin/berita" },
        { name: "Kategori Berita", href: "/admin/berita/kategori" },
      ],
    },
    {
      name: "Galeri",
      icon: <FaImage />,
      children: [
        { name: "Semua Galeri", href: "/admin/galeri" },
        { name: "Kategori Galeri", href: "/admin/galeri/kategori" },
      ],
    },
    { name: "Guru", href: "/admin/guru", icon: <IoPeople /> },
    { name: "Pengaturan", href: "/admin/pengaturan", icon: <FiSettings /> },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    toast.success("Berhasil Logout!");
  };

  const toggleSubmenu = (menuName: string) => {
    if (menuName === "Berita") {
      setOpenBeritaSubMenu(!openBeritaSubMenu);
    } else if (menuName === "Galeri") {
      setOpenGaleriSubMenu(!openGaleriSubMenu);
    } else if (menuName === "Pendaftaran") {
      setOpenSubMenu(!openSubMenu);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Modal Konfirmasi Logout */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ height: "100dvh" }}
      >
        <div className="flex flex-col h-full">
          {/* Logo, title and toggle button in the same header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <h2 className="ml-3 text-xl font-bold text-green-600">
                Admin Panel
              </h2>
            </div>
            {/* Mobile Menu Button - Inside sidebar */}
            <button
              className="md:hidden text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  {item.children ? (
                    <div className="mb-1">
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                          (item.name === "Berita" &&
                            pathname.startsWith("/admin/berita")) ||
                          (item.name === "Galeri" &&
                            pathname.startsWith("/admin/galeri")) ||
                          (item.name === "Pendaftaran" &&
                            pathname.startsWith("/admin/pendaftaran"))
                            ? "bg-green-50 text-green-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown
                          className={`transition-transform duration-200 ${
                            (item.name === "Berita" && openBeritaSubMenu) ||
                            (item.name === "Galeri" && openGaleriSubMenu) ||
                            (item.name === "Pendaftaran" && openSubMenu)
                              ? "rotate-180"
                              : ""
                          }`}
                          size={16}
                        />
                      </button>

                      {/* Submenu */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          (item.name === "Berita" && openBeritaSubMenu) ||
                          (item.name === "Galeri" && openGaleriSubMenu) ||
                          (item.name === "Pendaftaran" && openSubMenu)
                            ? "max-h-40"
                            : "max-h-0"
                        }`}
                      >
                        <ul className="mt-1 ml-7 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <Link
                                href={child.href!}
                                className={`block p-2 pl-3 rounded-md text-sm transition-colors ${
                                  pathname === child.href
                                    ? "bg-green-50 text-green-600 border-l-2 border-green-500"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                                onClick={() => {
                                  if (window.innerWidth < 768) {
                                    setIsSidebarOpen(false);
                                  }
                                }}
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className={`flex items-center p-3 rounded-lg transition-colors ${
                        pathname === item.href
                          ? "bg-green-50 text-green-600 font-medium border-l-2 border-green-500"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          setIsSidebarOpen(false);
                        }
                      }}
                    >
                      <span className="text-lg mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile and logout */}
          <div className="mt-auto p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">Admin</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center p-2 mt-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Menu Button - Outside sidebar, only visible when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          className="md:hidden fixed top-4 left-4 p-2 z-50 bg-white text-green-600 rounded-full shadow-lg hover:bg-green-50 transition-colors"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6">{children}</main>
    </div>
  );
}
