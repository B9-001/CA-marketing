import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import type { BlogPost } from "@/lib/types/database";

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditBlogPostPage(props: PageProps<"/admin/blog/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Edit post</h1>
      <div className="rounded-lg border border-border bg-white p-6"><BlogPostForm post={data as BlogPost} /></div>
    </div>
  );
}
