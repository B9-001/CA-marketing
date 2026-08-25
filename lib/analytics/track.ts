"use client";

import type { AnalyticsEventName } from "@/lib/types/database";

const VISITOR_KEY = "ca_visitor_id";
const SESSION_KEY = "ca_session_id";

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getVisitorId() {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function getSessionId(): { id: string; isNew: boolean } {
  if (typeof window === "undefined") return { id: "server", isNew: false };
  let id = sessionStorage.getItem(SESSION_KEY);
  let isNew = false;
  if (!id) {
    id = uuid();
    sessionStorage.setItem(SESSION_KEY, id);
    isNew = true;
  }
  return { id, isNew };
}

/**
 * Fires a first-party analytics event to /api/track, which persists it to
 * Supabase (analytics_events). Fails silently — analytics must never break
 * the page.
 */
export function trackEvent(
  eventName: AnalyticsEventName,
  metadata: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;

  const { id: sessionId, isNew } = getSessionId();
  if (isNew) {
    void sendEvent("session_start", sessionId, {});
  }

  void sendEvent(eventName, sessionId, metadata);
}

async function sendEvent(
  eventName: AnalyticsEventName,
  sessionId: string,
  metadata: Record<string, unknown>
) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event_name: eventName,
        session_id: sessionId,
        visitor_id: getVisitorId(),
        page: window.location.pathname,
        referrer: document.referrer || null,
        metadata,
      }),
    });
  } catch {
    // Analytics must never break the UI.
  }
}
