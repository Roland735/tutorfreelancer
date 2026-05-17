"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send } from "lucide-react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

const DRAFT_KEY = "job-post-draft";

export default function PostJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    subject: "",
    category: "Mathematics",
    description: "",
    budgetMin: "",
    budgetMax: "",
    urgency: "Medium",
    sessionType: "Online",
    academicLevel: "Undergraduate",
    duration: "1 hour",
    city: "Harare",
    subjectCode: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const draft = window.localStorage.getItem(DRAFT_KEY);
    if (draft) {
      setForm(JSON.parse(draft));
    }
  }, []);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function saveDraft() {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    setMessage("Draft saved locally.");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title || !form.subject || !form.description || !form.budgetMin) {
      setError("Title, subject, description, and minimum budget are required.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          subject: form.subject,
          category: form.category,
          description: form.description,
          subjectCode: form.subjectCode,
          academicLevel: form.academicLevel,
          urgency: form.urgency,
          sessionType: form.sessionType,
          duration: form.duration,
          city: form.city,
          budget: {
            type: "Hourly",
            min: Number(form.budgetMin),
            max: Number(form.budgetMax || form.budgetMin),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create job.");
      }

      window.localStorage.removeItem(DRAFT_KEY);
      router.push(`/jobs/${data._id}`);
    } catch (err) {
      setError(err.message || "Failed to create job.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Create Request"
          title="Post a tutoring request"
          description="Describe the subject, urgency, budget, and format clearly so tutors can respond with better proposals."
        />

        <SectionCard title="Request details" description="This starter form saves a local draft and submits a real job to the backend.">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Title</label>
                <Input value={form.title} onChange={(event) => updateField("title", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Subject</label>
                <Input value={form.subject} onChange={(event) => updateField("subject", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Category</label>
                <Select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white">
                  <option>Mathematics</option>
                  <option>Computer Science</option>
                  <option>Science</option>
                  <option>Business</option>
                  <option>Languages</option>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Academic level</label>
                <Select value={form.academicLevel} onChange={(event) => updateField("academicLevel", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white">
                  <option>Undergraduate</option>
                  <option>Graduate</option>
                  <option>High School</option>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Urgency</label>
                <Select value={form.urgency} onChange={(event) => updateField("urgency", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Immediate</option>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Session type</label>
                <Select value={form.sessionType} onChange={(event) => updateField("sessionType", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white">
                  <option>Online</option>
                  <option>In-Person</option>
                  <option>Both</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Description</label>
              <Textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} className="min-h-40 rounded-3xl border-white/10 bg-white/[0.04] text-white" placeholder="Explain the course, learning challenge, desired outcomes, and what kind of tutor support you need." />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Min budget</label>
                <Input type="number" value={form.budgetMin} onChange={(event) => updateField("budgetMin", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Max budget</label>
                <Input type="number" value={form.budgetMax} onChange={(event) => updateField("budgetMax", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Duration</label>
                <Input value={form.duration} onChange={(event) => updateField("duration", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">City</label>
                <Input value={form.city} onChange={(event) => updateField("city", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Subject code</label>
                <Input value={form.subjectCode} onChange={(event) => updateField("subjectCode", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
            </div>

            {message ? <StatusPill tone="success">{message}</StatusPill> : null}
            {error ? <StatusPill tone="danger">{error}</StatusPill> : null}

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={saveDraft} className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                <Save className="mr-2 h-4 w-4" />
                Save draft
              </Button>
              <Button type="submit" disabled={submitting} className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                <Send className="mr-2 h-4 w-4" />
                {submitting ? "Submitting..." : "Submit request"}
              </Button>
            </div>
          </form>
        </SectionCard>
      </div>
    </WorkspaceShell>
  );
}
