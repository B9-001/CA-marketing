import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LeadDetail } from "@/components/admin/lead-detail";
import type { Lead, LeadNote, LeadTask } from "@/lib/types/database";

export const metadata: Metadata = { title: "Lead detail" };

export default async function AdminLeadDetailPage(props: PageProps<"/admin/leads/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: lead }, { data: notes }, { data: tasks }] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).maybeSingle(),
    supabase.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("lead_tasks").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
  ]);

  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </Link>
      <LeadDetail
        lead={lead as Lead}
        notes={(notes as LeadNote[]) ?? []}
        tasks={(tasks as LeadTask[]) ?? []}
      />
    </div>
  );
}
