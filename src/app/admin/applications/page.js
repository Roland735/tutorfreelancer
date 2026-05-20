import { Activity, Bot, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
  AdminSectionCard,
  AdminToolbar,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminApplicationsData } from "@/lib/admin-data.server";

export default async function AdminApplicationsPage() {
  const rows = await getAdminApplicationsData();
  const columns = [
    { key: "id", label: "ID" },
    { key: "job", label: "Job" },
    { key: "tutor", label: "Tutor" },
    { key: "student", label: "Student" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <AdminToneBadge tone={row.status === "Accepted" ? "success" : row.status === "Rejected" ? "danger" : "warning"}>
          {row.status}
        </AdminToneBadge>
      ),
    },
    { key: "timestamp", label: "Timestamp" },
    {
      key: "signal",
      label: "Signal",
      render: (row) => (
        <AdminToneBadge tone={row.signal === "Healthy" ? "success" : row.signal === "Keyword hit" ? "danger" : "warning"}>
          {row.signal}
        </AdminToneBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Applications"
        title="Application flow and abnormal activity"
        description="Track job applications, status transitions, timestamps, and spam signals so admins can keep conversion healthy and fraud low."
        actions={
          <>
            <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              <Download className="mr-2 h-4 w-4" />
              Export audit
            </Button>
            <Button className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
              <Activity className="mr-2 h-4 w-4" />
              Review anomalies
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSectionCard title="Application tracker" description="Rows are structured for backend pagination, filtering, and automated risk flags.">
          <div className="space-y-5">
            <AdminToolbar
              searchPlaceholder="Search by job, tutor, student, or application ID..."
              filters={[
                {
                  label: "Status",
                  options: [
                    { value: "all", label: "All statuses" },
                    { value: "pending", label: "Pending" },
                    { value: "accepted", label: "Accepted" },
                    { value: "rejected", label: "Rejected" },
                  ],
                },
                {
                  label: "Signal",
                  options: [
                    { value: "all", label: "All signals" },
                    { value: "healthy", label: "Healthy" },
                    { value: "keyword", label: "Keyword hit" },
                    { value: "lowbid", label: "Low bid" },
                  ],
                },
              ]}
            />
            {rows.length ? (
              <AdminDataTable
                columns={columns}
                rows={rows}
                emptyTitle="No application activity"
                emptyDescription="This queue can show an empty state when no filtered applications match."
              />
            ) : (
              <AdminEmptyState
                compact
                title="No applications yet"
                description="Job application activity will appear here once tutors start applying to posted jobs."
              />
            )}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Spam detection signals" description="Placeholder logic shows where automated heuristics can influence reviews.">
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-amber-200" />
                <p className="font-medium text-white">Burst submissions detected</p>
              </div>
              <p className="mt-2 text-sm text-slate-400">Three tutors applied to 18 jobs in under 11 minutes using nearly identical intros.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
              <p className="font-medium text-white">Risk model hooks</p>
              <p className="mt-2 text-sm text-slate-400">Connect message similarity, link usage, response speed, and linked devices to this panel.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
              <p className="font-medium text-white">Manual review outcome</p>
              <p className="mt-2 text-sm text-slate-400">Admins can later record decisions like warning, restrict, dismiss, or suspend here.</p>
            </div>
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
