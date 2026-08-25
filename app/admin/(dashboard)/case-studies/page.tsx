import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/lib/types/database";

export const metadata: Metadata = { title: "Case Studies" };

export default async function AdminCaseStudiesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("case_studies").select("*").order("created_at", { ascending: false });
  const items = (data as CaseStudy[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Case Studies</h1>
          <p className="text-sm text-gray-500">{items.length} case stud{items.length === 1 ? "y" : "ies"}</p>
        </div>
        <Link href="/admin/case-studies/new"><Button><Plus className="h-4 w-4" /> New case study</Button></Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-gray-400">No case studies yet.</td></tr>
            )}
            {items.map((cs) => (
              <tr key={cs.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/case-studies/${cs.id}`} className="font-medium text-navy hover:underline">{cs.title}</Link>
                  {cs.is_demo && <Badge variant="outline" className="ml-2">Demo</Badge>}
                </td>
                <td className="px-4 py-3 text-gray-600">{cs.client || "-"}</td>
                <td className="px-4 py-3"><Badge variant={cs.published ? "default" : "outline"}>{cs.published ? "Published" : "Draft"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
