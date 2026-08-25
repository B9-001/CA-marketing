"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaUploadButton } from "@/components/admin/media-upload-button";
import { createTestimonial, updateTestimonial, deleteTestimonial, type TestimonialInput } from "@/app/admin/(dashboard)/testimonials/actions";
import type { Testimonial } from "@/lib/types/database";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState(testimonial?.photo_url || "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    const input: TestimonialInput = {
      name: form.get("name") as string,
      position: form.get("position") as string,
      organization: form.get("organization") as string,
      photo_url: photoUrl,
      testimonial: form.get("testimonial") as string,
      rating: Number(form.get("rating") || 5),
      display_order: Number(form.get("display_order") || 0),
      published: form.get("published") === "on",
    };

    startTransition(async () => {
      const result = testimonial
        ? await updateTestimonial(testimonial.id, input)
        : await createTestimonial(input);
      if (result?.error) setError(result.error);
      else if (testimonial) router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><Label htmlFor="name">Name *</Label><Input id="name" name="name" required defaultValue={testimonial?.name} /></div>
        <div><Label htmlFor="position">Position</Label><Input id="position" name="position" defaultValue={testimonial?.position ?? ""} /></div>
        <div><Label htmlFor="organization">Organization</Label><Input id="organization" name="organization" defaultValue={testimonial?.organization ?? ""} /></div>
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Select id="rating" name="rating" defaultValue={String(testimonial?.rating ?? 5)}>
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
          </Select>
        </div>
        <div><Label htmlFor="display_order">Display order</Label><Input id="display_order" name="display_order" type="number" defaultValue={testimonial?.display_order ?? 0} /></div>
      </div>

      <div>
        <Label>Photo</Label>
        <div className="flex items-center gap-3">
          <Input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." />
          <MediaUploadButton onUploaded={setPhotoUrl} label="Upload" />
        </div>
      </div>

      <div><Label htmlFor="testimonial">Testimonial *</Label><Textarea id="testimonial" name="testimonial" required defaultValue={testimonial?.testimonial} /></div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" name="published" defaultChecked={testimonial?.published} className="h-4 w-4 rounded border-border" /> Published
      </label>

      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between border-t border-border pt-5">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {testimonial ? "Save changes" : "Create testimonial"}
        </Button>
        {testimonial && (
          <Button
            type="button"
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            onClick={() => confirm("Delete this testimonial?") && startTransition(() => deleteTestimonial(testimonial.id))}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
      </div>
    </form>
  );
}
