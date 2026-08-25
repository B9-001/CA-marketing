import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/lib/types/database";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("display_order", { ascending: true });
  const items = (data as Testimonial[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Testimonials</h1>
          <p className="text-sm text-gray-500">{items.length} testimonial{items.length === 1 ? "" : "s"}</p>
        </div>
        <Link href="/admin/testimonials/new"><Button><Plus className="h-4 w-4" /> New testimonial</Button></Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <p className="text-gray-400">No testimonials yet.</p>}
        {items.map((t) => (
          <Link key={t.id} href={`/admin/testimonials/${t.id}`} className="rounded-lg border border-border bg-white p-5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <Badge variant={t.published ? "default" : "outline"}>{t.published ? "Published" : "Draft"}</Badge>
              {t.rating && (
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3 w-3" fill="currentColor" strokeWidth={0} />)}
                </div>
              )}
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-gray-600">&ldquo;{t.testimonial}&rdquo;</p>
            <p className="mt-3 text-sm font-semibold text-navy">{t.name}</p>
            <p className="text-xs text-gray-400">{[t.position, t.organization].filter(Boolean).join(", ")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
