import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Lead, AnalyticsEvent, LeadStage } from "@/lib/types/database";

export type DateRangeKey = "today" | "7d" | "30d" | "90d";

export function rangeToDates(range: DateRangeKey, custom?: { from: string; to: string }) {
  if (custom) return { from: new Date(custom.from), to: new Date(custom.to) };

  const to = new Date();
  const from = new Date();
  if (range === "today") from.setHours(0, 0, 0, 0);
  else if (range === "7d") from.setDate(from.getDate() - 7);
  else if (range === "30d") from.setDate(from.getDate() - 30);
  else if (range === "90d") from.setDate(from.getDate() - 90);
  return { from, to };
}

const WON_STAGES: LeadStage[] = ["WON", "ACTIVE_CLIENT"];
const QUALIFIED_STAGES: LeadStage[] = [
  "QUALIFIED", "DISCOVERY", "AUDIT", "PROPOSAL", "NEGOTIATION", "WON", "ONBOARDING", "ACTIVE_CLIENT",
];

/**
 * Pulls raw leads + analytics_events rows for the window and aggregates them
 * in application code. Fine at CA Marketing's current scale; if lead/event
 * volume grows significantly, replace with Postgres RPC functions /
 * materialized views instead of widening this query.
 */
export async function getOverviewData(from: Date, to: Date) {
  const supabase = await createClient();

  const [{ data: leadsData }, { data: eventsData }] = await Promise.all([
    supabase
      .from("leads")
      .select("*")
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString()),
    supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString()),
  ]);

  const leads = (leadsData as Lead[]) ?? [];
  const events = (eventsData as AnalyticsEvent[]) ?? [];

  const uniqueVisitors = new Set(events.map((e) => e.visitor_id)).size;
  const consultations = events.filter((e) => e.event_name === "consultation_submitted").length;
  const qualifiedLeads = leads.filter((l) => QUALIFIED_STAGES.includes(l.stage)).length;
  const proposals = leads.filter((l) => l.stage === "PROPOSAL").length;
  const wonDeals = leads.filter((l) => WON_STAGES.includes(l.stage)).length;
  const pipelineValue = leads
    .filter((l) => !WON_STAGES.includes(l.stage) && l.stage !== "LOST")
    .reduce((sum, l) => sum + (l.pipeline_value ?? 0), 0);
  const revenue = leads
    .filter((l) => WON_STAGES.includes(l.stage))
    .reduce((sum, l) => sum + (l.pipeline_value ?? 0), 0);
  const conversionRate = uniqueVisitors > 0 ? (leads.length / uniqueVisitors) * 100 : 0;

  // Series (by day)
  const dayKey = (d: string) => d.slice(0, 10);
  const visitorsByDay = new Map<string, Set<string>>();
  events
    .filter((e) => e.event_name === "session_start")
    .forEach((e) => {
      const key = dayKey(e.created_at);
      if (!visitorsByDay.has(key)) visitorsByDay.set(key, new Set());
      visitorsByDay.get(key)!.add(e.visitor_id);
    });
  const visitorsSeries = Array.from(visitorsByDay.entries())
    .map(([date, set]) => ({ date, value: set.size }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const leadsByDay = new Map<string, number>();
  leads.forEach((l) => {
    const key = dayKey(l.created_at);
    leadsByDay.set(key, (leadsByDay.get(key) ?? 0) + 1);
  });
  const leadsSeries = Array.from(leadsByDay.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Lead sources
  const sourceCounts = new Map<string, number>();
  leads.forEach((l) => sourceCounts.set(l.source, (sourceCounts.get(l.source) ?? 0) + 1));
  const leadSources = Array.from(sourceCounts.entries()).map(([source, value]) => ({ source, value }));

  // Pipeline funnel
  const stageOrder: LeadStage[] = [
    "NEW", "CONTACTED", "QUALIFIED", "DISCOVERY", "AUDIT", "PROPOSAL",
    "NEGOTIATION", "WON", "LOST", "ONBOARDING", "ACTIVE_CLIENT",
  ];
  const funnel = stageOrder.map((stage) => ({
    stage,
    value: leads.filter((l) => l.stage === stage).length,
  }));

  // Top pages
  const pageCounts = new Map<string, number>();
  events
    .filter((e) => e.event_name === "page_view" && e.page)
    .forEach((e) => pageCounts.set(e.page!, (pageCounts.get(e.page!) ?? 0) + 1));
  const topPages = Array.from(pageCounts.entries())
    .map(([page, value]) => ({ page, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // CTA performance
  const ctaCounts = new Map<string, number>();
  events
    .filter((e) => e.event_name === "cta_click")
    .forEach((e) => {
      const loc = (e.metadata?.location as string) || "unknown";
      ctaCounts.set(loc, (ctaCounts.get(loc) ?? 0) + 1);
    });
  const ctaPerformance = Array.from(ctaCounts.entries())
    .map(([location, value]) => ({ location, value }))
    .sort((a, b) => b.value - a.value);

  return {
    totals: {
      visitors: uniqueVisitors,
      leads: leads.length,
      qualifiedLeads,
      consultations,
      proposals,
      wonDeals,
      pipelineValue,
      revenue,
      conversionRate,
    },
    visitorsSeries,
    leadsSeries,
    leadSources,
    funnel,
    topPages,
    ctaPerformance,
  };
}
