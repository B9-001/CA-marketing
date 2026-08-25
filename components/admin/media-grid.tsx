"use client";

import { useMemo, useState } from "react";
import { Copy, Trash2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MediaUploadButton } from "@/components/admin/media-upload-button";
import type { Media } from "@/lib/types/database";

export function MediaGrid({ initialMedia }: { initialMedia: Media[] }) {
  const [items, setItems] = useState(initialMedia);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => items.filter((m) => m.file_name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  async function handleDelete(id: string) {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((m) => m.id !== id));
  }

  function handleCopy(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <MediaUploadButton
          onUploaded={(url) => {
            // Prepend an optimistic entry; page revalidation will replace it with real data on next load.
            setItems((prev) => [
              {
                id: `temp-${Date.now()}`,
                file_name: url.split("/").pop() ?? "file",
                file_url: url,
                file_type: "image",
                file_size: 0,
                uploaded_by: null,
                created_at: new Date().toISOString(),
              },
              ...prev,
            ]);
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">No media files yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-lg border border-border bg-white">
              <div className="aspect-square bg-gray-100">
                {m.file_type.startsWith("image") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.file_url} alt={m.file_name} className="h-full w-full object-cover" />
                ) : (
                  <video src={m.file_url} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs text-gray-600">{m.file_name}</p>
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() => handleCopy(m.file_url, m.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    {copiedId === m.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedId === m.id ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="rounded-md border border-border p-1.5 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
