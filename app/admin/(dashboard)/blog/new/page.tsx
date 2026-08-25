import type { Metadata } from "next";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export const metadata: Metadata = { title: "New Post" };

export default function NewBlogPostPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy">New post</h1>
      <div className="rounded-lg border border-border bg-white p-6"><BlogPostForm /></div>
    </div>
  );
}
