import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Admin } from "@/lib/types/database";

/**
 * Server-only guard for admin pages/actions. Confirms there's an
 * authenticated Supabase session AND that the user is a row in `admins`
 * (role membership), then returns both the session user and admin record.
 * Redirects to /admin/login otherwise.
 */
export async function requireAdmin(): Promise<{ userId: string; email: string; admin: Admin }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not_authorized");
  }

  return { userId: user.id, email: user.email ?? "", admin: admin as Admin };
}
