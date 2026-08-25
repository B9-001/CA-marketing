import type { Metadata } from "next";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export const metadata: Metadata = { title: "New Testimonial" };

export default function NewTestimonialPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy">New testimonial</h1>
      <div className="rounded-lg border border-border bg-white p-6"><TestimonialForm /></div>
    </div>
  );
}
