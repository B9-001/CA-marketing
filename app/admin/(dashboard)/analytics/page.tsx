import type { Metadata } from "next";
import { getOverviewData, rangeToDates, type DateRangeKey } from "@/lib/admin/queries";
import { DateRangeFilter } from "@/components/admin/date-range-filter";
import { TrendChart, BarChartSimple } from "@/components/admin/charts";

export const metadata: Metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage(
  props: PageProps<"/admin/analytics">
) {
  const searchParams = await props.searchParams;
  const range = (searchParams.range as DateRangeKey) || "30d";
  const { from, to } = rangeToDates(range);
  const data = await getOverviewData(from, to);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Analytics</h1>
          <p className="text-sm text-gray-500">
            First-party analytics collected via /api/track and stored in analytics_events.
          </p>
        </div>
        <DateRangeFilter />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-navy">Unique visitors / day</h2>
          <div className="mt-4"><TrendChart data={data.visitorsSeries} /></div>
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-navy">Leads / day</h2>
          <div className="mt-4"><TrendChart data={data.leadsSeries} /></div>
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-navy">Top pages</h2>
          <div className="mt-4">
            <BarChartSimple data={data.topPages.map((p) => ({ name: p.page, value: p.value }))} horizontal />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-navy">CTA performance</h2>
          <div className="mt-4">
            <BarChartSimple data={data.ctaPerformance.map((c) => ({ name: c.location, value: c.value }))} horizontal />
          </div>
        </div>
      </div>
    </div>
  );
}
