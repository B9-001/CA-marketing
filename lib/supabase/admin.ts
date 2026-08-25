import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * Service-role Supabase client. Bypasses RLS entirely.
 *
 * SECURITY: `server-only` guarantees this file (and therefore
 * SUPABASE_SERVICE_ROLE_KEY) can never be bundled into client JavaScript.
 * Only import this from Route Handlers, Server Actions, or webhook code
 * that has already verified the caller (e.g. admin session, webhook secret).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase service role client requested but SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL is not configured."
    );
  }

  return createSupabaseClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
