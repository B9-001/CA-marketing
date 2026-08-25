import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/site/page-header";
import { CtaSection } from "@/components/site/cta-section";
import { Badge } from "@/components/ui/badge";
import type { CaseStudy } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "In-depth case studies covering the challenge, strategy, solution, implementation and results of CA Marketing engagements.",
  alternates: { canonical: "/case-studies" },
};

export const revalidate = 60;

export default async function CaseStudiesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("case_studies")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const caseStudies = (data as CaseStudy[]) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Case Studies"
        title="The full story behind the results."
        description="Challenge, strategy, solution, implementation and measured results — never fabricated. Demo projects are clearly marked."
      />

      <section className="section-y">
        <div className="container-page">
          {caseStudies.length === 0 ? (
            <p className="text-gray-500">
              Case studies will appear here once published from the admin dashboard.
            </p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {caseStudies.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.slug}`}
                  className="group overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    {cs.cover_image ? (
                      <Image
                        src={cs.cover_image}
                        alt={cs.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                    {cs.is_demo && (
                      <span className="absolute left-3 top-3">
                        <Badge variant="outline" className="bg-white">Demo project</Badge>
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-500">{cs.industry ?? cs.client}</p>
                    <h2 className="mt-1 text-lg font-semibold text-navy">{cs.title}</h2>
                    {cs.metrics?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-4">
                        {cs.metrics.slice(0, 3).map((m) => (
                          <div key={m.label}>
                            <p className="text-lg font-semibold text-accent-600">{m.value}</p>
                            <p className="text-xs text-gray-500">{m.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaSection location="case_studies_page" />
    </>
  );
}
