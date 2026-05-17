"use client";

import { useState } from "react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { mutateWorkspace, useWorkspace } from "@/components/dashboard/useWorkspace";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

export default function HelpSupportPage() {
  const { data } = useWorkspace();
  const [form, setForm] = useState({
    subject: "",
    category: "Account",
    message: "",
  });
  const [feedback, setFeedback] = useState("");

  async function submitSupport(event) {
    event.preventDefault();
    try {
      await mutateWorkspace("submitSupport", form);
      setFeedback("Support request submitted.");
      setForm({ subject: "", category: "Account", message: "" });
    } catch (err) {
      setFeedback(err.message);
    }
  }

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Support"
          title="Help, FAQ, and platform guidance"
          description="Find quick answers, contact support, review platform guidelines, and submit an issue report through the starter support flow."
        />

        {feedback ? <StatusPill tone="success">{feedback}</StatusPill> : null}

        <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
          <SectionCard title="FAQ and guidelines" description="Starter knowledge base sections for common marketplace questions.">
            <div className="space-y-4">
              {(data?.help?.faqs || []).map((faq) => (
                <div key={faq.question} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                  <p className="font-semibold text-white">{faq.question}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{faq.answer}</p>
                </div>
              ))}
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <p className="font-semibold text-white">Platform guidelines</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                  {(data?.help?.guidelines || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Contact support" description="Submit a categorized support request or issue report.">
            <form onSubmit={submitSupport} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Category</label>
                <Select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white">
                  {(data?.help?.categories || []).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Subject</label>
                <Input value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Message</label>
                <Textarea value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} className="min-h-36 rounded-3xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                  Send request
                </Button>
                <Button type="button" variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                  Report issue
                </Button>
              </div>
            </form>
          </SectionCard>
        </div>
      </div>
    </WorkspaceShell>
  );
}
