"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CircleDollarSign,
  FileCheck2,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  EmptyState,
  MetricCard,
  PageIntro,
  SectionCard,
  StatusPill,
} from "@/components/dashboard/WorkspaceUI";
import { useWorkspace } from "@/components/dashboard/useWorkspace";
import WorkspaceLoading from "@/components/dashboard/WorkspaceLoading";
import { useWorkspaceMode } from "@/components/layout/WorkspaceModeContext";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

function StudentDashboard({ data }) {
  const { overview, profileSummary, applications, notifications } = data;
  const studentOverview = overview.student;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_60px_-38px_rgba(2,6,23,0.95)] sm:p-6 lg:p-8">
        <PageIntro
          eyebrow="Student Command Center"
          title={`Welcome back, ${profileSummary.name?.split(" ")[0] || "there"}`}
          description="Manage tutoring requests, compare incoming tutor applications, and keep your study schedule organized from one calm workspace."
          actions={
            <>
              <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
                <Link href="/jobs/post">Post a request</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                <Link href="/messages">Open inbox</Link>
              </Button>
            </>
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Requests Posted" value={studentOverview.stats.jobsPosted} helper="Tutoring requests you published" icon={BriefcaseBusiness} accent="primary" />
        <MetricCard label="Applications Received" value={studentOverview.stats.applicationsReceived} helper="Tutor proposals waiting on review" icon={FileCheck2} accent="sky" />
        <MetricCard label="Upcoming Bookings" value={studentOverview.stats.upcomingBookings} helper="Scheduled study sessions ahead" icon={CalendarClock} accent="sky" />
        <MetricCard label="Unread Messages" value={studentOverview.stats.unreadMessages} helper="Conversations that need a response" icon={MessageSquare} accent="emerald" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Incoming Tutor Applications"
          description="Review the latest tutor interest across your active tutoring requests."
          action={
            <Button asChild variant="ghost" className="rounded-full text-slate-300 hover:bg-white/[0.06] hover:text-white">
              <Link href="/applications">Manage all</Link>
            </Button>
          }
        >
          {applications.received.length ? (
            <div className="space-y-3">
              {applications.received.slice(0, 4).map((application) => (
                <div key={application.id} className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-slate-950/60 p-4 sm:flex-row sm:items-center">
                  <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-3 text-sky-100">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{application.jobTitle}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Applicant ID: {application.applicantId} • Bid: ${application.bidAmount}
                    </p>
                  </div>
                  <StatusPill tone={application.status === "accepted" ? "success" : application.status === "rejected" ? "danger" : "warning"}>
                    {application.status}
                  </StatusPill>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tutor applications yet"
              description="Once tutors start responding to your requests, their proposals will show here for quick review."
              ctaHref="/jobs/post"
              ctaLabel="Post a new request"
            />
          )}
        </SectionCard>

        <SectionCard title="Student Quick Actions" description="Fast paths for the tasks students use most often.">
          <div className="grid gap-3">
            {[
              { label: "Post another tutoring request", href: "/jobs/post" },
              { label: "Browse current tutoring jobs", href: "/jobs" },
              { label: "Review notifications", href: "/notifications" },
              { label: "Update profile and onboarding", href: "/profile" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-slate-950/60 px-4 py-4 transition hover:border-emerald-300/20 hover:bg-white/[0.06]"
              >
                <span className="min-w-0 font-medium text-white">{action.label}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/8 bg-slate-950/60 p-4">
            <p className="text-sm font-medium text-white">Notification health</p>
            <p className="mt-2 text-sm text-slate-400">
              You currently have {notifications.unreadCount} unread alerts across bookings, applications, and messages.
            </p>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Your Active Requests" description="Recent requests you posted and can continue managing.">
          {studentOverview.activeRequests.length ? (
            <div className="space-y-3">
              {studentOverview.activeRequests.map((job) => (
                <Link
                  key={job._id}
                  href={`/jobs/${job._id}`}
                  className="block rounded-2xl border border-white/8 bg-slate-950/60 p-4 transition hover:border-emerald-300/20 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{job.title}</p>
                    <StatusPill tone="neutral">{job.applicants?.length || 0} applicants</StatusPill>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    {job.category} • {job.sessionType} • ${job.budget?.min}-{job.budget?.max}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active requests yet"
              description="Start by posting a tutoring request so tutors can begin applying and messaging you."
              ctaHref="/jobs/post"
              ctaLabel="Create request"
            />
          )}
        </SectionCard>

        <SectionCard title="Recommended Tutors" description="Suggested tutors to help you shortlist credible academic support faster.">
          {overview.recommendedTutors.length ? (
            <div className="space-y-3">
              {overview.recommendedTutors.slice(0, 3).map((tutor) => (
                <Link
                  key={tutor._id}
                  href={`/tutors/${tutor.user?._id}`}
                  className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-slate-950/60 p-4 transition hover:border-sky-300/20 hover:bg-white/[0.06] sm:flex-row sm:items-center"
                >
                  <Avatar src={tutor.user?.avatar} alt={tutor.user?.name} fallback={(tutor.user?.name || "T").charAt(0)} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{tutor.user?.name}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {tutor.user?.university || "Zimbabwe university tutor"} • ${tutor.hourlyRate}/hr
                    </p>
                  </div>
                  <StatusPill tone="sky">{(tutor.stats?.rating || 5).toFixed(1)} / 5</StatusPill>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No tutor recommendations yet" description="Tutor recommendations will appear here as the marketplace grows." />
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function TutorDashboard({ data }) {
  const { overview, profileSummary, earnings, reviews, tutorProfile, wallet } = data;
  const tutorOverview = overview.tutor;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_60px_-38px_rgba(2,6,23,0.95)] sm:p-6 lg:p-8">
        <PageIntro
          eyebrow="Tutor Growth Hub"
          title={`Welcome back, ${profileSummary.name?.split(" ")[0] || "there"}`}
          description="Track applications, upcoming teaching sessions, ratings, and payout momentum from a dashboard tailored to tutoring work."
          actions={
            <>
              <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
                <Link href="/jobs">Browse jobs</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                <Link href="/earnings">View earnings</Link>
              </Button>
            </>
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Jobs Applied" value={tutorOverview.stats.jobsApplied} helper="Active tutoring opportunities pursued" icon={BriefcaseBusiness} accent="primary" />
        <MetricCard label="Upcoming Sessions" value={tutorOverview.stats.upcomingSessions} helper="Scheduled teaching sessions ahead" icon={CalendarClock} accent="sky" />
        <MetricCard label="Total Earnings" value={`$${tutorOverview.stats.totalEarnings.toFixed(2)}`} helper="Net tutoring revenue so far" icon={CircleDollarSign} accent="emerald" />
        <MetricCard label="Average Rating" value={tutorOverview.stats.averageRating ? tutorOverview.stats.averageRating.toFixed(1) : "0.0"} helper="Feedback from completed sessions" icon={Star} accent="sky" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Application Pipeline"
          description="Recent tutoring applications and where they currently stand."
          action={
            <Button asChild variant="ghost" className="rounded-full text-slate-300 hover:bg-white/[0.06] hover:text-white">
              <Link href="/applications">Open applications</Link>
            </Button>
          }
        >
          {tutorOverview.recentApplications.length ? (
            <div className="space-y-3">
              {tutorOverview.recentApplications.map((application) => (
                <div key={application.jobId} className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-slate-950/60 p-4 sm:flex-row sm:items-center">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-100">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{application.jobTitle}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {application.requesterName} • Bid: ${application.bidAmount} • {application.city || "Zimbabwe"}
                    </p>
                  </div>
                  <StatusPill tone={application.status === "accepted" ? "success" : application.status === "rejected" ? "danger" : "warning"}>
                    {application.status}
                  </StatusPill>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tutoring applications yet"
              description="Start applying to open tutoring requests and your pipeline will build here."
              ctaHref="/jobs"
              ctaLabel="Browse jobs"
            />
          )}
        </SectionCard>

        <SectionCard title="Tutor Performance" description="A quick view of credibility, profile health, and payout readiness.">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4">
              <p className="text-sm font-medium text-white">Public rating</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {reviews.averageRating ? reviews.averageRating.toFixed(1) : "0.0"}
              </p>
              <p className="mt-2 text-sm text-slate-400">{reviews.total} received reviews</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4">
              <p className="text-sm font-medium text-white">Verification status</p>
              <div className="mt-3 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <p className="text-sm text-slate-300">{wallet.verificationStatus}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4">
              <p className="text-sm font-medium text-white">Tutor profile</p>
              <p className="mt-2 text-sm text-slate-400">
                {tutorProfile?.bio || "Complete your tutor bio and subjects to improve conversion and trust."}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Revenue Snapshot" description="Recent payouts and current earnings momentum.">
          {tutorOverview.payoutPreview.length ? (
            <div className="space-y-3">
              {tutorOverview.payoutPreview.map((transaction) => (
                <div key={transaction._id} className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-white">{transaction.method || "Tutoring payout"}</p>
                    <p className="mt-1 text-sm text-slate-400">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill tone={transaction.status === "Completed" ? "success" : "warning"}>
                      {transaction.status}
                    </StatusPill>
                    <p className="font-semibold text-white">${Number(transaction.netPayout || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No payout history yet" description="Completed tutoring sessions and payouts will show here once you start earning." />
          )}
        </SectionCard>

        <SectionCard title="Recommended Jobs" description="Fresh opportunities aligned to your tutoring work.">
          {overview.recommendedJobs.length ? (
            <div className="space-y-3">
              {overview.recommendedJobs.slice(0, 3).map((job) => (
                <Link
                  key={job._id}
                  href={`/jobs/${job._id}`}
                  className="block rounded-2xl border border-white/8 bg-slate-950/60 p-4 transition hover:border-emerald-300/20 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{job.title}</p>
                    <StatusPill tone="sky">{job.sessionType}</StatusPill>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    {job.category} • ${job.budget?.min}-{job.budget?.max}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No job matches yet" description="Open marketplace requests will appear here for quick tutor discovery." />
          )}
        </SectionCard>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading, error } = useWorkspace();
  const { navMode } = useWorkspaceMode();

  if (loading) {
    return <WorkspaceLoading />;
  }

  if (error || !data) {
    return (
      <EmptyState
        title="Workspace data is unavailable"
        description={error || "We could not load your dashboard right now."}
        ctaHref="/jobs"
        ctaLabel="Browse jobs"
      />
    );
  }

  return navMode === "tutor" ? <TutorDashboard data={data} /> : <StudentDashboard data={data} />;
}
