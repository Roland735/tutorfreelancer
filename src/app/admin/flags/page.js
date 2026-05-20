import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminActionDialog from "@/components/admin/AdminActionDialog";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
  AdminSectionCard,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminFlagsData } from "@/lib/admin-data.server";

export default async function AdminFlagsPage() {
  const rows = await getAdminFlagsData();
  const columns = [
    { key: "id", label: "Flag ID" },
    { key: "subject", label: "Subject" },
    { key: "type", label: "Type" },
    {
      key: "severity",
      label: "Severity",
      render: (row) => (
        <AdminToneBadge tone={row.severity === "Critical" ? "danger" : row.severity === "High" ? "warning" : "sky"}>
          {row.severity}
        </AdminToneBadge>
      ),
    },
    { key: "reason", label: "Reason" },
    { key: "createdAt", label: "Created" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <AdminToneBadge tone={row.status === "Escalated" ? "danger" : row.status === "Review" ? "warning" : "neutral"}>
          {row.status}
        </AdminToneBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Trust and safety"
        title="Reported users and content queue"
        description="Prioritize fraud, abuse, spam, fake tutors, fake jobs, and severe reports using a queue that surfaces urgency clearly."
        actions={
          <>
            <AdminActionDialog
              buttonLabel="Escalation modal"
              title="Escalate a severe trust and safety report"
              description="This modal is ready for severity-based routing, internal notes, and assignment to the appropriate review team."
              confirmLabel="Escalate case"
              tone="danger"
            />
            <Button className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Resolve selected
            </Button>
          </>
        }
      />

      <AdminSectionCard title="Abuse queue" description="This queue is structured for severity sorting, report reasons, timestamps, and outcomes.">
        <AdminDataTable
          columns={columns}
          rows={rows}
          emptyTitle="No abuse reports"
          emptyDescription="A well-designed moderation queue should feel intentional even when no issues are open."
        />
      </AdminSectionCard>

      <AdminSectionCard title="Priority workflow" description="Escalations should feel serious, fast, and carefully contained.">
        {rows.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
              <AlertTriangle className="h-5 w-5 text-rose-200" />
              <p className="mt-4 font-medium text-white">Critical first</p>
              <p className="mt-2 text-sm text-slate-400">Live flags now derive from disputed sessions, payment failures, risky messages, and review signals.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
              <ShieldAlert className="h-5 w-5 text-amber-200" />
              <p className="mt-4 font-medium text-white">Reason-aware actions</p>
              <p className="mt-2 text-sm text-slate-400">Admins can act on real reason codes surfaced directly from database-backed signals.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
              <AlertTriangle className="h-5 w-5 text-sky-200" />
              <p className="mt-4 font-medium text-white">Audit ready</p>
              <p className="mt-2 text-sm text-slate-400">Every flag row now comes from a real collection and a timestamped event path.</p>
            </div>
          </div>
        ) : (
          <AdminEmptyState
            compact
            title="No active trust and safety flags"
            description="Derived abuse and risk signals will appear here when platform activity creates them."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
