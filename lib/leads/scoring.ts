import type { LeadTemperature } from "@/lib/types/database";
import type { ConsultationInput } from "@/lib/validation/consultation";

/**
 * Lead scoring model (0-100), broken into the 5 weighted factors requested
 * in the CA Marketing spec. The consultation form does not collect explicit
 * "urgency" or "decision-maker" fields, so those two factors are inferred
 * from the free-text and contact-detail signals available — documented
 * inline. Tune the keyword lists as real lead data comes in.
 */

const URGENCY_KEYWORDS = [
  "asap",
  "urgent",
  "urgently",
  "immediately",
  "this month",
  "this week",
  "right away",
  "as soon as possible",
  "losing customers",
  "losing sales",
];

const SEVERITY_KEYWORDS = [
  "no leads",
  "no website",
  "not converting",
  "losing",
  "struggling",
  "no system",
  "manual",
  "behind competitors",
  "no strategy",
  "not growing",
  "stuck",
];

const BUDGET_SCORES: Record<string, number> = {
  "under-100k": 5,
  "100k-500k": 10,
  "500k-1m": 15,
  "1m-5m": 18,
  "above-5m": 20,
  "not-sure": 8,
};

const BUSINESS_SIZE_SCORES: Record<string, number> = {
  solo: 12,
  startup: 18,
  small: 22,
  medium: 25,
  large: 25,
  ngo: 18,
};

function countKeywordHits(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  return keywords.reduce((hits, kw) => (lower.includes(kw) ? hits + 1 : hits), 0);
}

export interface LeadScoreResult {
  score: number;
  temperature: LeadTemperature;
  breakdown: {
    business_fit: number;
    problem_severity: number;
    budget: number;
    urgency: number;
    decision_maker_access: number;
  };
}

export function scoreLead(input: ConsultationInput): LeadScoreResult {
  // 1. Business fit (max 25) — business size + having an industry specified.
  const sizeKey = (input.business_size || "").toLowerCase().replace(/\s+/g, "-");
  let business_fit = BUSINESS_SIZE_SCORES[sizeKey] ?? 15;
  if (input.industry) business_fit = Math.min(25, business_fit + 3);
  business_fit = Math.min(25, business_fit);

  // 2. Problem severity (max 25) — length + keyword signal in main_challenge.
  const challenge = input.main_challenge || "";
  let problem_severity = challenge.length > 20 ? 10 : challenge.length > 0 ? 5 : 0;
  problem_severity += Math.min(15, countKeywordHits(challenge, SEVERITY_KEYWORDS) * 5);
  problem_severity = Math.min(25, problem_severity);

  // 3. Budget (max 20)
  const budgetKey = (input.budget || "").toLowerCase().replace(/\s+/g, "-");
  const budget = BUDGET_SCORES[budgetKey] ?? (input.budget ? 8 : 0);

  // 4. Urgency (max 15) — inferred from keywords in challenge/outcome/message.
  const urgencyText = `${challenge} ${input.desired_outcome || ""} ${input.message || ""}`;
  let urgency = Math.min(15, countKeywordHits(urgencyText, URGENCY_KEYWORDS) * 8);
  if (urgency === 0 && challenge.length > 0) urgency = 5; // baseline: they described a real problem

  // 5. Decision-maker access (max 15) — inferred from contact completeness.
  let decision_maker_access = 5;
  if (input.phone) decision_maker_access += 5;
  if (input.business_name) decision_maker_access += 3;
  if (["owner", "founder", "solo", "small"].includes(sizeKey)) decision_maker_access += 2;
  decision_maker_access = Math.min(15, decision_maker_access);

  const score = Math.round(
    business_fit + problem_severity + budget + urgency + decision_maker_access
  );

  let temperature: LeadTemperature = "LOW";
  if (score >= 80) temperature = "HOT";
  else if (score >= 60) temperature = "WARM";
  else if (score >= 40) temperature = "POTENTIAL";

  return {
    score: Math.min(100, score),
    temperature,
    breakdown: { business_fit, problem_severity, budget, urgency, decision_maker_access },
  };
}
