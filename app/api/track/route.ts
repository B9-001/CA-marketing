import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getRequestIp, rateLimit } from "@/lib/rate-limit";

const eventSchema = z.object({
  event_name: z.enum([
    "page_view",
    "session_start",
    "cta_click",
    "consultation_started",
    "consultation_submitted",
    "whatsapp_click",
    "portfolio_view",
    "case_study_view",
    "service_view",
    "newsletter_signup",
  ]),
  session_id: z.string().min(1).max(100),
  visitor_id: z.string().min(1).max(100),
  page: z.string().max(500).nullable().optional(),
  referrer: z.string().max(500).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

function detectDevice(userAgent: string | null) {
  if (!userAgent) return "unknown";
  if (/mobile/i.test(userAgent)) return "mobile";
  if (/tablet|ipad/i.test(userAgent)) return "tablet";
  return "desktop";
}

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const { success } = rateLimit(`track:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { event_name, session_id, visitor_id, page, referrer, metadata } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("analytics_events").insert({
    event_name,
    session_id,
    visitor_id,
    page: page ?? null,
    referrer: referrer ?? null,
    device: detectDevice(request.headers.get("user-agent")),
    country: request.headers.get("x-vercel-ip-country") ?? null,
    metadata,
  });

  if (error) {
    console.error("[analytics] insert failed", error.message);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
