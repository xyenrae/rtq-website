"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";

export default function AutoLogout() {
  const router = useRouter();

  // Cek waktu terakhir aktif saat halaman dimuat
  useEffect(() => {
    const lastActive = localStorage.getItem("lastActive");
    if (lastActive) {
      const lastActiveDate = new Date(lastActive);
      const now = new Date();
      const diff = now.getTime() - lastActiveDate.getTime();
      if (diff > 30 * 60 * 1000) {
        // 30 menit
        supabase.auth.signOut();
        toast.info("Anda telah logout karena tidak aktif selama 30 menit.");
        router.push("/login");
      }
    }
  }, [router]);

  // Simpan timestamp saat pengguna meninggalkan halaman
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("lastActive", new Date().toISOString());
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return null;
}
