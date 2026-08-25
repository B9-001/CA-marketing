import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import type { Testimonial } from "@/lib/types/database";

export const metadata: Metadata = { title: "Edit Testimonial" };

export default async function EditTestimonialPage(props: PageProps<"/admin/testimonials/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Edit testimonial</h1>
      <div className="rounded-lg border border-border bg-white p-6"><TestimonialForm testimonial={data as Testimonial} /></div>
    </div>
  );
}
