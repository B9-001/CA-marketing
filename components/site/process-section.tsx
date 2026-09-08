import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";

const STEPS = [
  { n: "01", title: "Understand", desc: "Understand the business, customer and problem." },
  { n: "02", title: "Strategize", desc: "Develop a practical growth strategy." },
  { n: "03", title: "Build", desc: "Implement the required marketing and technology systems." },
  { n: "04", title: "Grow", desc: "Measure, optimize and improve." },
];

export function ProcessSection() {
  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            How we work
          </h2>
          <p className="mt-4 text-gray-600">
            A simple, repeatable process built for accountability and results.
          </p>
        </Reveal>

        <RevealGroup className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <RevealItem key={step.n} className="card-soft relative p-6">
              <span className="text-4xl font-semibold text-accent-100">{step.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
