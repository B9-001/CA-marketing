import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = { title: "New Project" };

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy">New project</h1>
      <div className="rounded-lg border border-border bg-white p-6">
        <ProjectForm />
      </div>
    </div>
  );
}
