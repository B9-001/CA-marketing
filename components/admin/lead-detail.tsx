"use client";

import { useState, useTransition } from "react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  updateLeadStage, updateLeadFields, addLeadNote, addLeadTask, updateLeadTaskStatus,
} from "@/app/admin/(dashboard)/leads/actions";
import type { Lead, LeadNote, LeadTask, LeadStage } from "@/lib/types/database";

const STAGES: LeadStage[] = [
  "NEW", "CONTACTED", "QUALIFIED", "DISCOVERY", "AUDIT", "PROPOSAL",
  "NEGOTIATION", "WON", "LOST", "ONBOARDING", "ACTIVE_CLIENT",
];

export function LeadDetail({
  lead,
  notes,
  tasks,
}: {
  lead: Lead;
  notes: LeadNote[];
  tasks: LeadTask[];
}) {
  const [isPending, startTransition] = useTransition();
  const [stage, setStage] = useState(lead.stage);
  const [pipelineValue, setPipelineValue] = useState(lead.pipeline_value?.toString() ?? "");
  const [noteText, setNoteText] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-navy">{lead.full_name}</h1>
              <p className="text-sm text-gray-500">{lead.lead_number} · {formatDate(lead.created_at)}</p>
            </div>
            <Badge>{lead.lead_score}/100 · {lead.lead_temperature}</Badge>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <Field label="Email" value={lead.email} />
            <Field label="Phone" value={lead.phone} />
            <Field label="Business" value={lead.business_name} />
            <Field label="Website" value={lead.website} />
            <Field label="Industry" value={lead.industry} />
            <Field label="Business size" value={lead.business_size} />
            <Field label="Service needed" value={lead.service_needed} />
            <Field label="Budget" value={lead.budget} />
            <Field label="Source" value={lead.source} />
          </dl>

          {(lead.main_challenge || lead.desired_outcome || lead.message) && (
            <div className="mt-6 space-y-3 border-t border-border pt-4 text-sm">
              {lead.main_challenge && <p><span className="font-medium text-navy">Main challenge:</span> {lead.main_challenge}</p>}
              {lead.desired_outcome && <p><span className="font-medium text-navy">Desired outcome:</span> {lead.desired_outcome}</p>}
              {lead.message && <p><span className="font-medium text-navy">Message:</span> {lead.message}</p>}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="font-semibold text-navy">Notes</h2>
          <div className="mt-3 space-y-3">
            {notes.length === 0 && <p className="text-sm text-gray-400">No notes yet.</p>}
            {notes.map((n) => (
              <div key={n.id} className="rounded-md bg-gray-50 p-3 text-sm">
                <p className="text-gray-700">{n.note}</p>
                <p className="mt-1 text-xs text-gray-400">{formatDate(n.created_at)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Add a note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <Button
              disabled={isPending || !noteText.trim()}
              onClick={() =>
                startTransition(async () => {
                  await addLeadNote(lead.id, noteText);
                  setNoteText("");
                })
              }
            >
              Add
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="font-semibold text-navy">Follow-up tasks</h2>
          <div className="mt-3 space-y-2">
            {tasks.length === 0 && <p className="text-sm text-gray-400">No tasks yet.</p>}
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 rounded-md bg-gray-50 p-3 text-sm">
                <div>
                  <p className={t.status === "completed" ? "text-gray-400 line-through" : "text-gray-700"}>{t.title}</p>
                  {t.due_date && <p className="text-xs text-gray-400">Due {formatDate(t.due_date)}</p>}
                </div>
                <Select
                  className="h-8 w-32 text-xs"
                  value={t.status}
                  onChange={(e) =>
                    startTransition(() =>
                      updateLeadTaskStatus(
                        t.id,
                        lead.id,
                        e.target.value as "pending" | "completed" | "cancelled"
                      )
                    )
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Input
              placeholder="New task..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="flex-1"
            />
            <Input
              type="date"
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
              className="w-40"
            />
            <Button
              disabled={isPending || !taskTitle.trim()}
              onClick={() =>
                startTransition(async () => {
                  await addLeadTask(lead.id, taskTitle, taskDue || null);
                  setTaskTitle("");
                  setTaskDue("");
                })
              }
            >
              Add task
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="font-semibold text-navy">Pipeline</h2>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-gray-500">Stage</label>
            <Select
              value={stage}
              onChange={(e) => {
                const newStage = e.target.value as LeadStage;
                setStage(newStage);
                startTransition(() => updateLeadStage(lead.id, newStage));
              }}
            >
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-gray-500">Pipeline value (₦)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={pipelineValue}
                onChange={(e) => setPipelineValue(e.target.value)}
              />
              <Button
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  startTransition(() =>
                    updateLeadFields(lead.id, {
                      pipeline_value: pipelineValue ? Number(pipelineValue) : null,
                    })
                  )
                }
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className="mt-0.5 text-gray-700">{value || "—"}</dd>
    </div>
  );
}
