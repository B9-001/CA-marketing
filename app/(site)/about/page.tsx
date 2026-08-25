import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { PageHeader } from "@/components/site/page-header";
import { CtaSection } from "@/components/site/cta-section";
import { ProcessSection } from "@/components/site/process-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "CA Marketing is a consultancy and digital marketing agency helping SMEs, MSMEs, startups and NGOs grow through marketing, technology and automation.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        eyebrow="About CA Marketing"
        title="Marketing, technology and automation — under one roof."
        description="We exist so growing businesses don't have to juggle five different agencies to get one coherent growth system."
      />

      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold text-navy">Who we are</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-600">
              {settings.about_content}
            </p>
            <p className="mt-4 leading-relaxed text-gray-600">
              Most SMEs and organizations don&apos;t have a marketing problem or
              a technology problem in isolation — they have a disconnected
              system. CA Marketing was built to fix that: one team, one
              strategy, one accountable partner for growth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {settings.statistics.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border p-6 text-center">
                <p className="text-3xl font-semibold text-navy">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />
      <CtaSection location="about_page" />
    </>
  );
}
