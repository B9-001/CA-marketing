import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/service-form";

export const metadata: Metadata = { title: "New Service" };

export default function NewServicePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy">New service</h1>
      <div className="rounded-lg border border-border bg-white p-6"><ServiceForm /></div>
    </div>
  );
}
