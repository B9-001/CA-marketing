import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types/database";

export const metadata: Metadata = { title: "Portfolio" };

export default async function AdminPortfolioPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").order("display_order", { ascending: true });
  const projects = (data as Project[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Portfolio</h1>
          <p className="text-sm text-gray-500">{projects.length} project{projects.length === 1 ? "" : "s"}</p>
        </div>
        <Link href="/admin/portfolio/new"><Button><Plus className="h-4 w-4" /> New project</Button></Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Order</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-400">No projects yet. Create your first one.</td></tr>
            )}
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/portfolio/${p.id}`} className="font-medium text-navy hover:underline">{p.title}</Link>
                  {p.featured && <Badge variant="dark" className="ml-2">Featured</Badge>}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.published ? "default" : "outline"}>{p.published ? "Published" : "Draft"}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.display_order}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
