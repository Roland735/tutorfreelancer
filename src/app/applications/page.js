"use client";

import { useState } from "react";
import Link from "next/link";
import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { EmptyState, PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { Button } from "@/components/ui/Button";
import { mutateWorkspace, useWorkspace } from "@/components/dashboard/useWorkspace";

export default function ApplicationsPage() {
  const { data, loading, error, reload } = useWorkspace();
  const [activeTab, setActiveTab] = useState("sent");
  const [message, setMessage] = useState("");

  async function manageApplication(jobId, applicantId, decision) {
    try {
      await mutateWorkspace("manageApplication", { jobId, applicantId, decision });
      setMessage(`Application ${decision}.`);
      reload();
    } catch (err) {
      setMessage(err.message);
    }
  }

  const items = activeTab === "sent" ? data?.applications?.sent || [] : data?.applications?.received || [];

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Applications"
          title="Track proposals and incoming applicants"
          description="Tutors can monitor submitted proposals while students can review and manage the applications received for their tutoring requests."
        />

        <div className="flex gap-3">
          <Button variant={activeTab === "sent" ? "default" : "outline"} onClick={() => setActiveTab("sent")} className="rounded-full">
            Sent applications
          </Button>
          <Button variant={activeTab === "received" ? "default" : "outline"} onClick={() => setActiveTab("received")} className="rounded-full">
            Received applications
          </Button>
        </div>

        {message ? <StatusPill tone="success">{message}</StatusPill> : null}

        <SectionCard title={activeTab === "sent" ? "Applications you sent" : "Applications you received"} description="Use these queues to follow status changes, compare bids, and decide next steps.">
          {loading ? (
            <div className="text-slate-300">Loading applications...</div>
          ) : error ? (
            <EmptyState title="Unable to load applications" description={error} ctaHref="/jobs" ctaLabel="Browse jobs" />
          ) : items.length ? (
            <div className="space-y-4">
              {activeTab === "sent"
                ? items.map((item) => (
                    <div key={item.jobId} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <Link href={`/jobs/${item.jobId}`} className="text-lg font-semibold text-white hover:text-emerald-200">
                            {item.jobTitle}
                          </Link>
                          <p className="mt-2 text-sm text-slate-400">
                            Requester: {item.requesterName} • Bid: ${item.bidAmount} • {item.sessionType}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusPill tone={item.status === "accepted" ? "success" : item.status === "rejected" ? "danger" : "warning"}>
                            {item.status}
                          </StatusPill>
                          <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                            <Link href={`/jobs/${item.jobId}`}>View job</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                : items.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{item.jobTitle}</p>
                          <p className="mt-2 text-sm text-slate-400">
                            Applicant ID: {item.applicantId} • Bid: ${item.bidAmount}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <StatusPill tone={item.status === "accepted" ? "success" : item.status === "rejected" ? "danger" : "warning"}>
                            {item.status}
                          </StatusPill>
                          <Button onClick={() => manageApplication(item.jobId, item.applicantId, "accepted")} className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                            Accept
                          </Button>
                          <Button onClick={() => manageApplication(item.jobId, item.applicantId, "rejected")} variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          ) : (
            <EmptyState
              title="No applications yet"
              description={activeTab === "sent" ? "Start applying to tutoring requests to populate this list." : "Applications received for your posted jobs will appear here."}
              ctaHref={activeTab === "sent" ? "/jobs" : "/jobs/post"}
              ctaLabel={activeTab === "sent" ? "Browse jobs" : "Post a request"}
            />
          )}
        </SectionCard>
      </div>
    </WorkspaceShell>
  );
}
