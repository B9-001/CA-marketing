import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRequestIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().trim().email().max(160) });

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const { success: withinLimit } = rateLimit(`newsletter:${ip}`, { limit: 10, windowMs: 10 * 60_000 });
  if (!withinLimit) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("newsletter_subscribers")
    .upsert({ email: parsed.data.email, subscribed: true }, { onConflict: "email" });

  if (error) {
    console.error("[newsletter] upsert failed", error.message);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
