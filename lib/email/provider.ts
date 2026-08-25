import "server-only";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface EmailProvider {
  send(params: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }>;
}

/**
 * Resend implementation. Swap this file's factory to plug in Postmark or
 * SendGrid instead — nothing outside this module needs to change since
 * every caller depends on the `EmailProvider` interface, not on Resend.
 */
class ResendEmailProvider implements EmailProvider {
  private apiKey: string;
  private from: string;

  constructor(apiKey: string, from: string) {
    this.apiKey = apiKey;
    this.from = from;
  }

  async send(params: SendEmailParams) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.from,
          to: [params.to],
          subject: params.subject,
          html: params.html,
          reply_to: params.replyTo,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error("[email] Resend send failed", res.status, body);
        return { success: false, error: `Resend ${res.status}` };
      }

      const data = (await res.json()) as { id?: string };
      return { success: true, id: data.id };
    } catch (err) {
      console.error("[email] Resend send threw", err);
      return { success: false, error: (err as Error).message };
    }
  }
}

/**
 * No-op provider used when no email credentials are configured, so the
 * consultation flow keeps working end-to-end in local/dev environments
 * without crashing — it just logs instead of sending.
 */
class ConsoleEmailProvider implements EmailProvider {
  async send(params: SendEmailParams) {
    console.warn(
      "[email] No EMAIL provider configured — logging instead of sending.",
      { to: params.to, subject: params.subject }
    );
    return { success: true, id: "console-noop" };
  }
}

let cached: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (cached) return cached;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "CA Marketing <hello@ca-marketing.example>";

  cached = apiKey ? new ResendEmailProvider(apiKey, from) : new ConsoleEmailProvider();
  return cached;
}
