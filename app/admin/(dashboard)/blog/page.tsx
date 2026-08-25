import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/types/database";

export const metadata: Metadata = { title: "Insights / Blog" };

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  const posts = (data as BlogPost[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Insights / Blog</h1>
          <p className="text-sm text-gray-500">{posts.length} post{posts.length === 1 ? "" : "s"}</p>
        </div>
        <Link href="/admin/blog/new"><Button><Plus className="h-4 w-4" /> New post</Button></Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-gray-400">No posts yet.</td></tr>
            )}
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3"><Link href={`/admin/blog/${p.id}`} className="font-medium text-navy hover:underline">{p.title}</Link></td>
                <td className="px-4 py-3 text-gray-600">{p.category || "-"}</td>
                <td className="px-4 py-3"><Badge variant={p.status === "published" ? "default" : "outline"}>{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
