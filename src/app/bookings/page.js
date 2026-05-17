"use client";

import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { EmptyState, PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { useWorkspace } from "@/components/dashboard/useWorkspace";
import { Button } from "@/components/ui/Button";

export default function BookingsPage() {
  const { data, loading, error } = useWorkspace();
  const upcoming = data?.bookings?.upcoming || [];
  const history = data?.bookings?.history || [];

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Sessions"
          title="Bookings, meetings, and session history"
          description="Review upcoming tutoring sessions, meeting links, statuses, and past session records in one place."
        />

        <div className="grid gap-4 xl:grid-cols-2">
          <SectionCard title="Upcoming sessions" description="Join, cancel, or reschedule active tutoring bookings.">
            {loading ? (
              <div className="text-slate-300">Loading sessions...</div>
            ) : error ? (
              <EmptyState title="Unable to load bookings" description={error} ctaHref="/dashboard" ctaLabel="Go to dashboard" />
            ) : upcoming.length ? (
              <div className="space-y-4">
                {upcoming.map((session) => (
                  <div key={session._id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{session.job?.title || "Tutoring session"}</p>
                        <p className="mt-2 text-sm text-slate-400">{new Date(session.date).toLocaleString()} • {session.type}</p>
                        <p className="mt-1 text-sm text-slate-500">{session.meetingLink || "Meeting link placeholder ready"}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <StatusPill tone="success">{session.status}</StatusPill>
                        <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                          Reschedule
                        </Button>
                        <Button className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No upcoming bookings" description="Once a tutoring request moves into a confirmed session, it appears here." ctaHref="/jobs" ctaLabel="Explore requests" />
            )}
          </SectionCard>

          <SectionCard title="Session history" description="Past tutoring activity and completed session records.">
            {history.length ? (
              <div className="space-y-4">
                {history.map((session) => (
                  <div key={session._id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-semibold text-white">{session.job?.title || "Session"}</p>
                        <p className="mt-1 text-sm text-slate-400">{new Date(session.date).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <StatusPill tone={session.status === "Completed" ? "success" : "warning"}>{session.status}</StatusPill>
                        <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                          View details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No session history yet" description="Completed or cancelled bookings will build out this history section." />
            )}
          </SectionCard>
        </div>
      </div>
    </WorkspaceShell>
  );
}
