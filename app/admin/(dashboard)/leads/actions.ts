"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import type { LeadStage } from "@/lib/types/database";

export async function updateLeadStage(leadId: string, stage: LeadStage) {
  const { userId } = await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from("leads")
    .update({ stage, last_contact_at: new Date().toISOString() })
    .eq("id", leadId);
  await supabase.from("lead_notes").insert({
    lead_id: leadId,
    admin_id: userId,
    note: `Stage changed to ${stage}.`,
  });
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
}

export async function updateLeadFields(
  leadId: string,
  fields: { pipeline_value?: number | null; next_follow_up_at?: string | null }
) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("leads").update(fields).eq("id", leadId);
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function addLeadNote(leadId: string, note: string) {
  if (!note.trim()) return;
  const { userId } = await requireAdmin();
  const supabase = await createClient();
  await supabase.from("lead_notes").insert({ lead_id: leadId, admin_id: userId, note: note.trim() });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function addLeadTask(leadId: string, title: string, dueDate: string | null) {
  if (!title.trim()) return;
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("lead_tasks").insert({
    lead_id: leadId,
    title: title.trim(),
    due_date: dueDate || null,
    status: "pending",
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateLeadTaskStatus(
  taskId: string,
  leadId: string,
  status: "pending" | "completed" | "cancelled"
) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("lead_tasks").update({ status }).eq("id", taskId);
  revalidatePath(`/admin/leads/${leadId}`);
}
