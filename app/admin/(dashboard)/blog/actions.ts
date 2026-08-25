"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import type { BlogPost } from "@/lib/types/database";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export type BlogPostInput = Partial<
  Pick<BlogPost, "title" | "slug" | "excerpt" | "content" | "featured_image" | "category" | "author" | "status">
>;

export async function createBlogPost(input: BlogPostInput) {
  await requireAdmin();
  const supabase = await createClient();
  const slug = input.slug ? slugify(input.slug) : slugify(input.title || "");
  const status = input.status || "draft";

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: input.title || "Untitled post",
      slug,
      excerpt: input.excerpt || null,
      content: input.content || null,
      featured_image: input.featured_image || null,
      category: input.category || null,
      author: input.author || null,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message || "Failed to create post" };
  revalidatePath("/admin/blog");
  revalidatePath("/insights");
  redirect(`/admin/blog/${data.id}`);
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  await requireAdmin();
  const supabase = await createClient();
  const update: BlogPostInput & { published_at?: string | null } = { ...input };
  if (input.slug) update.slug = slugify(input.slug);

  if (input.status === "published") {
    const { data: existing } = await supabase.from("blog_posts").select("published_at").eq("id", id).maybeSingle();
    if (!existing?.published_at) update.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from("blog_posts").update(update).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/insights");
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/insights");
  redirect("/admin/blog");
}
