import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { ConsultationForm } from "@/components/site/consultation-form";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Book a free growth consultation with CA Marketing and get a clear plan for marketing, technology and automation.",
  alternates: { canonical: "/consultation" },
};

const INCLUDES = [
  "A review of your current marketing & digital presence",
  "A practical growth strategy tailored to your business",
  "Clear recommendations on where automation saves you time",
  "No pressure, no obligation",
];

export default function ConsultationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Book a Consultation"
        title="Let's map out your growth engine."
        description="Tell us about your business and challenges — we'll follow up within 1 business day."
      />

      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-xl font-semibold text-navy">What you'll get</h2>
            <ul className="mt-5 space-y-3">
              {INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border p-6 sm:p-8">
            <ConsultationForm />
          </div>
        </div>
      </section>
    </>
  );
}
