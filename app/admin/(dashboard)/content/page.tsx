import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { ContentForm } from "@/components/admin/content-form";

export const metadata: Metadata = { title: "Site Content" };

export default async function AdminContentPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Site content</h1>
        <p className="text-sm text-gray-500">Edit the homepage hero, about content and key statistics without touching code.</p>
      </div>
      <div className="rounded-lg border border-border bg-white p-6">
        <ContentForm settings={settings} />
      </div>
    </div>
  );
}
