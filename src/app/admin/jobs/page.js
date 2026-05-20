import Link from "next/link";
import { Eye, Filter, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminMutationButton from "@/components/admin/AdminMutationButton";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
  AdminSectionCard,
  AdminToolbar,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminJobsData } from "@/lib/admin-data.server";

export default async function AdminJobsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const rows = await getAdminJobsData(resolvedSearchParams || {});
  const columns = [
    {
      key: "title",
      label: "Job",
      render: (row) => (
        <div>
          <Link href={`/admin/jobs/${row.id}`} className="font-medium text-white transition hover:text-emerald-200">
            {row.title}
          </Link>
          <p className="mt-1 text-xs text-slate-400">{row.subject}</p>
        </div>
      ),
    },
    { key: "budget", label: "Budget" },
    { key: "university", label: "University" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <AdminToneBadge tone={row.status === "Cancelled" ? "danger" : row.status === "Open" ? "success" : "warning"}>
          {row.status}
        </AdminToneBadge>
      ),
    },
    {
      key: "health",
      label: "Health",
      render: (row) => (
        <AdminToneBadge tone={row.health === "Keyword risk" ? "danger" : row.health === "Priority" || row.health === "Expired" ? "warning" : "sky"}>
          {row.health}
        </AdminToneBadge>
      ),
    },
    { key: "date", label: "Date" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="ghost" className="h-9 rounded-full text-slate-200 hover:bg-white/[0.04]">
            <Link href={`/admin/jobs/${row.id}`}>Inspect</Link>
          </Button>
          <AdminMutationButton
            entity="job"
            action={row.status === "Hidden" ? "approve" : "hide"}
            id={row.id}
            variant="outline"
            className="h-9 rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
          >
            {row.status === "Hidden" ? "Show" : "Hide"}
          </AdminMutationButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Jobs"
        title="Marketplace listings and moderation signals"
        description="Review subject demand, listing quality, suspicious patterns, and university context before approving or suppressing jobs."
        actions={
          <>
            <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              <Filter className="mr-2 h-4 w-4" />
              Save filter set
            </Button>
            <Button className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Open suspicious posts
            </Button>
          </>
        }
      />

      <AdminSectionCard
        title="Job queue"
        description="Use filters to narrow by subject, budget, status, university, and date as backend search becomes available."
      >
        <div className="space-y-5">
          <AdminToolbar
            searchPlaceholder="Search by title, owner, subject, or campus..."
            searchValue={resolvedSearchParams?.q || ""}
            filters={[
              {
                label: "Subject",
                name: "subject",
                value: resolvedSearchParams?.subject || "all",
                options: [
                  { value: "all", label: "All subjects" },
                  { value: "math", label: "Mathematics" },
                  { value: "cs", label: "Computer Science" },
                  { value: "finance", label: "Finance" },
                ],
              },
              {
                label: "Status",
                name: "status",
                value: resolvedSearchParams?.status || "all",
                options: [
                  { value: "all", label: "All statuses" },
                  { value: "open", label: "Open" },
                  { value: "review", label: "Under review" },
                  { value: "hidden", label: "Hidden" },
                ],
              },
              {
                label: "University",
                name: "university",
                value: resolvedSearchParams?.university || "all",
                options: [
                  { value: "all", label: "All universities" },
                  { value: "nust", label: "NUST" },
                  { value: "uz", label: "University of Zimbabwe" },
                  { value: "msu", label: "MSU" },
                ],
              },
            ]}
            actions={<AdminToneBadge tone="sky">{rows.length} matching jobs</AdminToneBadge>}
          />
          {rows.length ? (
            <AdminDataTable
              columns={columns}
              rows={rows}
              emptyTitle="No jobs found"
              emptyDescription="An empty jobs queue can surface after strong filters or when campus demand is temporarily quiet."
            />
          ) : (
            <AdminEmptyState
              compact
              title="No jobs found"
              description="Job records will appear here once real tutoring requests are stored in MongoDB."
            />
          )}
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Queue summary" description="A quick risk snapshot helps moderators scan volume and urgency.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
            <Eye className="h-5 w-5 text-sky-200" />
            <p className="mt-4 font-medium text-white">18 active reviews</p>
            <p className="mt-2 text-sm text-slate-400">Posts with edits, link checks, or content duplication signals.</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
            <ShieldAlert className="h-5 w-5 text-amber-200" />
            <p className="mt-4 font-medium text-white">5 high-risk listings</p>
            <p className="mt-2 text-sm text-slate-400">These require a human decision before they become discoverable again.</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
            <Filter className="h-5 w-5 text-emerald-200" />
            <p className="mt-4 font-medium text-white">Healthy demand mix</p>
            <p className="mt-2 text-sm text-slate-400">Maths, programming, and finance continue to lead weekly tutoring demand.</p>
          </div>
        </div>
      </AdminSectionCard>
    </div>
  );
}
