import Link from "next/link";
import { Users, Globe, Workflow, Bot, BarChart3, ArrowRight } from "lucide-react";

const SOLUTIONS = [
  {
    icon: Users,
    title: "Need More Customers?",
    desc: "Lead generation + advertising + conversion systems.",
  },
  {
    icon: Globe,
    title: "Need a Better Online Presence?",
    desc: "Website + branding + content.",
  },
  {
    icon: Workflow,
    title: "Losing Leads?",
    desc: "CRM + WhatsApp + automated follow-up.",
  },
  {
    icon: Bot,
    title: "Too Much Manual Work?",
    desc: "AI + workflow automation.",
  },
  {
    icon: BarChart3,
    title: "Don't Know What Works?",
    desc: "Analytics + reporting.",
  },
];

export function SolutionsSection() {
  return (
    <section className="section-y bg-gray-50">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Whatever is holding your business back, there&apos;s a solution.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <Link
              key={s.title}
              href="/solutions"
              className="group rounded-lg border border-border bg-white p-6 transition-shadow hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-navy text-white">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-navy">{s.title}</h3>
              <p className="mt-1.5 text-sm text-gray-600">{s.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                Learn more
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
