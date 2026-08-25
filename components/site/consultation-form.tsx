"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics/track";

const INDUSTRIES = [
  "Retail & E-commerce", "Food & Beverage", "Health & Wellness", "Education",
  "Real Estate", "Finance & Fintech", "Technology / SaaS", "NGO / Nonprofit",
  "Professional Services", "Manufacturing", "Other",
];
const BUSINESS_SIZES = [
  { value: "solo", label: "Solo / Freelancer" },
  { value: "startup", label: "Startup (1-10 staff)" },
  { value: "small", label: "Small business (11-50 staff)" },
  { value: "medium", label: "Medium business (51-200 staff)" },
  { value: "large", label: "Large organization (200+ staff)" },
  { value: "ngo", label: "NGO / Nonprofit" },
];
const SERVICES = [
  "Digital Marketing", "Website & Digital Experience", "Lead Generation",
  "AI & Automation", "Branding & Creative", "Business Consultancy", "Not sure yet",
];
const BUDGETS = [
  { value: "under-100k", label: "Under ₦100,000 / month" },
  { value: "100k-500k", label: "₦100,000 - ₦500,000 / month" },
  { value: "500k-1m", label: "₦500,000 - ₦1,000,000 / month" },
  { value: "1m-5m", label: "₦1,000,000 - ₦5,000,000 / month" },
  { value: "above-5m", label: "Above ₦5,000,000 / month" },
  { value: "not-sure", label: "Not sure yet" },
];

type Status = "idle" | "submitting" | "success" | "error";

export function ConsultationForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [leadNumber, setLeadNumber] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    trackEvent("page_view", { path: "/consultation" });
  }, []);

  function handleFirstInput() {
    if (!started) {
      setStarted(true);
      trackEvent("consultation_started", {});
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

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

      setLeadNumber(data.lead_number);
      setStatus("success");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-accent-100 bg-accent-100/40 p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
        <h2 className="mt-4 text-2xl font-semibold text-navy">Request received!</h2>
        <p className="mt-2 text-gray-600">
          Reference <strong>{leadNumber}</strong>. A member of the CA Marketing team
          will reach out within 1 business day to schedule your consultation.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Check your inbox for a confirmation email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onInput={handleFirstInput} className="space-y-6">
      {/* Honeypot — hidden from real users */}
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
          <Label htmlFor="full_name">Full name *</Label>
          <Input id="full_name" name="full_name" required placeholder="Jane Doe" />
        </div>
        <div>
          <Label htmlFor="business_name">Business name</Label>
          <Input id="business_name" name="business_name" placeholder="Acme Ltd" />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="jane@acme.com" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+234 800 000 0000" />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" placeholder="acme.com" />
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select id="industry" name="industry" defaultValue="">
            <option value="" disabled>Select an industry</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="business_size">Business size</Label>
          <Select id="business_size" name="business_size" defaultValue="">
            <option value="" disabled>Select business size</option>
            {BUSINESS_SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="service_needed">Service needed</Label>
          <Select id="service_needed" name="service_needed" defaultValue="">
            <option value="" disabled>Select a service</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="main_challenge">Main challenge</Label>
        <Textarea id="main_challenge" name="main_challenge" placeholder="What's the biggest thing holding your business back right now?" />
      </div>

      <div>
        <Label htmlFor="desired_outcome">Desired outcome</Label>
        <Textarea id="desired_outcome" name="desired_outcome" placeholder="What does success look like in the next 3-6 months?" />
      </div>

      <div>
        <Label htmlFor="budget">Budget</Label>
        <Select id="budget" name="budget" defaultValue="">
          <option value="" disabled>Select a budget range</option>
          {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
        </Select>
      </div>

      <div>
        <Label htmlFor="message">Anything else we should know?</Label>
        <Textarea id="message" name="message" placeholder="Optional message" />
      </div>

      {status === "error" && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
          </>
        ) : (
          "Book a Growth Consultation"
        )}
      </Button>
      <p className="text-center text-xs text-gray-400">
        By submitting, you agree to be contacted by CA Marketing about your request.
      </p>
    </form>
  );
}
