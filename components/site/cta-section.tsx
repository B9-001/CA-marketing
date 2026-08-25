"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track";

export function CtaSection({
  title = "Ready to turn your digital presence into a growth engine?",
  description = "Book a free growth consultation and get a clear plan for marketing, technology and automation tailored to your business.",
  location = "footer_cta",
}: {
  title?: string;
  description?: string;
  location?: string;
}) {
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="rounded-2xl bg-navy px-8 py-16 text-center text-white sm:px-16">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-gray-300">{description}</p>
          <div className="mt-8 flex justify-center">
            <Link href="/consultation" onClick={() => trackEvent("cta_click", { location })}>
              <Button size="lg" className="group">
                Book a Growth Consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
