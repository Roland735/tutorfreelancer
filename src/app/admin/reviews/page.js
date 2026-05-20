import { EyeOff, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminMutationButton from "@/components/admin/AdminMutationButton";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
  AdminSectionCard,
  AdminSparkBars,
  AdminToolbar,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminReviewsData } from "@/lib/admin-data.server";

export default async function AdminReviewsPage() {
  const { rows, reputationTrend } = await getAdminReviewsData();
  const columns = [
    { key: "id", label: "Review ID" },
    { key: "tutor", label: "Tutor" },
    { key: "student", label: "Student" },
    { key: "rating", label: "Rating" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <AdminToneBadge tone={row.status === "Approved" ? "success" : row.status === "Hidden" ? "danger" : "warning"}>
          {row.status}
        </AdminToneBadge>
      ),
    },
    {
      key: "signal",
      label: "Signal",
      render: (row) => (
        <AdminToneBadge tone={row.signal === "Healthy" ? "success" : row.signal === "Abuse claim" ? "warning" : "danger"}>
          {row.signal}
        </AdminToneBadge>
      ),
    },
    { key: "excerpt", label: "Excerpt" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <AdminMutationButton
            entity="review"
            action="approve"
            id={row.id}
            variant="ghost"
            className="h-9 rounded-full text-slate-200 hover:bg-white/[0.04]"
          >
            Approve
          </AdminMutationButton>
          <AdminMutationButton
            entity="review"
            action="hide"
            id={row.id}
            payload={{ reason: "Hidden by review moderation queue" }}
            variant="outline"
            className="h-9 rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
          >
            Hide
          </AdminMutationButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Reviews"
        title="Reputation moderation and review quality"
        description="Protect trust in the marketplace by screening abusive, fake, or manipulative reviews while preserving useful public feedback."
        actions={
          <>
            <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              <EyeOff className="mr-2 h-4 w-4" />
              Hide selected
            </Button>
            <Button className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Approve healthy reviews
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSectionCard title="Review moderation list" description="This table is ready for backend moderation states, reason codes, and reviewer attribution.">
          <div className="space-y-5">
            <AdminToolbar
              searchPlaceholder="Search by tutor, student, or review content..."
              filters={[
                {
                  label: "Signal",
                  options: [
                    { value: "all", label: "All signals" },
                    { value: "abuse", label: "Abuse claim" },
                    { value: "low", label: "Low rating" },
                    { value: "fake", label: "Fake review" },
                  ],
                },
              ]}
            />
            {rows.length ? (
              <AdminDataTable
                columns={columns}
                rows={rows}
                emptyTitle="No reviews need action"
                emptyDescription="A quiet review queue should still show a polished empty state."
              />
            ) : (
              <AdminEmptyState
                compact
                title="No reviews yet"
                description="Review moderation data will populate here once completed sessions receive ratings."
              />
            )}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Reputation trend" description="Use trend components to monitor score health over time.">
          <AdminSparkBars items={reputationTrend} />
          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-200" />
              <p className="font-medium text-white">Platform reputation remains strong</p>
            </div>
            <p className="mt-2 text-sm text-slate-400">Verified tutors and fast dispute handling keep trust stable even as review volume increases.</p>
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
