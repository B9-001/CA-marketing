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
import { createProject, updateProject, deleteProject, type ProjectInput } from "@/app/admin/(dashboard)/portfolio/actions";
import type { Project } from "@/lib/types/database";

const CATEGORIES = ["Websites", "Marketing", "Branding", "Automation", "Campaigns", "Strategy"];

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState(project?.cover_image || "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    const input: ProjectInput = {
      title: form.get("title") as string,
      slug: form.get("slug") as string,
      client: form.get("client") as string,
      industry: form.get("industry") as string,
      category: form.get("category") as Project["category"],
      description: form.get("description") as string,
      challenge: form.get("challenge") as string,
      solution: form.get("solution") as string,
      results: form.get("results") as string,
      cover_image: coverImage,
      video_url: form.get("video_url") as string,
      external_url: form.get("external_url") as string,
      display_order: Number(form.get("display_order") || 0),
      featured: form.get("featured") === "on",
      published: form.get("published") === "on",
      is_demo: form.get("is_demo") === "on",
    };

    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, input)
        : await createProject(input);
      if (result?.error) setError(result.error);
      else if (project) router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required defaultValue={project?.title} />
        </div>
        <div>
          <Label htmlFor="slug">Slug (auto-generated if blank)</Label>
          <Input id="slug" name="slug" defaultValue={project?.slug} placeholder="my-project" />
        </div>
        <div>
          <Label htmlFor="client">Client</Label>
          <Input id="client" name="client" defaultValue={project?.client ?? ""} />
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" name="industry" defaultValue={project?.industry ?? ""} />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" defaultValue={project?.category ?? "Websites"}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="display_order">Display order</Label>
          <Input id="display_order" name="display_order" type="number" defaultValue={project?.display_order ?? 0} />
        </div>
        <div>
          <Label htmlFor="video_url">Video URL</Label>
          <Input id="video_url" name="video_url" defaultValue={project?.video_url ?? ""} />
        </div>
        <div>
          <Label htmlFor="external_url">External URL</Label>
          <Input id="external_url" name="external_url" defaultValue={project?.external_url ?? ""} />
        </div>
      </div>

      <div>
        <Label>Cover image</Label>
        <div className="flex items-center gap-3">
          <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
          <MediaUploadButton onUploaded={setCoverImage} label="Upload" />
        </div>
        {coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImage} alt="Cover preview" className="mt-3 h-32 w-full max-w-xs rounded-md border border-border object-cover" />
        )}
      </div>

      <div className="grid gap-5">
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={project?.description ?? ""} />
        </div>
        <div>
          <Label htmlFor="challenge">Challenge</Label>
          <Textarea id="challenge" name="challenge" defaultValue={project?.challenge ?? ""} />
        </div>
        <div>
          <Label htmlFor="solution">Solution</Label>
          <Textarea id="solution" name="solution" defaultValue={project?.solution ?? ""} />
        </div>
        <div>
          <Label htmlFor="results">Results</Label>
          <Textarea id="results" name="results" defaultValue={project?.results ?? ""} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} className="h-4 w-4 rounded border-border" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="published" defaultChecked={project?.published} className="h-4 w-4 rounded border-border" />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="is_demo" defaultChecked={project?.is_demo ?? true} className="h-4 w-4 rounded border-border" />
          Mark as demo project
        </label>
      </div>

      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between border-t border-border pt-5">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {project ? "Save changes" : "Create project"}
        </Button>
        {project && (
          <Button
            type="button"
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            onClick={() => {
              if (confirm("Delete this project? This cannot be undone.")) {
                startTransition(() => deleteProject(project.id));
              }
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
      </div>
    </form>
  );
}
