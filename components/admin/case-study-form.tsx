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
import {
  createCaseStudy, updateCaseStudy, deleteCaseStudy, type CaseStudyInput,
} from "@/app/admin/(dashboard)/case-studies/actions";
import { parseMetrics, parseGallery } from "@/lib/case-studies/parse";
import type { CaseStudy, Testimonial } from "@/lib/types/database";

export function CaseStudyForm({
  caseStudy,
  testimonials,
}: {
  caseStudy?: CaseStudy;
  testimonials: Testimonial[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState(caseStudy?.cover_image || "");
  const [gallery, setGallery] = useState((caseStudy?.gallery || []).join("\n"));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    const input: CaseStudyInput = {
      title: form.get("title") as string,
      slug: form.get("slug") as string,
      client: form.get("client") as string,
      industry: form.get("industry") as string,
      challenge: form.get("challenge") as string,
      strategy: form.get("strategy") as string,
      solution: form.get("solution") as string,
      implementation: form.get("implementation") as string,
      results: form.get("results") as string,
      metrics: parseMetrics(form.get("metrics") as string),
      testimonial_id: (form.get("testimonial_id") as string) || null,
      cover_image: coverImage,
      gallery: parseGallery(gallery),
      featured: form.get("featured") === "on",
      published: form.get("published") === "on",
      is_demo: form.get("is_demo") === "on",
    };

    startTransition(async () => {
      const result = caseStudy
        ? await updateCaseStudy(caseStudy.id, input)
        : await createCaseStudy(input);
      if (result?.error) setError(result.error);
      else if (caseStudy) router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><Label htmlFor="title">Title *</Label><Input id="title" name="title" required defaultValue={caseStudy?.title} /></div>
        <div><Label htmlFor="slug">Slug</Label><Input id="slug" name="slug" defaultValue={caseStudy?.slug} /></div>
        <div><Label htmlFor="client">Client</Label><Input id="client" name="client" defaultValue={caseStudy?.client ?? ""} /></div>
        <div><Label htmlFor="industry">Industry</Label><Input id="industry" name="industry" defaultValue={caseStudy?.industry ?? ""} /></div>
        <div>
          <Label htmlFor="testimonial_id">Linked testimonial</Label>
          <Select id="testimonial_id" name="testimonial_id" defaultValue={caseStudy?.testimonial_id ?? ""}>
            <option value="">None</option>
            {testimonials.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.organization}</option>)}
          </Select>
        </div>
      </div>

      <div>
        <Label>Cover image</Label>
        <div className="flex items-center gap-3">
          <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
          <MediaUploadButton onUploaded={setCoverImage} label="Upload" />
        </div>
      </div>

      <div className="grid gap-5">
        <div><Label htmlFor="challenge">Challenge</Label><Textarea id="challenge" name="challenge" defaultValue={caseStudy?.challenge ?? ""} /></div>
        <div><Label htmlFor="strategy">Strategy</Label><Textarea id="strategy" name="strategy" defaultValue={caseStudy?.strategy ?? ""} /></div>
        <div><Label htmlFor="solution">Solution</Label><Textarea id="solution" name="solution" defaultValue={caseStudy?.solution ?? ""} /></div>
        <div><Label htmlFor="implementation">Implementation</Label><Textarea id="implementation" name="implementation" defaultValue={caseStudy?.implementation ?? ""} /></div>
        <div><Label htmlFor="results">Results</Label><Textarea id="results" name="results" defaultValue={caseStudy?.results ?? ""} /></div>
        <div>
          <Label htmlFor="metrics">Metrics (one per line: Label: Value)</Label>
          <Textarea
            id="metrics"
            name="metrics"
            placeholder={"Leads: +150%\nConversion rate: 6.2%"}
            defaultValue={(caseStudy?.metrics || []).map((m) => `${m.label}: ${m.value}`).join("\n")}
          />
        </div>
        <div>
          <Label htmlFor="gallery">Gallery (one image URL per line)</Label>
          <div className="flex items-start gap-3">
            <Textarea id="gallery" name="gallery" value={gallery} onChange={(e) => setGallery(e.target.value)} />
            <MediaUploadButton onUploaded={(url) => setGallery((g) => (g ? `${g}\n${url}` : url))} label="Add" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="featured" defaultChecked={caseStudy?.featured} className="h-4 w-4 rounded border-border" /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="published" defaultChecked={caseStudy?.published} className="h-4 w-4 rounded border-border" /> Published
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="is_demo" defaultChecked={caseStudy?.is_demo ?? true} className="h-4 w-4 rounded border-border" /> Mark as demo project
        </label>
      </div>

      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between border-t border-border pt-5">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {caseStudy ? "Save changes" : "Create case study"}
        </Button>
        {caseStudy && (
          <Button
            type="button"
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            onClick={() => confirm("Delete this case study?") && startTransition(() => deleteCaseStudy(caseStudy.id))}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
      </div>
    </form>
  );
}
