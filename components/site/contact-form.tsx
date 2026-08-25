"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/webhooks/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-accent-100 bg-accent-100/40 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-accent" />
        <h3 className="mt-3 text-lg font-semibold text-navy">Message sent</h3>
        <p className="mt-1 text-sm text-gray-600">We&apos;ll get back to you within 1 business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="company_website_url"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="c_full_name">Full name *</Label>
          <Input id="c_full_name" name="full_name" required />
        </div>
        <div>
          <Label htmlFor="c_email">Email *</Label>
          <Input id="c_email" name="email" type="email" required />
        </div>
      </div>
      <div>
        <Label htmlFor="c_message">Message *</Label>
        <Textarea id="c_message" name="message" required placeholder="How can we help?" />
      </div>
      {status === "error" && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
      )}
      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : "Send message"}
      </Button>
    </form>
  );
}
