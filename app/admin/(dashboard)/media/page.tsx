import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MediaGrid } from "@/components/admin/media-grid";
import type { Media } from "@/lib/types/database";

export const metadata: Metadata = { title: "Media Library" };

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Media Library</h1>
        <p className="text-sm text-gray-500">Upload, search, preview and delete files stored in Supabase Storage.</p>
      </div>
      <MediaGrid initialMedia={(data as Media[]) ?? []} />
    </div>
  );
}
