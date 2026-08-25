"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/leads", label: "Leads / CRM" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/case-studies", label: "Case Studies" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/blog", label: "Insights / Blog" },
  { href: "/admin/media", label: "Media Library" },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="border-b border-border bg-navy text-white lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <span className="text-sm font-semibold">CA Marketing Admin</span>
        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="space-y-0.5 border-t border-white/10 p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                pathname === item.href ? "bg-white/10 text-white" : "text-gray-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-gray-300"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </nav>
      )}
    </div>
  );
}
