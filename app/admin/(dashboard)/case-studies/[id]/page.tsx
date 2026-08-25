import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CaseStudyForm } from "@/components/admin/case-study-form";
import type { CaseStudy, Testimonial } from "@/lib/types/database";

export const metadata: Metadata = { title: "Edit Case Study" };

export default async function EditCaseStudyPage(props: PageProps<"/admin/case-studies/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const [{ data }, { data: testimonials }] = await Promise.all([
    supabase.from("case_studies").select("*").eq("id", id).maybeSingle(),
    supabase.from("testimonials").select("*").order("name"),
  ]);
  if (!data) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Edit case study</h1>
      <div className="rounded-lg border border-border bg-white p-6">
        <CaseStudyForm caseStudy={data as CaseStudy} testimonials={(testimonials as Testimonial[]) ?? []} />
      </div>
    </div>
  );
}
