"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import type { Project, ProjectCategory } from "@/lib/types/database";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type ProjectInput = Partial<
  Pick<
    Project,
    | "title" | "slug" | "client" | "industry" | "category" | "description" | "challenge"
    | "solution" | "results" | "cover_image" | "video_url" | "external_url"
    | "featured" | "published" | "is_demo" | "display_order"
  >
>;

export async function createProject(input: ProjectInput) {
  await requireAdmin();
  const supabase = await createClient();

  const slug = input.slug ? slugify(input.slug) : slugify(input.title || "");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: input.title || "Untitled project",
      slug,
      client: input.client || null,
      industry: input.industry || null,
      category: (input.category as ProjectCategory) || "Websites",
      description: input.description || null,
      challenge: input.challenge || null,
      solution: input.solution || null,
      results: input.results || null,
      cover_image: input.cover_image || null,
      video_url: input.video_url || null,
      external_url: input.external_url || null,
      featured: input.featured ?? false,
      published: input.published ?? false,
      is_demo: input.is_demo ?? true,
      display_order: input.display_order ?? 0,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message || "Failed to create project" };
  }

  revalidatePath("/admin/portfolio");
  revalidatePath("/work");
  redirect(`/admin/portfolio/${data.id}`);
}

export async function updateProject(id: string, input: ProjectInput) {
  await requireAdmin();
  const supabase = await createClient();

  const update: ProjectInput = { ...input };
  if (input.slug) update.slug = slugify(input.slug);

  const { error } = await supabase.from("projects").update(update).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/portfolio");
  revalidatePath(`/admin/portfolio/${id}`);
  revalidatePath("/work");
  return { success: true };
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/work");
  redirect("/admin/portfolio");
}

export async function toggleProjectPublished(id: string, published: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("projects").update({ published }).eq("id", id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/work");
}
