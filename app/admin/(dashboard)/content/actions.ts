"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function saveSiteSetting(key: string, value: unknown) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
  revalidatePath("/admin/settings");
  return { success: true };
}
