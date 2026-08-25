import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { CtaSection } from "@/components/site/cta-section";
import { ViewTracker } from "@/components/analytics/view-tracker";
import type { Project, ProjectMedia } from "@/lib/types/database";

export const revalidate = 60;

async function getProject(slug: string) {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!project) return null;

  const { data: media } = await supabase
    .from("project_media")
    .select("*")
    .eq("project_id", (project as Project).id)
    .order("display_order", { ascending: true });

  return { project: project as Project, media: (media as ProjectMedia[]) ?? [] };
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const result = await getProject(slug);
  if (!result) return {};

  return {
    title: result.project.title,
    description: result.project.description ?? undefined,
    alternates: { canonical: `/work/${slug}` },
    openGraph: result.project.cover_image
      ? { images: [result.project.cover_image] }
      : undefined,
  };
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const result = await getProject(slug);
  if (!result) notFound();

  const { project, media } = result;

  return (
    <>
      <ViewTracker event="portfolio_view" metadata={{ slug, project_id: project.id }} />

      <section className="border-b border-border bg-navy text-white">
        <div className="container-page py-16">
          <Link href="/work" className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to work
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge>{project.category}</Badge>
            {project.is_demo && <Badge variant="outline" className="border-white/30 text-gray-200">Demo project</Badge>}
            {project.featured && <Badge variant="dark">Featured</Badge>}
          </div>

          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {project.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-8 text-sm text-gray-300">
            {project.client && (
              <div>
                <p className="text-gray-500">Client</p>
                <p className="mt-1 font-medium text-white">{project.client}</p>
              </div>
            )}
            {project.industry && (
              <div>
                <p className="text-gray-500">Industry</p>
                <p className="mt-1 font-medium text-white">{project.industry}</p>
              </div>
            )}
            {project.external_url && (
              <a
                href={project.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 self-end font-medium text-accent hover:underline"
              >
                Visit live project <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {project.cover_image && (
        <div className="container-page -mt-1">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
            <Image src={project.cover_image} alt={project.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {project.description && (
              <div>
                <h2 className="text-lg font-semibold text-navy">Overview</h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-600">
                  {project.description}
                </p>
              </div>
            )}
            {project.challenge && (
              <div>
                <h2 className="text-lg font-semibold text-navy">Challenge</h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-600">
                  {project.challenge}
                </p>
              </div>
            )}
            {project.solution && (
              <div>
                <h2 className="text-lg font-semibold text-navy">Solution</h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-600">
                  {project.solution}
                </p>
              </div>
            )}
            {project.results && (
              <div>
                <h2 className="text-lg font-semibold text-navy">Results</h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-600">
                  {project.results}
                </p>
              </div>
            )}

            {media.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {media.map((m) => (
                  <div key={m.id} className="relative aspect-video overflow-hidden rounded-lg border border-border">
                    {m.media_type === "image" ? (
                      <Image src={m.media_url} alt={m.caption ?? project.title} fill className="object-cover" />
                    ) : (
                      <video src={m.media_url} controls className="h-full w-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-lg border border-border p-6">
            <h3 className="font-semibold text-navy">Want results like this?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Book a free growth consultation and we&apos;ll map out what it would take for your business.
            </p>
            <Link
              href="/consultation"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-accent px-5 text-sm font-medium text-white hover:bg-accent-600"
            >
              Book a Consultation
            </Link>
          </aside>
        </div>
      </section>

      <CtaSection location="project_detail" />
    </>
  );
}
