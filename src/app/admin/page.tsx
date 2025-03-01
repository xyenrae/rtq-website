"use client";
import React, { useEffect, useState } from "react";
import { useDashboard } from "@/hooks/admin/dashboard/useDashboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLoader,
  FiCalendar,
  FiCheckSquare,
  FiTrendingUp,
  FiUsers,
  FiActivity,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-toastify";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface TimeRangeButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "purple" | "emerald" | "green" | "gray";
}

export interface ViewData {
  date?: string;
  week_start?: string;
  month_start?: string;
  views: number;
}

interface VisitorsChartProps {
  data: ViewData[];
  timeRange: "daily" | "weekly" | "monthly";
}

const DashboardPage: React.FC = () => {
  const { stats, loading, setTimeRange, refreshData } = useDashboard();
  const [chartKey, setChartKey] = useState<number>(0);

  // Update chart key setiap kali time range berubah
  useEffect(() => {
    setChartKey((prev) => prev + 1);
  }, [stats.timeRange]);

  const handleRefresh = async (): Promise<void> => {
    try {
      await refreshData();
      toast.success("Data dashboard berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui data");
      throw error;
    }
  };

  const handleTimeRangeChange = (
    range: "daily" | "weekly" | "monthly"
  ): void => {
    setTimeRange(range);
  };

  if (loading && !stats.chartData.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin h-12 w-12 text-emerald-600 mb-4" />
        <p className="text-gray-600 font-medium">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Dashboard Admin
          </h1>
          <p className="text-gray-500 mt-1">
            Pantau statistik pengunjung website Anda
          </p>
        </motion.div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all self-start"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Perbarui</span>
        </button>
      </div>

      {/* Time Range Picker */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-wrap gap-3 mb-8"
      >
        <TimeRangeButton
          active={stats.timeRange === "daily"}
          onClick={() => handleTimeRangeChange("daily")}
          icon={<FiCalendar className="w-4 h-4" />}
          label="7 Hari Terakhir"
        />
        <TimeRangeButton
          active={stats.timeRange === "weekly"}
          onClick={() => handleTimeRangeChange("weekly")}
          icon={<FiCheckSquare className="w-4 h-4" />}
          label="4 Minggu Terakhir"
        />
        <TimeRangeButton
          active={stats.timeRange === "monthly"}
          onClick={() => handleTimeRangeChange("monthly")}
          icon={<FiCalendar className="w-4 h-4" />}
          label="12 Bulan Terakhir"
        />
      </motion.div>

      {/* Statistik Utama */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8"
      >
        <StatCard
          title="Total Pengunjung"
          value={stats.totalViews.toLocaleString("id-ID")}
          icon={<FiUsers className="w-5 h-5 text-purple-500" />}
          color="purple"
        />
        <StatCard
          title="Pengunjung Hari Ini"
          value={stats.viewsToday.toLocaleString("id-ID")}
          icon={<FiTrendingUp className="w-5 h-5 text-emerald-500" />}
          color="emerald"
        />
        <StatCard
          title="Pengunjung Minggu Ini"
          value={stats.viewsThisWeek.toLocaleString("id-ID")}
          icon={<FiActivity className="w-5 h-5 text-green-500" />}
          color="green"
        />
      </motion.div>

      {/* Grafik */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chartKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Tren Kunjungan
            </h3>
            <p className="text-sm text-gray-500 mt-1 sm:mt-0">
              {getRangeLabel(stats.timeRange)}
            </p>
          </div>

          <div className="w-full h-[300px] md:h-[350px]">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <FiLoader className="w-8 h-8 mb-3 text-emerald-500 animate-spin" />
                <p className="text-gray-500">Memuat data chart...</p>
              </div>
            ) : (
              <VisitorsChart
                data={stats.chartData}
                timeRange={stats.timeRange}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const TimeRangeButton: React.FC<TimeRangeButtonProps> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
      ${
        active
          ? "bg-emerald-600 text-white shadow-md"
          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
      }
    `}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const getGradient = (): string => {
    switch (color) {
      case "purple":
        return "from-purple-50 to-purple-100";
      case "emerald":
        return "from-emerald-50 to-emerald-100";
      case "green":
        return "from-green-50 to-green-100";
      default:
        return "from-gray-50 to-gray-100";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className={`bg-gradient-to-br ${getGradient()} p-3 rounded-lg`}>
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const getRangeLabel = (range: "daily" | "weekly" | "monthly"): string => {
  switch (range) {
    case "daily":
      return "Data 7 hari terakhir";
    case "weekly":
      return "Data 4 minggu terakhir";
    case "monthly":
      return "Data 12 bulan terakhir";
    default:
      return "";
  }
};

const VisitorsChart: React.FC<VisitorsChartProps> = ({ data, timeRange }) => {
  // Mapping data untuk digunakan oleh Recharts
  const chartData = data.map((item) => ({
    label: formatDateLabel(
      item.date || item.week_start || item.month_start,
      timeRange
    ),
    views: item.views,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="views" fill="#10B981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const formatDateLabel = (
  date: string | undefined,
  timeRange: "daily" | "weekly" | "monthly"
): string => {
  if (!date) return "-";
  const d: Date = new Date(date);
  switch (timeRange) {
    case "daily":
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    case "weekly":
      return `Minggu ${d.getDate()}/${d.getMonth() + 1}`;
    case "monthly":
      return d.toLocaleDateString("id-ID", { month: "short" });
    default:
      return "-";
  }
};

export default DashboardPage;
