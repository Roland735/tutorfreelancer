"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  MessageSquare,
  Send,
  Share2,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { useWorkspace } from "@/components/dashboard/useWorkspace";

export default function JobDetailsPage() {
  const { id } = useParams();
  const { data: workspace } = useWorkspace();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Application State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    bidAmount: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
          // Set initial bid amount to min budget
          if (data.budget?.min) {
            setApplicationData(prev => ({ ...prev, bidAmount: data.budget.min }));
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      if (res.ok) {
        setShowApplyModal(false);
        setApplyMessage("Application submitted successfully.");
        // Refresh job data to show applied status
        const jobRes = await fetch(`/api/jobs/${id}`);
        if (jobRes.ok) {
          setJob(await jobRes.json());
        }
      } else {
        const errorData = await res.json();
        setApplyMessage(errorData.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setApplyMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const shareText = `
👋 *Contact for:* ${job.title}
🔢 *CODE:* ${job.subjectCode || "N/A"}
🆔 *Listing ID:* ${job._id}
📍 *Location:* ${job.sessionType}
💰 *Price:* $${job.budget?.min} - $${job.budget?.max} (${job.budget?.type})
👤 *Contact:* ${job.postedBy?.name || "Hidden"}

📝 *Description:*
${job.description?.substring(0, 150)}...

✨ *Features:*
• ${job.academicLevel}
• ${job.urgency} Urgency
• ${job.duration}

🔗 *Link:* ${window.location.href}
    `.trim();

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <WorkspaceShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="animate-spin text-4xl text-primary" />
        </div>
      </WorkspaceShell>
    );
  }

  if (!job) {
    return (
      <WorkspaceShell>
        <EmptyState title="Job not found" description="This request may have been removed or is no longer available." ctaHref="/jobs" ctaLabel="Browse all jobs" />
      </WorkspaceShell>
    );
  }

  const currentUserId = workspace?.profileSummary?.id;
  const hasApplied = workspace?.applications?.sent?.some((item) => item.jobId === job._id);

  return (
    <WorkspaceShell>
      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="relative w-full max-w-lg border-white/10 bg-slate-900">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 rounded-full"
            >
              <X size={20} />
            </Button>

            <CardHeader>
              <CardTitle className="text-2xl font-heading text-white">Apply for this job</CardTitle>
              <CardDescription>Send a fast, credible proposal to the requester.</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleApplySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your Bid Amount ($)</label>
                  <Input
                    type="number"
                    required
                    min="1"
                    value={applicationData.bidAmount}
                    onChange={(e) => setApplicationData({ ...applicationData, bidAmount: e.target.value })}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Client&apos;s Budget: ${job.budget?.min} - ${job.budget?.max}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Cover Letter</label>
                  <Textarea
                    required
                    rows={6}
                    placeholder="Introduce yourself and explain why you're a good fit..."
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                    className="w-full resize-none"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowApplyModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit Proposal"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <Button variant="ghost" asChild className="gap-2 rounded-full text-slate-300 hover:bg-white/[0.04] hover:text-white">
          <Link href="/jobs">
            <ArrowLeft size={16} /> Back to Jobs
          </Link>
        </Button>

        {applyMessage ? <StatusPill tone="success">{applyMessage}</StatusPill> : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-white/10 bg-white/[0.04]">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <StatusPill tone="sky">{job.category}</StatusPill>
                      {job.subjectCode ? <StatusPill tone="neutral">{job.subjectCode}</StatusPill> : null}
                      <StatusPill tone="warning">{job.urgency}</StatusPill>
                    </div>
                    <h1 className="text-3xl font-bold font-heading mb-2 text-white">{job.title}</h1>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      Posted {job.createdAt ? formatDistanceToNow(new Date(job.createdAt)) : "recently"} ago
                      <span className="w-1 h-1 rounded-full bg-slate-500/50" />
                      {job.applicants?.length || 0} applicants
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" size="lg" onClick={handleShare} className="gap-2 rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                      <Share2 size={18} /> Share
                    </Button>
                    {!hasApplied && (
                      <Button size="lg" onClick={() => setShowApplyModal(true)} className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                        Apply Now
                      </Button>
                    )}
                    {hasApplied && (
                      <Button size="lg" disabled variant="secondary" className="gap-2 rounded-full">
                        <CheckCircle size={18} /> Applied
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 border-y border-white/8 py-6 sm:grid-cols-2 xl:grid-cols-4 mb-8">
                  <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-300">
                    Budget
                    <div className="mt-2 font-semibold text-white">${job.budget?.min} - ${job.budget?.max}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-300">
                    Session
                    <div className="mt-2 font-semibold text-white">{job.sessionType}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-300">
                    Deadline
                    <div className="mt-2 font-semibold text-white">{job.deadline ? new Date(job.deadline).toLocaleDateString() : "Flexible"}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-300">
                    Level
                    <div className="mt-2 font-semibold text-white">{job.academicLevel}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold font-heading mb-3 text-white">Request details</h3>
                    <div className="max-w-none text-slate-300 leading-relaxed whitespace-pre-line">
                      {job.description}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-heading mb-3 text-white">Student requirements</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-300">
                        Subject
                        <div className="mt-2 font-semibold text-white">{job.subject || job.category}</div>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-300">
                        City
                        <div className="mt-2 font-semibold text-white">{job.location?.city || "Zimbabwe"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-white/10 bg-white/[0.04]">
              <CardHeader>
                <CardTitle className="text-lg text-white">About the requester</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar
                    src={job.postedBy?.avatar}
                    alt={job.postedBy?.name}
                    fallback={job.postedBy?.name?.charAt(0) || "U"}
                    className="h-12 w-12"
                  />
                  <div>
                    <h4 className="font-bold text-white">{job.postedBy?.name || "Anonymous User"}</h4>
                    <p className="text-sm text-slate-400">
                      {job.postedBy?.university || "University profile"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-white/8">
                    <span className="text-slate-400">Location</span>
                    <span className="font-medium text-white">{job.location?.city || job.postedBy?.location?.city || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/8">
                    <span className="text-slate-400">Applications</span>
                    <span className="font-medium text-white">{job.applicants?.length || 0}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/8">
                    <span className="text-slate-400">Session type</span>
                    <span className="font-medium text-white">{job.sessionType}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Verified activity</span>
                    <span className="text-emerald-300 flex items-center gap-1"><CheckCircle size={14} /> Yes</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <Button asChild className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                    <Link href="/messages">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact requester
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04]">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-white">
                  <CheckCircle className="text-primary" size={20} /> Similar jobs
                </h3>
                <div className="space-y-3">
                  {(job.similarJobs || []).slice(0, 3).map((item) => (
                    <Link key={item._id} href={`/jobs/${item._id}`} className="block rounded-2xl border border-white/8 bg-slate-950/60 p-4 transition hover:border-emerald-300/20 hover:bg-white/[0.06]">
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.category} • ${item.budget?.min}-{item.budget?.max}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
