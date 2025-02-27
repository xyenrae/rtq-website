// File: components/Tracker.tsx
"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Tracker() {
  const supabase = createClient();

  useEffect(() => {
    const trackView = async () => {
      // Cek session storage untuk throttling
      const lastTrack = sessionStorage.getItem("lastTrack");
      const currentTime = Date.now();

      if (lastTrack && currentTime - parseInt(lastTrack) < 300000) return; // 5 menit cooldown

      await supabase.rpc("increment_view_count");
      sessionStorage.setItem("lastTrack", currentTime.toString());
    };

    trackView();
  }, [supabase]);

  return null;
}
