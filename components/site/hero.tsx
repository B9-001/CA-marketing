"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ArrowRight, Users, TrendingUp, Workflow, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track";
import type { SiteSettings } from "@/lib/settings";

const TRUST_INDICATORS = ["Marketing", "Technology", "AI Automation", "Growth"];

const trendData = [
  { v: 12 }, { v: 18 }, { v: 15 }, { v: 24 }, { v: 22 }, { v: 30 }, { v: 28 }, { v: 38 },
];

const STATS = [
  { icon: Users, label: "Website Visitors", value: "12,480", delta: "+18%" },
  { icon: Target, label: "Qualified Leads", value: "312", delta: "+24%" },
  { icon: TrendingUp, label: "Conversion Rate", value: "6.4%", delta: "+1.2pt" },
  { icon: Workflow, label: "Workflows Automated", value: "9", delta: "live" },
];

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-navy text-white">
      <div className="container-page grid gap-14 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex flex-wrap gap-2">
            {TRUST_INDICATORS.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-gray-200"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            {settings.hero_headline}
          </h1>

          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-gray-300">
            {settings.hero_description}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/consultation" onClick={() => trackEvent("cta_click", { location: "hero_primary" })}>
              <Button size="lg" className="group">
                {settings.hero_cta_primary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/work" onClick={() => trackEvent("cta_click", { location: "hero_secondary" })}>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                {settings.hero_cta_secondary}
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Growth Dashboard</span>
            <span className="flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Live
            </span>
          </div>

          <div className="mt-5 h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="heroTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#4ade80" strokeWidth={2} fill="url(#heroTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <s.icon className="h-4 w-4 text-accent" />
                <p className="mt-2 text-xl font-semibold">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="mt-1 text-[11px] font-medium text-accent">{s.delta}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
