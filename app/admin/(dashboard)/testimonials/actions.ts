"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import type { Testimonial } from "@/lib/types/database";

export type TestimonialInput = Partial<
  Pick<Testimonial, "name" | "position" | "organization" | "photo_url" | "testimonial" | "rating" | "published" | "display_order">
>;

export async function createTestimonial(input: TestimonialInput) {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      name: input.name || "Anonymous",
      position: input.position || null,
      organization: input.organization || null,
      photo_url: input.photo_url || null,
      testimonial: input.testimonial || "",
      rating: input.rating ?? null,
      published: input.published ?? false,
      display_order: input.display_order ?? 0,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message || "Failed to create testimonial" };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect(`/admin/testimonials/${data.id}`);
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath(`/admin/testimonials/${id}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}
