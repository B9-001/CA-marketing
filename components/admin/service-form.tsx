"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createService, updateService, deleteService, type ServiceInput } from "@/app/admin/(dashboard)/services/actions";
import type { Service } from "@/lib/types/database";

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    const input: ServiceInput = {
      title: form.get("title") as string,
      slug: form.get("slug") as string,
      summary: form.get("summary") as string,
      description: form.get("description") as string,
      icon: form.get("icon") as string,
      features: (form.get("features") as string).split("\n").map((f) => f.trim()).filter(Boolean),
      display_order: Number(form.get("display_order") || 0),
      published: form.get("published") === "on",
    };

    startTransition(async () => {
      const result = service ? await updateService(service.id, input) : await createService(input);
      if (result?.error) setError(result.error);
      else if (service) router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><Label htmlFor="title">Title *</Label><Input id="title" name="title" required defaultValue={service?.title} /></div>
        <div><Label htmlFor="slug">Slug</Label><Input id="slug" name="slug" defaultValue={service?.slug} /></div>
        <div>
          <Label htmlFor="icon">Icon (Lucide icon name)</Label>
          <Input id="icon" name="icon" placeholder="Megaphone" defaultValue={service?.icon ?? ""} />
          <p className="mt-1 text-xs text-gray-400">
            Any name from lucide.dev/icons in PascalCase, e.g. Megaphone, Globe, Users, Bot, Palette, Briefcase.
          </p>
        </div>
        <div><Label htmlFor="display_order">Display order</Label><Input id="display_order" name="display_order" type="number" defaultValue={service?.display_order ?? 0} /></div>
      </div>

      <div><Label htmlFor="summary">Summary (short, shown on home page)</Label><Textarea id="summary" name="summary" defaultValue={service?.summary ?? ""} /></div>
      <div><Label htmlFor="description">Full description</Label><Textarea id="description" name="description" defaultValue={service?.description ?? ""} /></div>
      <div>
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea id="features" name="features" defaultValue={(service?.features || []).join("\n")} />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" name="published" defaultChecked={service?.published ?? true} className="h-4 w-4 rounded border-border" /> Published
      </label>

      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between border-t border-border pt-5">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {service ? "Save changes" : "Create service"}
        </Button>
        {service && (
          <Button
            type="button"
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            onClick={() => confirm("Delete this service?") && startTransition(() => deleteService(service.id))}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
      </div>
    </form>
  );
}
