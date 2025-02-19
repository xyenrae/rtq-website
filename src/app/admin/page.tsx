// File: /app/dashboard/page.tsx atau /pages/dashboard.tsx (sesuaikan struktur proyekmu)
"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  FiUsers,
  FiImage,
  FiFileText,
  FiMessageSquare,
  FiUserPlus,
  FiCamera,
} from "react-icons/fi";
import { useDashboard } from "@/hooks/admin/dashboard/useDashboard";
import StatCard from "@/components/StatCard";
import Link from "next/link";

const LineChart = dynamic(() => import("@/components/LineChart"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />,
});

const BarChart = dynamic(() => import("@/components/BarChart"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />,
});

export default function Dashboard() {
  const { stats, recentActivity, isLoading, visitorData, contentData } =
    useDashboard();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatCard
            icon={<FiUsers className="w-6 h-6 text-blue-600" />}
            title="Total Santri"
            value={stats.santri}
            loading={isLoading}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatCard
            icon={<FiImage className="w-6 h-6 text-green-600" />}
            title="Total Gambar"
            value={stats.gambar}
            loading={isLoading}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatCard
            icon={<FiFileText className="w-6 h-6 text-purple-600" />}
            title="Total Berita"
            value={stats.berita}
            loading={isLoading}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StatCard
            icon={<FiMessageSquare className="w-6 h-6 text-red-600" />}
            title="Total Pesan"
            value={stats.pesan}
            loading={isLoading}
          />
        </motion.div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4">
            Statistik Pengunjung Bulanan
          </h2>
          <div className="h-64">
            <LineChart data={visitorData} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4">Distribusi Konten</h2>
          <div className="h-64">
            <BarChart data={contentData} />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4">Aktivitas Terakhir</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                Tidak ada aktivitas terbaru.
              </p>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm space-y-4"
        >
          <h2 className="text-lg font-semibold">Aksi Cepat</h2>
          <Link
            href="/admin/berita/tambah"
            className="w-full flex items-center space-x-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FiFileText className="w-5 h-5 text-purple-600" />
            <span>Tambah Berita</span>
          </Link>
          <Link
            href="/admin/galeri/tambah"
            className="w-full flex items-center space-x-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FiCamera className="w-5 h-5 text-green-600" />
            <span>Tambah Galeri</span>
          </Link>
          <Link
            href="/admin/pesan"
            className="w-full flex items-center space-x-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FiMessageSquare className="w-5 h-5 text-red-600" />
            <span>Lihat Pesan Masuk</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
