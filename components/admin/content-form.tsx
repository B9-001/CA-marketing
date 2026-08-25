"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveSiteSetting } from "@/app/admin/(dashboard)/content/actions";
import type { SiteSettings } from "@/lib/settings";

function parseStats(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return { label: label.trim(), value: rest.join(":").trim() };
    })
    .filter((s) => s.label && s.value);
}

export function ContentForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      await Promise.all([
        saveSiteSetting("hero_headline", form.get("hero_headline")),
        saveSiteSetting("hero_description", form.get("hero_description")),
        saveSiteSetting("hero_cta_primary", form.get("hero_cta_primary")),
        saveSiteSetting("hero_cta_secondary", form.get("hero_cta_secondary")),
        saveSiteSetting("about_content", form.get("about_content")),
        saveSiteSetting("statistics", parseStats(form.get("statistics") as string)),
      ]);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="hero_headline">Hero headline</Label>
        <Input id="hero_headline" name="hero_headline" defaultValue={settings.hero_headline} />
      </div>
      <div>
        <Label htmlFor="hero_description">Hero description</Label>
        <Textarea id="hero_description" name="hero_description" defaultValue={settings.hero_description} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="hero_cta_primary">Primary CTA label</Label>
          <Input id="hero_cta_primary" name="hero_cta_primary" defaultValue={settings.hero_cta_primary} />
        </div>
        <div>
          <Label htmlFor="hero_cta_secondary">Secondary CTA label</Label>
          <Input id="hero_cta_secondary" name="hero_cta_secondary" defaultValue={settings.hero_cta_secondary} />
        </div>
      </div>
      <div>
        <Label htmlFor="about_content">About content</Label>
        <Textarea id="about_content" name="about_content" className="min-h-32" defaultValue={settings.about_content} />
      </div>
      <div>
        <Label htmlFor="statistics">Statistics (one per line: Label: Value)</Label>
        <Textarea
          id="statistics"
          name="statistics"
          defaultValue={settings.statistics.map((s) => `${s.label}: ${s.value}`).join("\n")}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save content
        </Button>
        {saved && !isPending && (
          <span className="flex items-center gap-1.5 text-sm text-accent-600">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
