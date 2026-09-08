import { Layers, Zap, ShieldCheck } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/site/reveal";

const ITEMS = [
  {
    icon: Layers,
    title: "Connected",
    desc: "Marketing, technology and automation working as one system, not five disconnected vendors.",
  },
  {
    icon: Zap,
    title: "Fast to value",
    desc: "Practical builds that ship in weeks, not quarter-long \"transformation\" projects.",
  },
  {
    icon: ShieldCheck,
    title: "Accountable",
    desc: "Every engagement is measured against real leads, conversions and time saved.",
  },
];

export function ValueStrip() {
  return (
    <section className="border-y border-border bg-white py-10">
      <RevealGroup className="container-page grid gap-8 sm:grid-cols-3">
        {ITEMS.map((item) => (
          <RevealItem key={item.title} className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
              <item.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-navy">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.desc}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
