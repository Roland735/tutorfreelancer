"use client";

import { useMemo, useState } from "react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { mutateWorkspace, useWorkspace } from "@/components/dashboard/useWorkspace";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const DEFAULT_SETTINGS = {
  notifications: {
    emailMessages: true,
    pushApplications: true,
    bookingReminders: true,
    marketingUpdates: false,
  },
  privacy: {
    profileVisible: true,
    showUniversity: true,
    showLanguages: true,
  },
};

export default function SettingsPage() {
  const { data, loading } = useWorkspace();
  const [overrides, setOverrides] = useState({});
  const [message, setMessage] = useState("");

  const settings = useMemo(
    () => ({
      notifications: {
        ...(data?.settings?.notifications || DEFAULT_SETTINGS.notifications),
        ...(overrides.notifications || {}),
      },
      privacy: {
        ...(data?.settings?.privacy || DEFAULT_SETTINGS.privacy),
        ...(overrides.privacy || {}),
      },
    }),
    [data, overrides]
  );

  async function saveSettings() {
    try {
      await mutateWorkspace("saveSettings", settings);
      setMessage("Settings saved.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (!data?.settings && loading) {
    return (
      <WorkspaceShell>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-slate-300">Loading settings...</div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Preferences"
          title="Account and privacy settings"
          description="Manage password placeholders, notification preferences, privacy settings, and deactivation placeholders for future backend extensions."
        />

        {message ? <StatusPill tone="success">{message}</StatusPill> : null}

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <SectionCard title="Account settings" description="Password and account details placeholders.">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Current password</label>
                <Input type="password" placeholder="••••••••" className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">New password</label>
                <Input type="password" placeholder="••••••••" className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <div className="flex gap-3">
                <Button className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">Change password</Button>
                <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                  Deactivate account
                </Button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Notification preferences" description="Control message, booking, and application alerts.">
            <div className="space-y-4">
              {settings ? (
                Object.entries(settings.notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-200">
                    <span>{key}</span>
                    <input type="checkbox" checked={value} onChange={(event) => setOverrides((current) => ({ ...current, notifications: { ...(current.notifications || {}), [key]: event.target.checked } }))} />
                  </label>
                ))
              ) : null}
            </div>
          </SectionCard>

          <SectionCard title="Privacy settings" description="Choose which profile details are visible on the marketplace.">
            <div className="space-y-4">
              {settings ? (
                Object.entries(settings.privacy).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-200">
                    <span>{key}</span>
                    <input type="checkbox" checked={value} onChange={(event) => setOverrides((current) => ({ ...current, privacy: { ...(current.privacy || {}), [key]: event.target.checked } }))} />
                  </label>
                ))
              ) : null}
            </div>
          </SectionCard>

          <SectionCard title="Save changes" description="Preferences are persisted to a starter backend workspace store.">
            <Button onClick={saveSettings} className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
              Save settings
            </Button>
          </SectionCard>
        </div>
      </div>
    </WorkspaceShell>
  );
}
