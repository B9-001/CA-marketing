import { z } from "zod";

// Server-side validation for the consultation form. Mirrors the client
// form but is authoritative — the client must never be trusted alone.
export const consultationSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(120),
  business_name: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  website: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^https?:\/\//i.test(v) || /^[\w-]+\.[a-z]{2,}/i.test(v),
      "Enter a valid website (e.g. yourbusiness.com)"
    ),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  business_size: z.string().trim().max(60).optional().or(z.literal("")),
  service_needed: z.string().trim().max(120).optional().or(z.literal("")),
  main_challenge: z.string().trim().max(2000).optional().or(z.literal("")),
  desired_outcome: z.string().trim().max(2000).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  // Honeypot field — real users never fill this in.
  company_website_url: z.string().max(0).optional().or(z.literal("")),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
