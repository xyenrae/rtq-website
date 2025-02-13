"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import FormPendaftaran from "@/components/form/FormPendaftaran";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

export default function RegistrationPage() {
  const router = useRouter();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user && isMounted) {
        toast.error("Anda harus login terlebih dahulu.");
        router.push("/login");
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="w-full container mt-12">
      <FormPendaftaran />
      {showScrollToTop && <ScrollToTopButton />}
    </div>
  );
}
