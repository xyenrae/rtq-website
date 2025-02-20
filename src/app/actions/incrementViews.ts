"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export async function incrementViews(newsId: string) {
  // Buat Supabase client
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  // Panggil fungsi RPC yang telah kita buat di database
  const { data, error } = await supabaseClient.rpc("increment_views", {
    row_id: newsId,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
