"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveSiteSetting } from "@/app/admin/(dashboard)/content/actions";
import type { SiteSettings } from "@/lib/settings";

function parseSocialLinks(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [platform, ...rest] = line.split(":");
      return { platform: platform.trim(), url: rest.join(":").trim() };
    })
    .filter((s) => s.platform && s.url);
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      await Promise.all([
        saveSiteSetting("contact_email", form.get("contact_email")),
        saveSiteSetting("contact_phone", form.get("contact_phone")),
        saveSiteSetting("contact_address", form.get("contact_address")),
        saveSiteSetting("whatsapp_number", form.get("whatsapp_number")),
        saveSiteSetting("whatsapp_message", form.get("whatsapp_message")),
        saveSiteSetting("social_links", parseSocialLinks(form.get("social_links") as string)),
      ]);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact_email">Contact email</Label>
          <Input id="contact_email" name="contact_email" type="email" defaultValue={settings.contact_email} />
        </div>
        <div>
          <Label htmlFor="contact_phone">Contact phone</Label>
          <Input id="contact_phone" name="contact_phone" defaultValue={settings.contact_phone} />
        </div>
      </div>
      <div>
        <Label htmlFor="contact_address">Address</Label>
        <Input id="contact_address" name="contact_address" defaultValue={settings.contact_address} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="whatsapp_number">WhatsApp number (with country code, no +)</Label>
          <Input id="whatsapp_number" name="whatsapp_number" placeholder="2348000000000" defaultValue={settings.whatsapp_number} />
        </div>
      </div>
      <div>
        <Label htmlFor="whatsapp_message">WhatsApp pre-filled message</Label>
        <Textarea id="whatsapp_message" name="whatsapp_message" defaultValue={settings.whatsapp_message} />
      </div>
      <div>
        <Label htmlFor="social_links">Social links (one per line: Platform: URL)</Label>
        <Textarea
          id="social_links"
          name="social_links"
          defaultValue={settings.social_links.map((s) => `${s.platform}: ${s.url}`).join("\n")}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save settings
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
