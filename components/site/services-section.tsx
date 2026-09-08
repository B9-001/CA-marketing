import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import type { Service } from "@/lib/types/database";

function getIcon(name: string | null): LucideIcon {
  if (name && name in Icons) {
    return Icons[name as keyof typeof Icons] as LucideIcon;
  }
  return Icons.Sparkles;
}

export function ServicesSection({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              What we do
            </h2>
            <p className="mt-3 max-w-xl text-gray-600">
              Six connected disciplines — marketing, technology and automation
              — working as one system.
            </p>
          </div>
          <Link href="/services" className="text-sm font-medium text-accent hover:underline">
            View all services →
          </Link>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <RevealItem key={service.id} className="card-soft p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent-100 text-accent-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-navy">{service.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                  {service.summary}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
