"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email, subscribed: true }, { onConflict: "email" });

    if (error) {
      setStatus("error");
      return;
    }
    trackEvent("newsletter_signup", { email });
    setStatus("done");
  }

  if (status === "done") {
    return <p className="text-sm font-medium text-accent-600">You&apos;re subscribed. Thank you!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        required
        placeholder="you@business.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "..." : "Subscribe"}
      </Button>
    </form>
  );
}
