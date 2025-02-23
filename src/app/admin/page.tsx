import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

// Tipe untuk statistik
interface Stats {
  santri: number;
  gambar: number;
  berita: number;
  pesan: number;
}

// Tipe untuk data pengunjung per bulan
export interface VisitorDataPoint {
  month: string;
  visitors: number;
}

// Tipe untuk distribusi konten
export interface ContentDataPoint {
  category: string;
  count: number;
}

// Tipe untuk data visitor yang diambil dari Supabase
interface Visitor {
  created_at: string;
}

// Tipe untuk aktivitas terbaru (meskipun saat ini tidak ada data aktivitas, kita definisikan agar nanti bisa digunakan)
export interface Activity {
  title: string;
  timestamp: string;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    santri: 0,
    gambar: 0,
    berita: 0,
    pesan: 0,
  });
  // recentActivity dideklarasikan sebagai state, meskipun belum ada data aktivitas
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visitorData, setVisitorData] = useState<VisitorDataPoint[]>([]);
  const [contentData, setContentData] = useState<ContentDataPoint[]>([]);

  const fetchStats = async (): Promise<Stats> => {
    const { count: santri } = await supabase
      .from("santri")
      .select("*", { count: "exact", head: true });
    const { count: gambar } = await supabase
      .from("gallery")
      .select("*", { count: "exact", head: true });
    const { count: berita } = await supabase
      .from("berita")
      .select("*", { count: "exact", head: true });
    const { count: pesan } = await supabase
      .from("pesan")
      .select("*", { count: "exact", head: true });
    return {
      santri: santri || 0,
      gambar: gambar || 0,
      berita: berita || 0,
      pesan: pesan || 0,
    };
  };

  const fetchVisitorStats = async (): Promise<VisitorDataPoint[]> => {
    const { data, error } = await supabase
      .from<"visitors", Visitor>("visitors")
      .select("created_at")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching visitor stats:", error);
      return [];
    }
    // Group data berdasarkan bulan
    const monthlyStats: Record<string, number> = {};
    data?.forEach((curr: Visitor) => {
      const month = new Date(curr.created_at).toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
      });
      monthlyStats[month] = (monthlyStats[month] || 0) + 1;
    });
    return Object.entries(monthlyStats).map(([month, count]) => ({
      month,
      visitors: count,
    }));
  };

  const fetchContentStats = async (): Promise<ContentDataPoint[]> => {
    const { count: gambar } = await supabase
      .from("gallery")
      .select("*", { count: "exact", head: true });
    const { count: berita } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });
    const { count: kegiatan } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true });
    return [
      { category: "Galeri", count: gambar || 0 },
      { category: "Berita", count: berita || 0 },
      { category: "Kegiatan", count: kegiatan || 0 },
    ];
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const statsData = await fetchStats();
        const visitors = await fetchVisitorStats();
        const contents = await fetchContentStats();

        setStats(statsData);
        setVisitorData(visitors);
        setContentData(contents);
        // Jika ada data aktivitas terbaru, setRecentActivity bisa diupdate di sini.
        // Misalnya: setRecentActivity([{ title: "Aktivitas A", timestamp: "..." }]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    stats,
    recentActivity,
    isLoading,
    visitorData,
    contentData,
    setRecentActivity,
  };
};
