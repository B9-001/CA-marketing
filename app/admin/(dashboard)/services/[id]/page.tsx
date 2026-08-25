import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ServiceForm } from "@/components/admin/service-form";
import type { Service } from "@/lib/types/database";

export const metadata: Metadata = { title: "Edit Service" };

export default async function EditServicePage(props: PageProps<"/admin/services/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Edit service</h1>
      <div className="rounded-lg border border-border bg-white p-6"><ServiceForm service={data as Service} /></div>
    </div>
  );
}
