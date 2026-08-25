import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CaseStudyForm } from "@/components/admin/case-study-form";
import type { Testimonial } from "@/lib/types/database";

export const metadata: Metadata = { title: "New Case Study" };

export default async function NewCaseStudyPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("name");

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy">New case study</h1>
      <div className="rounded-lg border border-border bg-white p-6">
        <CaseStudyForm testimonials={(data as Testimonial[]) ?? []} />
      </div>
    </div>
  );
}
