import type { Metadata } from "next";
import { Users, UserCheck, CalendarCheck, FileSignature, Trophy, Wallet, TrendingUp, Eye } from "lucide-react";
import { getOverviewData, rangeToDates, type DateRangeKey } from "@/lib/admin/queries";
import { StatCard } from "@/components/admin/stat-card";
import { DateRangeFilter } from "@/components/admin/date-range-filter";
import { TrendChart, BarChartSimple, DonutChart } from "@/components/admin/charts";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverviewPage(
  props: PageProps<"/admin">
) {
  const searchParams = await props.searchParams;
  const range = (searchParams.range as DateRangeKey) || "30d";
  const { from, to } = rangeToDates(range);
  const data = await getOverviewData(from, to);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Overview</h1>
          <p className="text-sm text-gray-500">Real-time performance across the growth funnel.</p>
        </div>
        <DateRangeFilter />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Visitors" value={data.totals.visitors} icon={Eye} />
        <StatCard label="Total Leads" value={data.totals.leads} icon={Users} />
        <StatCard label="Qualified Leads" value={data.totals.qualifiedLeads} icon={UserCheck} />
        <StatCard label="Consultations" value={data.totals.consultations} icon={CalendarCheck} />
        <StatCard label="Proposals" value={data.totals.proposals} icon={FileSignature} />
        <StatCard label="Won Deals" value={data.totals.wonDeals} icon={Trophy} />
        <StatCard label="Pipeline Value" value={formatCurrency(data.totals.pipelineValue)} icon={Wallet} />
        <StatCard label="Conversion Rate" value={`${data.totals.conversionRate.toFixed(1)}%`} icon={TrendingUp} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-navy">Visitors over time</h2>
          <div className="mt-4"><TrendChart data={data.visitorsSeries} /></div>
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-navy">Leads over time</h2>
          <div className="mt-4"><TrendChart data={data.leadsSeries} /></div>
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-navy">Lead sources</h2>
          <div className="mt-4">
            <DonutChart data={data.leadSources.map((s) => ({ name: s.source, value: s.value }))} />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-navy">Pipeline funnel</h2>
          <div className="mt-4">
            <BarChartSimple
              data={data.funnel.map((f) => ({ name: f.stage, value: f.value }))}
              horizontal
            />
          </div>
        </div>
      </div>
    </div>
  );
}
