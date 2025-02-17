import { supabase } from "@/lib/supabase/client";
import { toast } from "react-toastify";

export const uploadImageToSupabase = async (file: File): Promise<string> => {
  try {
    // Unggah file ke bucket 'berita-images'
    const { data, error } = await supabase.storage
      .from("berita-images") // Nama bucket
      .upload(`public/${file.name}`, file);

    if (error) throw error;

    // Dapatkan URL publik dari file yang diunggah
    const { publicURL } = supabase.storage
      .from("berita-images")
      .getPublicUrl(data.path);

    return publicURL; // Kembalikan URL gambar
  } catch (error) {
    console.error("Error uploading image to Supabase:", error);
    toast.error("Gagal mengupload gambar");
    throw error;
  }
};
