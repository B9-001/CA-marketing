import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/site/page-header";
import { CtaSection } from "@/components/site/cta-section";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "A selection of website, marketing, branding, automation, campaign and strategy work from CA Marketing.",
  alternates: { canonical: "/work" },
};

export const revalidate = 60;

export default async function WorkPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true });

  const projects = (data as Project[]) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title="Real systems, built for real businesses."
        description="Websites, marketing campaigns, branding, automation and strategy work — demo projects are clearly marked."
      />

      <section className="section-y">
        <div className="container-page">
          {projects.length === 0 ? (
            <p className="text-gray-500">
              Projects will appear here once published from the admin dashboard.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/work/${project.slug}`}
                  className="group overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    {project.cover_image ? (
                      <Image
                        src={project.cover_image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                    {project.is_demo && (
                      <span className="absolute left-3 top-3">
                        <Badge variant="outline" className="bg-white">Demo project</Badge>
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <Badge>{project.category}</Badge>
                      {project.featured && <Badge variant="dark">Featured</Badge>}
                    </div>
                    <h2 className="mt-3 font-semibold text-navy">{project.title}</h2>
                    {project.client && (
                      <p className="mt-1 text-sm text-gray-500">{project.client}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaSection location="work_page" />
    </>
  );
}
