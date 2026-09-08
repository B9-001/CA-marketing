import type { Metadata } from "next";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/site/page-header";
import { CtaSection } from "@/components/site/cta-section";
import { ViewTracker } from "@/components/analytics/view-tracker";
import { RevealGroup, RevealItem } from "@/components/site/reveal";
import type { Service } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital marketing, website development, lead generation, AI automation, branding and business consultancy — services built for SME growth.",
  alternates: { canonical: "/services" },
};

export const revalidate = 60;

function getIcon(name: string | null): LucideIcon {
  if (name && name in Icons) return Icons[name as keyof typeof Icons] as LucideIcon;
  return Icons.Sparkles;
}

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true });

  const services = (data as Service[]) ?? [];

  return (
    <>
      <ViewTracker event="service_view" metadata={{ page: "/services" }} />
      <PageHeader
        eyebrow="Services"
        title="Six connected disciplines. One growth system."
        description="Marketing, technology and automation, working together instead of in silos."
      />

      <section className="section-y">
        <div className="container-page">
          {services.length === 0 ? (
            <p className="text-gray-500">
              Services will appear here once published from the admin dashboard.
            </p>
          ) : (
            <RevealGroup className="grid gap-6 lg:grid-cols-2">
              {services.map((service) => {
                const Icon = getIcon(service.icon);
                return (
                  <RevealItem key={service.id} className="card-soft p-8">
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent-100 text-accent-600">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="mt-5 text-xl font-semibold text-navy">{service.title}</h2>
                    <p className="mt-2 text-gray-600">{service.summary}</p>
                    {service.description && (
                      <p className="mt-3 text-sm leading-relaxed text-gray-500">
                        {service.description}
                      </p>
                    )}
                    {service.features?.length > 0 && (
                      <ul className="mt-5 space-y-2">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </RevealItem>
                );
              })}
            </RevealGroup>
          )}
        </div>
      </section>

      <CtaSection location="services_page" />
    </>
  );
}
