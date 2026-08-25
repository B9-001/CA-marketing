import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const STATIC_ROUTES = [
  "", "/services", "/solutions", "/work", "/case-studies", "/about", "/insights", "/contact", "/consultation",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: projects }, { data: caseStudies }, { data: posts }] = await Promise.all([
    supabase.from("projects").select("slug, updated_at").eq("published", true),
    supabase.from("case_studies").select("slug, updated_at").eq("published", true),
    supabase.from("blog_posts").select("slug, updated_at").eq("status", "published"),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
    url: `${siteUrl}/work/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = (caseStudies ?? []).map((c) => ({
    url: `${siteUrl}/case-studies/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${siteUrl}/insights/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...projectEntries, ...caseStudyEntries, ...postEntries];
}
