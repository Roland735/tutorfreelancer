import { CheckCircle2, ShieldAlert, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminMutationButton from "@/components/admin/AdminMutationButton";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminSectionCard,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminTutorsData } from "@/lib/admin-data.server";

export default async function AdminTutorsPage() {
  const { queue, topTutors, riskyTutors } = await getAdminTutorsData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Tutors"
        title="Verification and approval queue"
        description="Review tutor qualifications, proof of study, ratings, and risk signals with a focused, high-trust workflow."
        actions={
          <>
            <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              Request changes
            </Button>
            <Button className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
              Approve selected
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminSectionCard title="Tutor verification queue" description="These review cards are built for documents, proof, ratings, and final approval states.">
          {queue.length ? (
            <div className="space-y-4">
              {queue.map((tutor) => (
                <div key={tutor.id} className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{tutor.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{tutor.university}</p>
                    </div>
                    <AdminToneBadge tone={tutor.risk === "High" ? "danger" : tutor.risk === "Medium" ? "warning" : "success"}>
                      {tutor.risk} risk
                    </AdminToneBadge>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Subjects</p>
                      <p className="mt-2 text-sm text-slate-300">{tutor.subjects}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Proof</p>
                      <p className="mt-2 text-sm text-slate-300">{tutor.proof}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rating</p>
                      <p className="mt-2 text-sm text-slate-300">{tutor.rating}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <AdminMutationButton
                      entity="tutor"
                      action="approve"
                      id={tutor.id}
                      variant="default"
                      className="rounded-full bg-white text-slate-950 hover:bg-emerald-300"
                    >
                      Approve
                    </AdminMutationButton>
                    <AdminMutationButton
                      entity="tutor"
                      action="requestChanges"
                      id={tutor.id}
                      payload={{ note: "Please update verification proof." }}
                      variant="outline"
                      className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                    >
                      Request changes
                    </AdminMutationButton>
                    <AdminMutationButton
                      entity="tutor"
                      action="reject"
                      id={tutor.id}
                      payload={{ note: "Rejected during admin verification review." }}
                      variant="outline"
                      className="rounded-full border-rose-300/15 bg-rose-500/[0.08] text-rose-100 hover:bg-rose-500/[0.12]"
                      confirmText={`Confirm rejecting ${tutor.name}?`}
                    >
                      Reject
                    </AdminMutationButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState
              compact
              title="No tutor profiles available"
              description="Tutor verification cards will populate once tutor profiles are stored in MongoDB."
            />
          )}
        </AdminSectionCard>

        <div className="space-y-6">
          <AdminSectionCard title="Top tutors" description="Highlight strong performers for platform trust and campaigns.">
            {topTutors.length ? (
              <div className="space-y-3">
                {topTutors.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-amber-200" />
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-slate-400">{item.metric}</p>
                      </div>
                    </div>
                    <AdminToneBadge tone={item.tone}>{item.tone === "success" ? "Top tier" : "Reliable"}</AdminToneBadge>
                  </div>
                ))}
              </div>
            ) : (
              <AdminEmptyState compact title="No rated tutors yet" description="Top tutor rankings appear once profiles gain reviews and ratings." />
            )}
          </AdminSectionCard>

          <AdminSectionCard title="Risk watchlist" description="Surface accounts that need a second look before fast approvals.">
            {riskyTutors.length ? (
              <div className="space-y-3">
                {riskyTutors.map((item) => (
                  <div key={item.name} className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
                    {item.tone === "danger" ? <ShieldAlert className="mt-1 h-4 w-4 text-rose-200" /> : <CheckCircle2 className="mt-1 h-4 w-4 text-amber-200" />}
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <AdminEmptyState compact title="No risky tutor signals" description="Tutor risk indicators will appear here when verification or quality signals require review." />
            )}
          </AdminSectionCard>
        </div>
      </div>
    </div>
  );
}
