import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Settings</h1>
        <p className="text-sm text-gray-500">Contact details, WhatsApp number and social links used across the public site.</p>
      </div>
      <div className="rounded-lg border border-border bg-white p-6">
        <SettingsForm settings={settings} />
      </div>

      <div className="rounded-lg border border-border bg-white p-6">
        <h2 className="font-semibold text-navy">Admin accounts</h2>
        <p className="mt-2 text-sm text-gray-600">
          Admin accounts are managed in Supabase directly for security: create the user under
          Authentication → Users, then add a matching row to the <code className="rounded bg-gray-100 px-1">admins</code> table
          with the same <code className="rounded bg-gray-100 px-1">id</code>. See the README for exact steps.
        </p>
      </div>
    </div>
  );
}
