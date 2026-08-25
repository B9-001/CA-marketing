import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { CtaSection } from "@/components/site/cta-section";
import { ViewTracker } from "@/components/analytics/view-tracker";
import type { CaseStudy, Testimonial } from "@/lib/types/database";

export const revalidate = 60;

async function getCaseStudy(slug: string) {
  const supabase = await createClient();
  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!caseStudy) return null;

  let testimonial: Testimonial | null = null;
  if ((caseStudy as CaseStudy).testimonial_id) {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("id", (caseStudy as CaseStudy).testimonial_id!)
      .maybeSingle();
    testimonial = data as Testimonial | null;
  }

  return { caseStudy: caseStudy as CaseStudy, testimonial };
}

export async function generateMetadata(
  props: PageProps<"/case-studies/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const result = await getCaseStudy(slug);
  if (!result) return {};

  return {
    title: result.caseStudy.title,
    description: result.caseStudy.challenge ?? undefined,
    alternates: { canonical: `/case-studies/${slug}` },
  };
}

const SECTIONS: { key: keyof CaseStudy; label: string }[] = [
  { key: "challenge", label: "Challenge" },
  { key: "strategy", label: "Strategy" },
  { key: "solution", label: "Solution" },
  { key: "implementation", label: "Implementation" },
  { key: "results", label: "Results" },
];

export default async function CaseStudyPage(props: PageProps<"/case-studies/[slug]">) {
  const { slug } = await props.params;
  const result = await getCaseStudy(slug);
  if (!result) notFound();

  const { caseStudy, testimonial } = result;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: caseStudy.title,
    image: caseStudy.cover_image ? [caseStudy.cover_image] : undefined,
    datePublished: caseStudy.created_at,
    dateModified: caseStudy.updated_at,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ViewTracker event="case_study_view" metadata={{ slug, case_study_id: caseStudy.id }} />

      <section className="border-b border-border bg-navy text-white">
        <div className="container-page py-16">
          <Link href="/case-studies" className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to case studies
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            {caseStudy.is_demo && <Badge variant="outline" className="border-white/30 text-gray-200">Demo project</Badge>}
            {caseStudy.industry && <Badge variant="dark">{caseStudy.industry}</Badge>}
          </div>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {caseStudy.title}
          </h1>
          {caseStudy.client && <p className="mt-3 text-gray-300">Client: {caseStudy.client}</p>}

          {caseStudy.metrics?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              {caseStudy.metrics.map((m) => (
                <div key={m.label}>
                  <p className="text-3xl font-semibold text-accent">{m.value}</p>
                  <p className="mt-1 text-sm text-gray-400">{m.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {caseStudy.cover_image && (
        <div className="container-page -mt-1">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
            <Image src={caseStudy.cover_image} alt={caseStudy.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {SECTIONS.map(
              ({ key, label }) =>
                caseStudy[key] && (
                  <div key={key}>
                    <h2 className="text-lg font-semibold text-navy">{label}</h2>
                    <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-600">
                      {caseStudy[key] as string}
                    </p>
                  </div>
                )
            )}

            {caseStudy.gallery?.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {caseStudy.gallery.map((url) => (
                  <div key={url} className="relative aspect-video overflow-hidden rounded-lg border border-border">
                    <Image src={url} alt={caseStudy.title} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {testimonial && (
              <div className="rounded-lg border border-border p-6">
                {testimonial.rating && (
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4" fill={i < testimonial.rating! ? "currentColor" : "none"} strokeWidth={1.5} />
                    ))}
                  </div>
                )}
                <p className="mt-3 text-sm italic leading-relaxed text-gray-700">
                  &ldquo;{testimonial.testimonial}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-navy">{testimonial.name}</p>
                <p className="text-xs text-gray-500">
                  {[testimonial.position, testimonial.organization].filter(Boolean).join(", ")}
                </p>
              </div>
            )}

            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-navy">Want a similar outcome?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Book a free growth consultation to see what&apos;s realistic for your business.
              </p>
              <Link
                href="/consultation"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-accent px-5 text-sm font-medium text-white hover:bg-accent-600"
              >
                Book a Consultation
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <CtaSection location="case_study_detail" />
    </>
  );
}
