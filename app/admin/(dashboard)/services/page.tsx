import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/types/database";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").order("display_order", { ascending: true });
  const services = (data as Service[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Services</h1>
          <p className="text-sm text-gray-500">{services.length} service{services.length === 1 ? "" : "s"}</p>
        </div>
        <Link href="/admin/services/new"><Button><Plus className="h-4 w-4" /> New service</Button></Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-gray-400">No services yet.</td></tr>
            )}
            {services.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3"><Link href={`/admin/services/${s.id}`} className="font-medium text-navy hover:underline">{s.title}</Link></td>
                <td className="px-4 py-3 text-gray-500">{s.display_order}</td>
                <td className="px-4 py-3"><Badge variant={s.published ? "default" : "outline"}>{s.published ? "Published" : "Draft"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
