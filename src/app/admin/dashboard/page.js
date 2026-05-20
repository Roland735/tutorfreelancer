import Link from "next/link";
import {
  Activity,
  ArrowDownToLine,
  BriefcaseBusiness,
  CircleDollarSign,
  FileWarning,
  GraduationCap,
  HeartPulse,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  AdminActionList,
  AdminEmptyState,
  AdminMiniBars,
  AdminPageHeader,
  AdminSectionCard,
  AdminStatsGrid,
  AdminTimeline,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminDashboardData } from "@/lib/admin-data.server";

const statIcons = [Users, GraduationCap, BriefcaseBusiness, FileWarning, CircleDollarSign, Activity];

export default async function AdminDashboardPage() {
  const {
    stats,
    dashboardTrends,
    moderationLinks,
    pendingApprovals,
    platformHealth,
    recentActivity,
  } = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Platform command"
        title="Tutor marketplace operations at a glance"
        description="A premium control center for a Zimbabwean university tutoring platform, built to surface risk, growth, approvals, payouts, and trust signals without clutter."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              <Link href="/admin/reports">
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Export summary
              </Link>
            </Button>
            <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
              <Link href="/admin/flags">Review abuse queue</Link>
            </Button>
          </>
        }
      />

      <AdminStatsGrid items={stats} icons={statIcons} />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <AdminSectionCard
          title="Growth and revenue pulse"
          description="Starter chart blocks are ready to connect to analytics endpoints for users, jobs, and revenue."
          action={<AdminToneBadge tone="sky">Weekly view</AdminToneBadge>}
        >
          {dashboardTrends.length ? (
            <AdminMiniBars
              data={dashboardTrends}
              keys={[
                { label: "Users", value: "users" },
                { label: "Jobs", value: "jobs" },
                { label: "Revenue", value: "revenue" },
              ]}
              colors={["bg-emerald-300", "bg-sky-300", "bg-violet-300"]}
            />
          ) : (
            <AdminEmptyState
              compact
              title="No trend data yet"
              description="Growth charts will appear once user, job, and payment records exist in the database."
            />
          )}
        </AdminSectionCard>

        <AdminSectionCard
          title="Platform health"
          description="Operational health blocks highlight where admins should focus attention first."
        >
          {platformHealth.length ? (
            <div className="space-y-3">
              {platformHealth.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{item.label}</p>
                    <AdminToneBadge tone={item.tone}>{item.value}</AdminToneBadge>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{item.helper}</p>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState
              compact
              title="No health signals yet"
              description="Platform health cards will populate as users, sessions, payments, and reviews accumulate."
            />
          )}
        </AdminSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr_0.8fr]">
        <AdminSectionCard title="Recent activity" description="A fast-moving audit feed for actions and automation events.">
          {recentActivity.length ? (
            <AdminTimeline items={recentActivity} />
          ) : (
            <AdminEmptyState
              compact
              title="No recent activity"
              description="Recent users, jobs, reviews, and payments will appear here once records exist in the database."
            />
          )}
        </AdminSectionCard>

        <AdminSectionCard title="Pending approvals" description="Review tutor onboarding and content actions waiting on staff.">
          {pendingApprovals.length ? (
            <div className="space-y-3">
              {pendingApprovals.map((item) => (
                <div key={`${item.name}-${item.university}`} className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.area}</p>
                    </div>
                    <AdminToneBadge
                      tone={item.priority === "High" ? "danger" : item.priority === "Medium" ? "warning" : "sky"}
                    >
                      {item.priority}
                    </AdminToneBadge>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{item.university}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState
              compact
              title="No pending approvals"
              description="Pending tutor verification items will surface here when profiles enter review."
            />
          )}
        </AdminSectionCard>

        <AdminSectionCard title="Moderation shortcuts" description="Jump directly into queues that affect trust and platform quality.">
          {moderationLinks.length ? (
            <AdminActionList items={moderationLinks} />
          ) : (
            <AdminEmptyState
              compact
              title="No moderation shortcuts available"
              description="As soon as moderation signals are detected, shortcut links will be summarized here."
            />
          )}
        </AdminSectionCard>
      </div>

      <AdminSectionCard
        title="Operational readiness"
        description="This reusable shell already supports desktop collapse, mobile drawer navigation, sticky headers, and route-aware admin sections."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
            <ShieldCheck className="h-5 w-5 text-emerald-200" />
            <p className="mt-4 font-medium text-white">Role-safe layout</p>
            <p className="mt-2 text-sm text-slate-400">Only admin sessions remain in this workspace, ready for deeper permission checks later.</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
            <HeartPulse className="h-5 w-5 text-sky-200" />
            <p className="mt-4 font-medium text-white">Clean system states</p>
            <p className="mt-2 text-sm text-slate-400">Loading and error routes are already scaffolded so backend integrations feel predictable.</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
            <Activity className="h-5 w-5 text-violet-200" />
            <p className="mt-4 font-medium text-white">Scalable admin modules</p>
            <p className="mt-2 text-sm text-slate-400">Cards, charts, filters, tables, badges, and modal-ready actions are all reusable across routes.</p>
          </div>
        </div>
      </AdminSectionCard>
    </div>
  );
}
