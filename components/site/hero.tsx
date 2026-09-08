"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Paperclip, Languages, Mic, ImagePlus, Plus,
  Home, Target, Briefcase, FileText, Clock, Settings, ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track";
import type { SiteSettings } from "@/lib/settings";

const AVATAR_INITIALS = ["A", "F", "M"];

const SIDEBAR_ICONS = [Plus, Home, Target, Briefcase, FileText, Clock];

const FEATURE_TILES = [
  {
    icon: Paperclip,
    title: "Bring your files",
    desc: "Drop in your brand assets, docs and data — we work with what you already have.",
  },
  {
    icon: Languages,
    title: "Speak your market",
    desc: "Campaigns and copy tuned to how your customers actually search and shop.",
  },
  {
    icon: Mic,
    title: "Tell us the problem",
    desc: "One call is enough. No lengthy onboarding forms required.",
  },
  {
    icon: ImagePlus,
    title: "Bring your visuals",
    desc: "We slot straight into your existing brand, or build one from scratch.",
  },
];

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="gradient-blob-bg overflow-hidden bg-white pb-0 pt-16 lg:pt-24">
      <div className="container-page flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pill"
        >
          <span className="flex -space-x-2">
            {AVATAR_INITIALS.map((letter, i) => (
              <span
                key={letter}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-navy text-[10px] font-semibold text-white"
                style={{ zIndex: AVATAR_INITIALS.length - i }}
              >
                {letter}
              </span>
            ))}
          </span>
          40+ businesses growing with us
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mt-7 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]"
        >
          {settings.hero_headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-gray-600"
        >
          {settings.hero_description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link href="/consultation" onClick={() => trackEvent("cta_click", { location: "hero_primary" })}>
            <Button size="lg" variant="dark" className="group">
              {settings.hero_cta_primary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/work" onClick={() => trackEvent("cta_click", { location: "hero_secondary" })}>
            <Button size="lg" variant="outline">
              {settings.hero_cta_secondary}
            </Button>
          </Link>
        </motion.div>

        {/* Floating product card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="card-float relative mt-14 flex w-full max-w-3xl overflow-hidden text-left lg:mt-16"
        >
          <div className="hidden w-14 flex-col items-center gap-4 border-r border-border bg-gray-50 py-6 sm:flex">
            {SIDEBAR_ICONS.map((Icon, i) => (
              <span
                key={i}
                className={`flex h-8 w-8 items-center justify-center rounded-md ${i === 0 ? "bg-navy text-white" : "text-gray-400"}`}
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
            <span className="mt-auto flex h-8 w-8 items-center justify-center rounded-md text-gray-400">
              <Settings className="h-4 w-4" />
            </span>
          </div>

          <div className="flex-1 p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-semibold text-navy">Hi, let&apos;s grow your business.</p>
                <p className="text-sm text-gray-500">Tell us where you&apos;re starting from.</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {FEATURE_TILES.map((tile) => (
                <div key={tile.title} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-navy">{tile.title}</p>
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-500">
                      <tile.icon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{tile.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-gray-50 px-4 py-2.5">
              <span className="flex-1 text-sm text-gray-400">Ask about your growth plan…</span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                <ArrowUp className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </motion.div>

        <div className="h-16 lg:h-20" />
      </div>
    </section>
  );
}
