import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Our Work", href: "/work" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Insights", href: "/insights" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Digital Marketing", href: "/services" },
      { label: "Website & Digital Experience", href: "/services" },
      { label: "Lead Generation", href: "/services" },
      { label: "AI & Automation", href: "/services" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { label: "Book a Consultation", href: "/consultation" },
      { label: "Contact Us", href: "/contact" },
      { label: "Solutions", href: "/solutions" },
    ],
  },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-border bg-navy text-white">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <span className="text-lg font-semibold tracking-tight">CA Marketing</span>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-300">
            Marketing, technology and automation — connected into one growth
            engine for SMEs, MSMEs and organizations.
          </p>
          <div className="mt-6 space-y-1 text-sm text-gray-300">
            <p>{settings.contact_email}</p>
            <p>{settings.contact_phone}</p>
            <p>{settings.contact_address}</p>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-xs text-gray-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} CA Marketing. All rights reserved.</p>
          <div className="flex gap-5">
            {settings.social_links.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {s.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
