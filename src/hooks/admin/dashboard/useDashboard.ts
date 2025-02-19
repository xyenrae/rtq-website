// hooks/admin/dashboard/useDashboard.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export const useDashboard = () => {
  const [stats, setStats] = useState({
    santri: 0,
    gambar: 0,
    berita: 0,
    pesan: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visitorData, setVisitorData] = useState([]);
  const [contentData, setContentData] = useState([]);

  const fetchStats = async () => {
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

    return { santri, gambar, berita, pesan };
  };

  const fetchVisitorStats = async () => {
    const { data } = await supabase
      .from("visitors")
      .select("created_at")
      .order("created_at", { ascending: true });

    // Group by month
    const monthlyStats = data.reduce((acc, curr) => {
      const month = new Date(curr.created_at).toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(monthlyStats).map(([month, count]) => ({
      month,
      count,
    }));
  };

  const fetchContentStats = async () => {
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
      { category: "Galeri", count: gambar },
      { category: "Berita", count: berita },
      { category: "Kegiatan", count: kegiatan },
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
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  return { stats, recentActivity, isLoading, visitorData, contentData };
};
