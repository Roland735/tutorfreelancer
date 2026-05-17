"use client";

import { useState } from "react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { EmptyState, MetricCard, PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { mutateWorkspace, useWorkspace } from "@/components/dashboard/useWorkspace";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Star, MessageSquareQuote, Sparkles } from "lucide-react";

export default function ReviewsPage() {
  const { data, loading, error, reload } = useWorkspace();
  const [form, setForm] = useState({ targetName: "", rating: "5", comment: "" });
  const [message, setMessage] = useState("");

  async function submitReview(event) {
    event.preventDefault();
    try {
      await mutateWorkspace("saveReview", form);
      setMessage("Review submitted.");
      setForm({ targetName: "", rating: "5", comment: "" });
      reload();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Ratings"
          title="Reviews and testimonials"
          description="Read tutor feedback, monitor average rating, and submit thoughtful reviews after productive sessions."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Average rating" value={(data?.reviews?.averageRating || 0).toFixed(1)} helper="Calculated from received reviews" icon={Star} accent="sky" />
          <MetricCard label="Total reviews" value={data?.reviews?.total || 0} helper="Public feedback received" icon={MessageSquareQuote} accent="primary" />
          <MetricCard label="Manual submissions" value={data?.reviews?.manual?.length || 0} helper="Starter form submissions saved in workspace" icon={Sparkles} accent="emerald" />
        </div>

        {message ? <StatusPill tone="success">{message}</StatusPill> : null}

        <div className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
          <SectionCard title="Recent feedback" description="Ratings and testimonials shown to build marketplace trust.">
            {loading ? (
              <div className="text-slate-300">Loading reviews...</div>
            ) : error ? (
              <EmptyState title="Unable to load reviews" description={error} ctaHref="/dashboard" ctaLabel="Go to dashboard" />
            ) : data?.reviews?.items?.length || data?.reviews?.manual?.length ? (
              <div className="space-y-4">
                {[...(data?.reviews?.items || []), ...(data?.reviews?.manual || [])].map((review, index) => (
                  <div key={review._id || review.id || index} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{review.reviewer?.name || review.targetName || "Tutor"}</p>
                      <StatusPill tone="warning">{Number(review.rating || 5).toFixed(1)} / 5</StatusPill>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No feedback yet" description="Completed sessions and post-session reviews will appear here once they start coming in." />
            )}
          </SectionCard>

          <SectionCard title="Submit a review" description="A starter review form that can be extended to verified post-session submissions later.">
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Tutor or student name</label>
                <Input value={form.targetName} onChange={(event) => setForm((current) => ({ ...current, targetName: event.target.value }))} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Rating</label>
                <Input type="number" min="1" max="5" step="0.5" value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Comment</label>
                <Textarea value={form.comment} onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))} className="min-h-32 rounded-3xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <Button type="submit" className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                Submit review
              </Button>
            </form>
          </SectionCard>
        </div>
      </div>
    </WorkspaceShell>
  );
}
