"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, Share2, Puzzle, ListChecks, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

const CHECKLIST = [
  {
    icon: SlidersHorizontal,
    title: "Natively integrates with your existing tools",
    desc: null,
    highlight: false,
  },
  {
    icon: Share2,
    title: "Seamlessly collaborates across every channel",
    desc: "Website, WhatsApp, email and CRM stay in sync — a lead never falls through the cracks.",
    highlight: true,
  },
  {
    icon: Puzzle,
    title: "Flexibly adapts to your size and industry",
    desc: null,
    highlight: false,
  },
  {
    icon: ListChecks,
    title: "Automates the full spectrum of follow-up",
    desc: null,
    highlight: false,
  },
];

const CONVERSATIONS = [
  { name: "Amaka Obi", time: "10:32", preview: "Yes please, send me the proposal" },
  { name: "David Kalu", time: "09:15", preview: "How soon can we start?" },
  { name: "Grace Eze", time: "Yesterday", preview: "Thanks for the quick reply!" },
];

export function TransformationSection() {
  return (
    <section className="section-y bg-gray-50">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="pill mx-auto w-fit">Technology</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Lead your growth transformation.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-3">
            {CHECKLIST.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className={
                  item.highlight
                    ? "rounded-xl border border-accent-100 bg-accent-100/60 p-5"
                    : "rounded-xl border border-transparent p-5"
                }
              >
                <div className="flex items-start gap-3">
                  <item.icon className={item.highlight ? "mt-0.5 h-5 w-5 text-accent-600" : "mt-0.5 h-5 w-5 text-gray-500"} />
                  <div>
                    <p className="font-medium text-navy">{item.title}</p>
                    {item.desc && <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.desc}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="card-float relative overflow-hidden bg-gray-100 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-navy">Lead inbox</p>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-accent-600">Live</span>
              </div>

              <div className="mt-4 space-y-2.5">
                {CONVERSATIONS.map((c) => (
                  <div key={c.name} className="flex items-center gap-3 rounded-xl bg-white p-3.5 shadow-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                      {c.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-navy">{c.name}</p>
                        <span className="shrink-0 text-[11px] text-gray-400">{c.time}</span>
                      </div>
                      <p className="truncate text-xs text-gray-500">{c.preview}</p>
                    </div>
                  </div>
                ))}
              </div>

              <span className="absolute -bottom-4 -right-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg">
                <MessageCircle className="h-6 w-6" fill="white" strokeWidth={0} />
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
