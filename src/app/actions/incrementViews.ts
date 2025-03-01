"use server";

import { createClient } from "@/utils/supabase/client";

export async function incrementViews(newsId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("increment_views", {
    row_id: newsId,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
