import type { Metadata } from "next";
import { Users, Globe, Workflow, Bot, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { CtaSection } from "@/components/site/cta-section";
import { Button } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/site/reveal";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Whatever is holding your business back — customers, presence, leads, manual work or unclear results — CA Marketing has a solution.",
  alternates: { canonical: "/solutions" },
};

const SOLUTIONS = [
  {
    icon: Users,
    title: "Need More Customers?",
    desc: "Lead generation + advertising + conversion systems.",
    points: [
      "Paid & organic acquisition campaigns",
      "High-converting landing pages and funnels",
      "Offer and audience testing",
    ],
  },
  {
    icon: Globe,
    title: "Need a Better Online Presence?",
    desc: "Website + branding + content.",
    points: [
      "Modern, fast, mobile-first websites",
      "Brand identity and visual systems",
      "Ongoing content production",
    ],
  },
  {
    icon: Workflow,
    title: "Losing Leads?",
    desc: "CRM + WhatsApp + automated follow-up.",
    points: [
      "Centralized CRM with lead scoring",
      "WhatsApp and email automation",
      "Follow-up sequences that never forget a lead",
    ],
  },
  {
    icon: Bot,
    title: "Too Much Manual Work?",
    desc: "AI + workflow automation.",
    points: [
      "AI agents for support and qualification",
      "n8n-powered workflow automation",
      "Integrations between the tools you already use",
    ],
  },
  {
    icon: BarChart3,
    title: "Don't Know What Works?",
    desc: "Analytics + reporting.",
    points: [
      "First-party analytics on every touchpoint",
      "Clear, recurring performance reporting",
      "Decisions backed by data, not guesswork",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Tell us what's holding you back. We'll show you the fix."
      />

      <section className="section-y">
        <RevealGroup className="container-page space-y-6">
          {SOLUTIONS.map((s) => (
            <RevealItem
              key={s.title}
              className="card-soft grid gap-6 p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-md bg-navy text-white">
                <s.icon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-navy">{s.title}</h2>
                <p className="mt-1 text-gray-600">{s.desc}</p>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                  {s.points.map((p) => (
                    <li key={p} className="text-sm text-gray-500">
                      • {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/consultation" className="lg:justify-self-end">
                <Button variant="outline">Talk to us</Button>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <CtaSection location="solutions_page" />
    </>
  );
}
