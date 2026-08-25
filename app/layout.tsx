import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CA Marketing — Marketing, Technology & Automation Consultancy",
    template: "%s | CA Marketing",
  },
  description:
    "CA Marketing helps SMEs, MSMEs and organizations attract more customers, generate quality leads, strengthen their digital presence and automate the processes that keep their businesses growing.",
  keywords: [
    "digital marketing agency Nigeria",
    "marketing agency for SMEs",
    "digital consultancy Nigeria",
    "AI automation Nigeria",
    "lead generation agency Nigeria",
    "business automation Nigeria",
  ],
  openGraph: {
    type: "website",
    siteName: "CA Marketing",
    title: "CA Marketing — Turn Your Digital Presence Into a Growth Engine.",
    description:
      "Marketing, technology and automation, connected into one growth engine for SMEs, MSMEs and organizations.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "CA Marketing",
    description: "Turn Your Digital Presence Into a Growth Engine.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
