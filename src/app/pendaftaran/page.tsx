"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import FormPendaftaran from "@/components/form/FormPendaftaran";

export default function RegistrationPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.error("Anda harus login terlebih dahulu.");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="w-full container mt-12">
      <FormPendaftaran />
    </div>
  );
}
