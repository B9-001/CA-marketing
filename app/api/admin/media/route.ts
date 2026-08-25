import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_TYPES = new Set([
  "image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "video/mp4",
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function sanitizeFileName(name: string) {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  const base = name
    .slice(0, name.length - ext.length)
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 60);
  return `${Date.now()}-${base || "file"}${ext.toLowerCase()}`;
}

export async function POST(request: Request) {
  const { userId } = await requireAdmin();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds the 10MB limit" }, { status: 400 });
  }

  const path = sanitizeFileName(file.name);
  const admin = createAdminClient();

  const { error: uploadError } = await admin.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    console.error("[media] upload failed", uploadError.message);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: publicUrlData } = admin.storage.from("media").getPublicUrl(path);

  const { data: mediaRow, error: insertError } = await admin
    .from("media")
    .insert({
      file_name: file.name,
      file_url: publicUrlData.publicUrl,
      file_type: file.type,
      file_size: file.size,
      uploaded_by: userId,
    })
    .select("*")
    .single();

  if (insertError) {
    console.error("[media] db insert failed", insertError.message);
    return NextResponse.json({ error: "Failed to save media record" }, { status: 500 });
  }

  return NextResponse.json({ success: true, media: mediaRow });
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = createAdminClient();
  const { data: mediaRow } = await admin.from("media").select("*").eq("id", id).maybeSingle();
  if (!mediaRow) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const path = mediaRow.file_url.split("/media/").pop();
  if (path) await admin.storage.from("media").remove([path]);
  await admin.from("media").delete().eq("id", id);

  return NextResponse.json({ success: true });
}
