"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track";
import type { AnalyticsEventName } from "@/lib/types/database";

/** Fires a single analytics event once when a detail page mounts. */
export function ViewTracker({
  event,
  metadata,
}: {
  event: AnalyticsEventName;
  metadata: Record<string, unknown>;
}) {
  useEffect(() => {
    trackEvent(event, metadata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
