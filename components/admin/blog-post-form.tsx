"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaUploadButton } from "@/components/admin/media-upload-button";
import { createBlogPost, updateBlogPost, deleteBlogPost, type BlogPostInput } from "@/app/admin/(dashboard)/blog/actions";
import type { BlogPost } from "@/lib/types/database";

export function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState(post?.featured_image || "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    const input: BlogPostInput = {
      title: form.get("title") as string,
      slug: form.get("slug") as string,
      excerpt: form.get("excerpt") as string,
      content: form.get("content") as string,
      featured_image: image,
      category: form.get("category") as string,
      author: form.get("author") as string,
      status: form.get("status") as "draft" | "published",
    };

    startTransition(async () => {
      const result = post ? await updateBlogPost(post.id, input) : await createBlogPost(input);
      if (result?.error) setError(result.error);
      else if (post) router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><Label htmlFor="title">Title *</Label><Input id="title" name="title" required defaultValue={post?.title} /></div>
        <div><Label htmlFor="slug">Slug</Label><Input id="slug" name="slug" defaultValue={post?.slug} /></div>
        <div><Label htmlFor="category">Category</Label><Input id="category" name="category" defaultValue={post?.category ?? ""} /></div>
        <div><Label htmlFor="author">Author</Label><Input id="author" name="author" defaultValue={post?.author ?? "CA Marketing Team"} /></div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={post?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </div>
      </div>

      <div>
        <Label>Featured image</Label>
        <div className="flex items-center gap-3">
          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
          <MediaUploadButton onUploaded={setImage} label="Upload" />
        </div>
      </div>

      <div><Label htmlFor="excerpt">Excerpt</Label><Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} /></div>
      <div><Label htmlFor="content">Content</Label><Textarea id="content" name="content" className="min-h-64" defaultValue={post?.content ?? ""} /></div>

      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between border-t border-border pt-5">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {post ? "Save changes" : "Create post"}
        </Button>
        {post && (
          <Button
            type="button"
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            onClick={() => confirm("Delete this post?") && startTransition(() => deleteBlogPost(post.id))}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
      </div>
    </form>
  );
}
