"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import type { Service } from "@/lib/types/database";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export type ServiceInput = Partial<
  Pick<Service, "title" | "slug" | "summary" | "description" | "icon" | "features" | "display_order" | "published">
>;

export async function createService(input: ServiceInput) {
  await requireAdmin();
  const supabase = await createClient();
  const slug = input.slug ? slugify(input.slug) : slugify(input.title || "");

  const { data, error } = await supabase
    .from("services")
    .insert({
      title: input.title || "Untitled service",
      slug,
      summary: input.summary || null,
      description: input.description || null,
      icon: input.icon || null,
      features: input.features || [],
      display_order: input.display_order ?? 0,
      published: input.published ?? true,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message || "Failed to create service" };
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect(`/admin/services/${data.id}`);
}

export async function updateService(id: string, input: ServiceInput) {
  await requireAdmin();
  const supabase = await createClient();
  const update = { ...input };
  if (input.slug) update.slug = slugify(input.slug);
  const { error } = await supabase.from("services").update(update).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}`);
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}

export async function deleteService(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function reorderService(id: string, display_order: number) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("services").update({ display_order }).eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
}
