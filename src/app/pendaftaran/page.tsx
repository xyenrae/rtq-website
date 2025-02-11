"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import FormPendaftaran from "@/components/form/FormPendaftaran";

export default function RegistrationPage() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // Flag untuk melacak apakah komponen masih mounted

    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user && isMounted) {
        toast.error("Anda harus login terlebih dahulu.");
        router.push("/login");
      }
    };

    checkAuth();

    return () => {
      isMounted = false; // Set flag menjadi false saat komponen unmount
    };
  }, [router]);

  return (
    <div className="w-full container mt-12">
      <FormPendaftaran />
    </div>
  );
}
