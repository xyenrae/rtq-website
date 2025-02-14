// app/admin/layout.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiUsers, FiSettings, FiMenu, FiX } from "react-icons/fi";
import { FaNewspaper, FaImage } from "react-icons/fa";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("/admin");

  const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/admin", icon: <FiHome /> },
    { name: "Berita", href: "/admin/berita", icon: <FaNewspaper /> },
    { name: "Galeri", href: "/admin/galeri", icon: <FaImage /> },
    { name: "Pengguna", href: "/admin/pengguna", icon: <FiUsers /> },
    { name: "Pengaturan", href: "/admin/pengaturan", icon: <FiSettings /> },
  ];

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-green-500">Admin Panel</h2>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                activeNav === item.href
                  ? "bg-green-100 text-green-600 border-l-4 border-green-500"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => {
                setActiveNav(item.href);
                setIsSidebarOpen(false);
              }}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
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
