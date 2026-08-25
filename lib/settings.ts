import { createClient } from "@/lib/supabase/server";

export interface SiteSettings {
  hero_headline: string;
  hero_description: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  about_content: string;
  statistics: { label: string; value: string }[];
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  whatsapp_number: string;
  whatsapp_message: string;
  social_links: { platform: string; url: string }[];
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  hero_headline: "Turn Your Digital Presence Into a Growth Engine.",
  hero_description:
    "CA Marketing helps SMEs, MSMEs and organizations attract more customers, generate quality leads, strengthen their digital presence and automate the processes that keep their businesses growing.",
  hero_cta_primary: "Book a Consultation",
  hero_cta_secondary: "View Our Work",
  about_content:
    "CA Marketing is a consultancy and digital marketing agency helping SMEs, MSMEs, startups, NGOs and organizations improve their digital presence, generate leads, increase sales and automate repetitive business processes.",
  statistics: [
    { label: "Businesses supported", value: "40+" },
    { label: "Average lead increase", value: "3x" },
    { label: "Hours saved via automation / month", value: "120+" },
    { label: "Client satisfaction", value: "98%" },
  ],
  contact_email: "hello@ca-marketing.example",
  contact_phone: "+234 800 000 0000",
  contact_address: "Lagos, Nigeria",
  whatsapp_number: "2348000000000",
  whatsapp_message:
    "Hello CA Marketing, I would like to discuss how you can help my business grow.",
  social_links: [
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "Instagram", url: "https://instagram.com" },
    { platform: "X", url: "https://x.com" },
  ],
};

/**
 * Reads all site_settings rows and merges them over the defaults so the
 * public site always renders even before an admin has configured anything.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_settings").select("key, value");

    if (error || !data) return DEFAULT_SITE_SETTINGS;

    const overrides = Object.fromEntries(data.map((row) => [row.key, row.value]));
    return { ...DEFAULT_SITE_SETTINGS, ...overrides } as SiteSettings;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
