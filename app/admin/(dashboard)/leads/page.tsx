import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Lead, LeadStage, LeadTemperature } from "@/lib/types/database";

export const metadata: Metadata = { title: "Leads / CRM" };

const STAGES: LeadStage[] = [
  "NEW", "CONTACTED", "QUALIFIED", "DISCOVERY", "AUDIT", "PROPOSAL",
  "NEGOTIATION", "WON", "LOST", "ONBOARDING", "ACTIVE_CLIENT",
];
const TEMPERATURES: LeadTemperature[] = ["HOT", "WARM", "POTENTIAL", "LOW"];

const TEMP_VARIANT: Record<LeadTemperature, "hot" | "warm" | "potential" | "low"> = {
  HOT: "hot", WARM: "warm", POTENTIAL: "potential", LOW: "low",
};

export default async function AdminLeadsPage(
  props: PageProps<"/admin/leads">
) {
  const searchParams = await props.searchParams;
  const stageFilter = (searchParams.stage as string) || "";
  const tempFilter = (searchParams.temperature as string) || "";

  const supabase = await createClient();
  let query = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200);
  if (stageFilter) query = query.eq("stage", stageFilter as LeadStage);
  if (tempFilter) query = query.eq("lead_temperature", tempFilter as LeadTemperature);

  const { data } = await query;
  const leads = (data as Lead[]) ?? [];

  function buildHref(params: Record<string, string>) {
    const sp = new URLSearchParams({ stage: stageFilter, temperature: tempFilter, ...params });
    Array.from(sp.entries()).forEach(([k, v]) => { if (!v) sp.delete(k); });
    return `/admin/leads?${sp.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Leads / CRM</h1>
        <p className="text-sm text-gray-500">{leads.length} lead{leads.length === 1 ? "" : "s"}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <p className="mb-1.5 text-xs font-medium text-gray-500">Stage</p>
          <div className="flex flex-wrap gap-1.5">
            <Link href={buildHref({ stage: "" })} className={`rounded-full border px-2.5 py-1 text-xs ${!stageFilter ? "border-navy bg-navy text-white" : "border-border text-gray-600"}`}>All</Link>
            {STAGES.map((s) => (
              <Link key={s} href={buildHref({ stage: s })} className={`rounded-full border px-2.5 py-1 text-xs ${stageFilter === s ? "border-navy bg-navy text-white" : "border-border text-gray-600"}`}>
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-gray-500">Temperature</p>
          <div className="flex flex-wrap gap-1.5">
            <Link href={buildHref({ temperature: "" })} className={`rounded-full border px-2.5 py-1 text-xs ${!tempFilter ? "border-navy bg-navy text-white" : "border-border text-gray-600"}`}>All</Link>
            {TEMPERATURES.map((t) => (
              <Link key={t} href={buildHref({ temperature: t })} className={`rounded-full border px-2.5 py-1 text-xs ${tempFilter === t ? "border-navy bg-navy text-white" : "border-border text-gray-600"}`}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[840px] text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No leads yet.</td></tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-navy hover:underline">
                    {lead.full_name}
                  </Link>
                  <p className="text-xs text-gray-400">{lead.lead_number} · {lead.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{lead.business_name || "-"}</td>
                <td className="px-4 py-3 text-gray-600">{lead.service_needed || "-"}</td>
                <td className="px-4 py-3">
                  <Badge variant={TEMP_VARIANT[lead.lead_temperature]}>{lead.lead_score} · {lead.lead_temperature}</Badge>
                </td>
                <td className="px-4 py-3"><Badge variant="outline">{lead.stage}</Badge></td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{formatDate(lead.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
