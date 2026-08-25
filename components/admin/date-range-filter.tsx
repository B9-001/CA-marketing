"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const OPTIONS: { key: string; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
];

export function DateRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("range") || "30d";

  function setRange(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="inline-flex rounded-md border border-border bg-white p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => setRange(opt.key)}
          className={cn(
            "rounded px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors",
            current === opt.key && "bg-navy text-white"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
