import "server-only";

export interface LeadWebhookPayload {
  lead_id: string;
  lead_number: string;
  name: string;
  business: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  lead_score: number;
  lead_temperature: string;
  source: string;
}

/**
 * Forwards a newly-created lead to the configured n8n workflow.
 * The URL is never hardcoded — it comes from N8N_LEAD_WEBHOOK_URL.
 * If it isn't configured, this no-ops (logged) so local/dev/demo
 * deployments don't fail the whole consultation flow.
 */
export async function sendLeadToN8n(payload: LeadWebhookPayload) {
  const url = process.env.N8N_LEAD_WEBHOOK_URL;

  if (!url) {
    console.warn(
      "[n8n] N8N_LEAD_WEBHOOK_URL is not set — skipping webhook dispatch for lead",
      payload.lead_id
    );
    return { success: false, skipped: true as const };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET
          ? { "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify(payload),
      // n8n workflows can be slow; don't let this block the response forever.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error("[n8n] webhook responded with", res.status);
      return { success: false, status: res.status };
    }

    return { success: true };
  } catch (err) {
    console.error("[n8n] webhook dispatch failed", err);
    return { success: false, error: (err as Error).message };
  }
}
