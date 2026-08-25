import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types/database";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="section-y bg-gray-50">
      <div className="container-page">
        <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
          What clients say
        </h2>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-lg border border-border bg-white p-6">
              {t.rating && (
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4"
                      fill={i < t.rating! ? "currentColor" : "none"}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              )}
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                &ldquo;{t.testimonial}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {[t.position, t.organization].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
