import { notFound } from "next/navigation";
import { FileText, Flag, Pencil, ShieldBan } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminMutationButton from "@/components/admin/AdminMutationButton";
import {
  AdminBreadcrumbCard,
  AdminEmptyState,
  AdminKeyValueGrid,
  AdminPageHeader,
  AdminSectionCard,
  AdminTimeline,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminJobDetailData } from "@/lib/admin-data.server";

export default async function AdminJobDetailPage({ params }) {
  const { id } = await params;
  const data = await getAdminJobDetailData(id);

  if (!data) {
    notFound();
  }

  const { job, details, moderationNotes, attachments, applicants, messages, auditTrail } = data;

  return (
    <div className="space-y-6">
      <AdminBreadcrumbCard
        items={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Jobs", href: "/admin/jobs" },
          { label: job.title },
        ]}
      />

      <AdminPageHeader
        eyebrow="Job detail"
        title={job.title}
        description="Inspect the full moderation context, including content quality, attachments, applicants, message signals, and prior admin activity."
        actions={
          <>
            <AdminMutationButton
              entity="job"
              action="edit"
              id={job.id}
              payload={{ title: `${job.title}` }}
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Save listing
            </AdminMutationButton>
            <AdminMutationButton
              entity="job"
              action="flag"
              id={job.id}
              payload={{ note: "Flagged by admin from detail view" }}
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            >
              <Flag className="mr-2 h-4 w-4" />
              Flag job
            </AdminMutationButton>
            <AdminMutationButton
              entity="job"
              action={job.status === "Hidden" ? "approve" : "hide"}
              id={job.id}
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            >
              {job.status === "Hidden" ? "Approve listing" : "Hide listing"}
            </AdminMutationButton>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminSectionCard title="Listing record" description="A structured detail view keeps moderation decisions easy to justify and revisit.">
          <AdminKeyValueGrid items={details} />
        </AdminSectionCard>

        <AdminSectionCard title="Moderation notes" description="These notes can later map to secure, saved moderator comments.">
          {moderationNotes.length ? (
            <div className="space-y-3">
              {moderationNotes.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">
                  {item}
                </div>
              ))}
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <ShieldBan className="h-5 w-5 text-amber-200" />
                  <p className="font-medium text-white">Live moderation notes are derived from real job signals</p>
                </div>
                <p className="mt-2 text-sm text-slate-400">Urgency, keywords, applicants, and linked sessions currently inform this panel.</p>
              </div>
            </div>
          ) : (
            <AdminEmptyState
              compact
              title="No moderation notes"
              description="This job does not currently trigger any derived moderation notes."
            />
          )}
        </AdminSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminSectionCard title="Attachments" description="Preview file sets and handoff metadata.">
          {attachments.length ? (
            <div className="space-y-3">
              {attachments.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
                  <FileText className="h-4 w-4 text-sky-200" />
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState
              compact
              title="No attachments schema data"
              description="The current job model does not store attachments, so this section stays empty until that field is added."
            />
          )}
        </AdminSectionCard>

        <AdminSectionCard title="Applicants" description="Review who engaged with the listing before taking action.">
          {applicants.length ? (
            <div className="space-y-3">
              {applicants.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState
              compact
              title="No applicants yet"
              description="No tutor has applied to this job so far."
            />
          )}
        </AdminSectionCard>

        <AdminSectionCard title="Message snapshot" description="Only key dispute or moderation context should surface here.">
          {messages.length ? (
            <div className="space-y-3">
              {messages.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState
              compact
              title="No related messages"
              description="No recent message threads were found between the poster and the current applicants."
            />
          )}
        </AdminSectionCard>
      </div>

      <AdminSectionCard
        title="Audit log"
        description="Use a durable log to track who approved, hid, flagged, or edited the job."
        action={<AdminToneBadge tone={job.flagged ? "warning" : "success"}>{job.flagged ? "Flagged" : "Clean"}</AdminToneBadge>}
      >
        <AdminTimeline items={auditTrail} />
      </AdminSectionCard>
    </div>
  );
}
