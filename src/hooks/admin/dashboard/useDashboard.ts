// File: hooks/admin/dashboard/useDashboard.ts
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";

type TimeRange = "daily" | "weekly" | "monthly";

type ViewData = {
  date?: string;
  week_start?: string;
  month_start?: string;
  views: number;
};

export const useDashboard = () => {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalViews: 0,
    viewsToday: 0,
    viewsThisWeek: 0,
    chartData: [] as ViewData[],
    timeRange: "daily" as TimeRange,
  });
  const [loading, setLoading] = useState(true);

  const setTimeRange = useCallback((range: TimeRange) => {
    setLoading(true);
    setStats((prev) => ({ ...prev, timeRange: range }));
  }, []);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const timezone = "Asia/Jakarta";
      const startDate = getStartDate(stats.timeRange);
      let chartData: ViewData[] = [];

      switch (stats.timeRange) {
        case "daily": {
          const { data: dailyData, error } = await supabase.rpc(
            "get_daily_views",
            {
              timezone,
              start_date: startDate.toISOString(),
            }
          );

          if (error) {
            console.error("Error fetching daily data:", error);
            chartData = generateEmptyData("daily", 7);
          } else {
            chartData = normalizeData(dailyData || [], "daily", startDate, 7);
          }
          break;
        }
        case "weekly": {
          const { data: weeklyData, error } = await supabase.rpc(
            "get_weekly_views",
            {
              timezone,
              start_date: startDate.toISOString(),
            }
          );

          if (error) {
            console.error("Error fetching weekly data:", error);
            chartData = generateEmptyData("weekly", 4);
          } else {
            chartData = normalizeData(weeklyData || [], "weekly", startDate, 4);
          }
          break;
        }
        case "monthly": {
          const { data: monthlyData, error } = await supabase.rpc(
            "get_monthly_views",
            {
              timezone,
              start_date: startDate.toISOString(),
            }
          );

          if (error) {
            console.error("Error fetching monthly data:", error);
            chartData = generateEmptyData("monthly", 12);
          } else {
            chartData = normalizeData(
              monthlyData || [],
              "monthly",
              startDate,
              12
            );
          }
          break;
        }
      }

      // Update chart data
      setStats((prev) => ({
        ...prev,
        chartData: chartData,
      }));
    } catch (error) {
      console.error("Error fetching chart data:", error);
      // In case of error, generate empty data instead of showing nothing
      const count =
        stats.timeRange === "daily" ? 7 : stats.timeRange === "weekly" ? 4 : 12;
      setStats((prev) => ({
        ...prev,
        chartData: generateEmptyData(stats.timeRange, count),
      }));
    } finally {
      setLoading(false);
    }
  }, [supabase, stats.timeRange]);

  const fetchData = useCallback(async () => {
    try {
      // Total views
      const { count: totalViews } = await supabase
        .from("views")
        .select("*", { count: "exact", head: true });

      // Views hari ini
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const { count: viewsToday } = await supabase
        .from("views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfDay.toISOString());

      // Views minggu ini
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const { count: viewsThisWeek } = await supabase
        .from("views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfWeek.toISOString());

      // Store base stats first to keep UI responsive
      setStats((prev) => ({
        ...prev,
        totalViews: totalViews || 0,
        viewsToday: viewsToday || 0,
        viewsThisWeek: viewsThisWeek || 0,
      }));

      // Then fetch chart data separately
      await fetchChartData();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [supabase, fetchChartData]);

  const refreshData = async () => {
    setLoading(true);
    try {
      await fetchData();
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("view-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "views" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchData]);

  // Update chart data when time range changes
  useEffect(() => {
    fetchChartData();
  }, [stats.timeRange, fetchChartData]);

  return { stats, loading, setTimeRange, refreshData };
};

// Helper function to get the start date based on the time range
const getStartDate = (range: TimeRange): Date => {
  const today = new Date();
  switch (range) {
    case "daily":
      // 7 hari terakhir termasuk hari ini: mulai 6 hari yang lalu
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6
      );
    case "weekly":
      // 4 minggu terakhir termasuk minggu ini: mulai 3 minggu yang lalu
      return new Date(today.getTime() - 3 * 7 * 24 * 60 * 60 * 1000);
    case "monthly":
      // 12 bulan terakhir termasuk bulan ini: mulai 11 bulan yang lalu
      return new Date(
        today.getFullYear(),
        today.getMonth() - 11,
        today.getDate()
      );
  }
};

// Helper function to generate empty data with proper date structure
const generateEmptyData = (range: TimeRange, count: number): ViewData[] => {
  const today = new Date();
  const data: ViewData[] = [];

  for (let i = 0; i < count; i++) {
    const date = new Date();

    switch (range) {
      case "daily":
        date.setDate(today.getDate() - (count - 1 - i));
        data.push({ date: date.toISOString(), views: 0 });
        break;
      case "weekly":
        date.setDate(today.getDate() - (count - 1 - i) * 7);
        data.push({ week_start: date.toISOString(), views: 0 });
        break;
      case "monthly":
        date.setMonth(today.getMonth() - (count - 1 - i));
        data.push({ month_start: date.toISOString(), views: 0 });
        break;
    }
  }

  return data;
};

// Helper function to normalize data and ensure we have the correct number of data points
const normalizeData = (
  data: ViewData[],
  range: TimeRange,
  startDate: Date,
  count: number
): ViewData[] => {
  if (!data || data.length === 0) {
    return generateEmptyData(range, count);
  }

  // If we have fewer items than required, fill in the gaps
  if (data.length < count) {
    const existingDates = new Set();
    const key =
      range === "daily"
        ? "date"
        : range === "weekly"
        ? "week_start"
        : "month_start";

    data.forEach((item) => {
      if (item[key]) {
        existingDates.add(
          new Date(item[key] as string).toISOString().split("T")[0]
        );
      }
    });

    const normalized = [...data];
    const emptyData = generateEmptyData(range, count);

    for (const item of emptyData) {
      const itemDate = item[key] as string;
      if (
        itemDate &&
        !existingDates.has(new Date(itemDate).toISOString().split("T")[0])
      ) {
        normalized.push(item);
      }
    }

    // Sort the data
    normalized.sort((a, b) => {
      const aDate = a[key] ? new Date(a[key] as string).getTime() : 0;
      const bDate = b[key] ? new Date(b[key] as string).getTime() : 0;
      return aDate - bDate;
    });

    // Ensure we have exactly the right number
    return normalized.slice(0, count);
  }

  // If we have the right number or more, just return what we have
  return data.slice(0, count);
};
