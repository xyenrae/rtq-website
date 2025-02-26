import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export interface Settings {
  email: string;
  alamat: string;
  phone_number: string;
  link_facebook: string;
  link_youtube: string;
  link_instagram: string;
}

export const usePengaturan = () => {
  const supabase = createClient();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();
      if (error) throw error;
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat pengaturan");
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const updateSettings = async (updatedData: Partial<Settings>) => {
    try {
      const { error } = await supabase
        .from("settings")
        .update(updatedData)
        .eq("id", 1);
      if (error) throw error;
      toast.success("Pengaturan berhasil diperbarui!");
      await fetchSettings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, isLoading, error, updateSettings };
};
