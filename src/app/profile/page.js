"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, Save, Sparkles } from "lucide-react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { EmptyState, PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Masters", "PhD"];

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    avatar: "",
    bio: "",
    university: "",
    major: "",
    yearOfStudy: "",
    city: "",
    country: "Zimbabwe",
    languages: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }

        setForm({
          name: data.name || "",
          avatar: data.avatar || "",
          bio: data.bio || "",
          university: data.university || "",
          major: data.major || "",
          yearOfStudy: data.yearOfStudy || "",
          city: data.location?.city || "",
          country: data.location?.country || "Zimbabwe",
          languages: (data.languages || []).join(", "),
        });
      } catch (err) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const previewLanguages = useMemo(
    () =>
      form.languages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [form.languages]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          city: form.city,
          languages: previewLanguages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile.");
      }

      setMessage("Profile saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <WorkspaceShell>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-slate-300">
          Loading profile...
        </div>
      </WorkspaceShell>
    );
  }

  if (error && !form.name) {
    return (
      <WorkspaceShell>
        <EmptyState
          title="Profile unavailable"
          description={error}
          ctaHref="/dashboard"
          ctaLabel="Return to dashboard"
        />
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Public Identity"
          title="Profile and public preview"
          description="Keep your student or tutor profile credible with a strong bio, clear university details, and local Zimbabwe context."
        />

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <SectionCard title="Edit profile" description="Update your visible account details and save them to the backend.">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-4 rounded-3xl border border-white/8 bg-slate-950/60 p-4">
                <Avatar src={form.avatar} alt={form.name} fallback={(form.name || "U").charAt(0)} className="h-16 w-16" />
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-slate-300">Avatar URL</label>
                  <div className="flex gap-3">
                    <Input
                      value={form.avatar}
                      onChange={(event) => setForm((current) => ({ ...current, avatar: event.target.value }))}
                      placeholder="Paste avatar image URL"
                      className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white"
                    />
                    <Button type="button" variant="outline" className="rounded-2xl border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Full name</label>
                  <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">City</label>
                  <Input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} placeholder="Harare, Bulawayo, Mutare..." className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Bio</label>
                <Textarea
                  value={form.bio}
                  onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                  className="min-h-32 rounded-3xl border-white/10 bg-white/[0.04] text-white"
                  placeholder="Share what you study, what you teach, and how you help students succeed."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">University</label>
                  <Input value={form.university} onChange={(event) => setForm((current) => ({ ...current, university: event.target.value }))} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Degree or major</label>
                  <Input value={form.major} onChange={(event) => setForm((current) => ({ ...current, major: event.target.value }))} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Year of study</label>
                  <Select value={form.yearOfStudy} onChange={(event) => setForm((current) => ({ ...current, yearOfStudy: event.target.value }))} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white">
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Languages</label>
                  <Input
                    value={form.languages}
                    onChange={(event) => setForm((current) => ({ ...current, languages: event.target.value }))}
                    placeholder="English, Shona, Ndebele"
                    className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white"
                  />
                </div>
              </div>

              {message ? <StatusPill tone="success">{message}</StatusPill> : null}
              {error ? <StatusPill tone="danger">{error}</StatusPill> : null}

              <Button type="submit" disabled={saving} className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </SectionCard>

          <SectionCard title="Public preview" description="This is how students or tutors will quickly understand and trust your profile.">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
              <div className="flex items-center gap-4">
                <Avatar src={form.avatar} alt={form.name} fallback={(form.name || "U").charAt(0)} className="h-18 w-18" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-white">{form.name || "Your name"}</h3>
                    <StatusPill tone="sky">Student-ready</StatusPill>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{form.university || "University"} • {form.major || "Degree"}</p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-300">
                {form.bio || "Your short profile bio will appear here once added."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Location</p>
                  <p className="mt-2 text-sm text-white">{form.city || "Harare"}, {form.country || "Zimbabwe"}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Year</p>
                  <p className="mt-2 text-sm text-white">{form.yearOfStudy || "Not selected"}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                  Languages
                </div>
                <div className="flex flex-wrap gap-2">
                  {previewLanguages.length ? (
                    previewLanguages.map((language) => (
                      <StatusPill key={language} tone="neutral">
                        {language}
                      </StatusPill>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Add languages to improve matching and trust.</p>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </WorkspaceShell>
  );
}
