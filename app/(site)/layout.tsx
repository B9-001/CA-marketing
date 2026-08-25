import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { getSiteSettings } from "@/lib/settings";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CA Marketing",
    url: siteUrl,
    description:
      "Consultancy and digital marketing agency helping SMEs, MSMEs, startups and NGOs improve their digital presence, generate leads and automate business processes.",
    email: settings.contact_email,
    telephone: settings.contact_phone,
    sameAs: settings.social_links.map((s) => s.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <PageViewTracker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton number={settings.whatsapp_number} message={settings.whatsapp_message} />
    </>
  );
}
