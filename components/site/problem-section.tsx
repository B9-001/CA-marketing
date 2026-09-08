import { X, Check } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";

const PROBLEMS = [
  "Weak online presence",
  "Inconsistent marketing",
  "Poor lead generation",
  "Leads getting lost",
  "Manual follow-up",
  "Low conversion",
  "Outdated websites",
  "Lack of useful analytics",
];

export function ProblemSection() {
  return (
    <section className="section-y bg-gray-50">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Your business shouldn&apos;t have to fight for attention online.
          </h2>
          <p className="mt-4 text-gray-600">
            Most growth problems are not one problem — they&apos;re a chain of
            disconnected systems. CA Marketing connects marketing, technology
            and automation so nothing falls through the cracks.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((problem) => (
            <RevealItem
              key={problem}
              className="card-soft flex items-start gap-3 p-4"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                <X className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="text-sm font-medium text-gray-700">{problem}</span>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15} className="mx-auto mt-10 flex max-w-xl items-center gap-3 rounded-2xl border border-accent-100 bg-accent-100/50 p-4">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <p className="text-sm font-medium text-navy">
            CA Marketing connects marketing, technology and automation into a
            single system that fixes all of the above.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
