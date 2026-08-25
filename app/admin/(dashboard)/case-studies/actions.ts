"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import type { CaseStudy } from "@/lib/types/database";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export type CaseStudyInput = Partial<
  Pick<
    CaseStudy,
    | "title" | "slug" | "client" | "industry" | "challenge" | "strategy" | "solution"
    | "implementation" | "results" | "metrics" | "testimonial_id" | "cover_image" | "gallery"
    | "is_demo" | "featured" | "published"
  >
>;

export async function createCaseStudy(input: CaseStudyInput) {
  await requireAdmin();
  const supabase = await createClient();
  const slug = input.slug ? slugify(input.slug) : slugify(input.title || "");

  const { data, error } = await supabase
    .from("case_studies")
    .insert({
      title: input.title || "Untitled case study",
      slug,
      client: input.client || null,
      industry: input.industry || null,
      challenge: input.challenge || null,
      strategy: input.strategy || null,
      solution: input.solution || null,
      implementation: input.implementation || null,
      results: input.results || null,
      metrics: input.metrics || [],
      testimonial_id: input.testimonial_id || null,
      cover_image: input.cover_image || null,
      gallery: input.gallery || [],
      is_demo: input.is_demo ?? true,
      featured: input.featured ?? false,
      published: input.published ?? false,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message || "Failed to create case study" };

  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
  redirect(`/admin/case-studies/${data.id}`);
}

export async function updateCaseStudy(id: string, input: CaseStudyInput) {
  await requireAdmin();
  const supabase = await createClient();
  const update = { ...input };
  if (input.slug) update.slug = slugify(input.slug);

  const { error } = await supabase.from("case_studies").update(update).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/case-studies");
  revalidatePath(`/admin/case-studies/${id}`);
  revalidatePath("/case-studies");
  return { success: true };
}

export async function deleteCaseStudy(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("case_studies").delete().eq("id", id);
  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
  redirect("/admin/case-studies");
}
