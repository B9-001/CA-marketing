import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";
import { NewsletterForm } from "@/components/site/newsletter-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with CA Marketing — email, phone, WhatsApp or send us a message.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk about your business." />

      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-navy">{settings.contact_email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-gray-500">Phone / WhatsApp</p>
                  <p className="font-medium text-navy">{settings.contact_phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-navy">{settings.contact_address}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-navy">Get growth ideas in your inbox</h3>
              <p className="mt-1 text-sm text-gray-600">
                One useful email a month. No spam.
              </p>
              <div className="mt-4">
                <NewsletterForm />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
