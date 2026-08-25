import type { CaseStudyMetric } from "@/lib/types/database";

export function parseMetrics(text: string): CaseStudyMetric[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return { label: label.trim(), value: rest.join(":").trim() };
    })
    .filter((m) => m.label && m.value);
}

export function parseGallery(text: string): string[] {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}
