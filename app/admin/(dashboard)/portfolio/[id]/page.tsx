import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/project-form";
import type { Project } from "@/lib/types/database";

export const metadata: Metadata = { title: "Edit Project" };

export default async function EditProjectPage(props: PageProps<"/admin/portfolio/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Edit project</h1>
      <div className="rounded-lg border border-border bg-white p-6">
        <ProjectForm project={data as Project} />
      </div>
    </div>
  );
}
