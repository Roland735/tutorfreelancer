"use client";

import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { EmptyState, PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { mutateWorkspace, useWorkspace } from "@/components/dashboard/useWorkspace";
import { Button } from "@/components/ui/Button";

function groupNotifications(items = []) {
  return items.reduce((accumulator, item) => {
    const key = item.type || "System";
    accumulator[key] = accumulator[key] || [];
    accumulator[key].push(item);
    return accumulator;
  }, {});
}

export default function NotificationsPage() {
  const { data, loading, error, reload } = useWorkspace();
  const grouped = groupNotifications(data?.notifications?.items || []);

  async function markAsRead(notificationId) {
    await mutateWorkspace("markNotificationRead", { notificationId });
    reload();
    window.dispatchEvent(new Event("workspace-notifications-updated"));
  }

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Alerts"
          title="Notifications and recent system activity"
          description="Review unread alerts, grouped updates, and recent marketplace events across applications, bookings, and messages."
          actions={
            <Button onClick={() => markAsRead("all")} className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
              Mark all as read
            </Button>
          }
        />

        <SectionCard title="Grouped notifications" description="Unread and read states are grouped by alert type for easier scanning.">
          {loading ? (
            <div className="text-slate-300">Loading notifications...</div>
          ) : error ? (
            <EmptyState title="Unable to load notifications" description={error} ctaHref="/dashboard" ctaLabel="Go to dashboard" />
          ) : Object.keys(grouped).length ? (
            <div className="space-y-6">
              {Object.entries(grouped).map(([type, items]) => (
                <div key={type} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{type}</h3>
                    <StatusPill tone="sky">{items.length}</StatusPill>
                  </div>
                  {items.map((item) => (
                    <div key={item._id} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-medium text-white">{item.content}</p>
                        <p className="mt-2 text-sm text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusPill tone={item.read ? "neutral" : "warning"}>{item.read ? "Read" : "Unread"}</StatusPill>
                        {!item.read ? (
                          <Button onClick={() => markAsRead(item._id)} variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                            Mark read
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No notifications" description="Once applications, messages, and session updates arrive, they appear here." />
          )}
        </SectionCard>
      </div>
    </WorkspaceShell>
  );
}
