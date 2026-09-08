import { Monitor, Users, Target } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import type { SiteSettings } from "@/lib/settings";

const ICONS = [Monitor, Users, Target];

export function StatsBand({ settings }: { settings: SiteSettings }) {
  const stats = settings.statistics.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-navy py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(22,163,74,0.18) 0%, rgba(22,163,74,0) 60%), radial-gradient(50% 60% at 90% 100%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="container-page relative">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="pill mx-auto w-fit border-white/15 bg-white/5 text-gray-200">Track record</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Reliable, measured, and built to last.
          </h2>
        </Reveal>

        <RevealGroup className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-3">
          {stats.map((stat, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <RevealItem key={stat.label}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 text-center backdrop-blur">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
