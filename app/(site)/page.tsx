import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/settings";
import { Hero } from "@/components/site/hero";
import { ValueStrip } from "@/components/site/value-strip";
import { ProblemSection } from "@/components/site/problem-section";
import { ServicesSection } from "@/components/site/services-section";
import { TransformationSection } from "@/components/site/transformation-section";
import { ProcessSection } from "@/components/site/process-section";
import { SolutionsSection } from "@/components/site/solutions-section";
import { StatsBand } from "@/components/site/stats-band";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { CtaSection } from "@/components/site/cta-section";
import type { Service, Testimonial } from "@/lib/types/database";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const settings = await getSiteSettings();

  const [{ data: services }, { data: testimonials }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .limit(6),
    supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .limit(3),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <ValueStrip />
      <ProblemSection />
      <ServicesSection services={(services as Service[]) ?? []} />
      <TransformationSection />
      <ProcessSection />
      <SolutionsSection />
      <StatsBand settings={settings} />
      <TestimonialsSection testimonials={(testimonials as Testimonial[]) ?? []} />
      <CtaSection />
    </>
  );
}
