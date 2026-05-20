import { BarChart3, DownloadCloud, LineChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  AdminEmptyState,
  AdminMiniBars,
  AdminPageHeader,
  AdminSectionCard,
  AdminSparkBars,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminReportsData } from "@/lib/admin-data.server";

export default async function AdminReportsPage() {
  const { dashboardTrends, reportCards, reportSummary } = await getAdminReportsData();
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Reports"
        title="Analytics and platform growth dashboard"
        description="Track weekly and monthly trends across users, jobs, sessions, retention, and revenue with export-ready report scaffolding."
        actions={
          <>
            <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              <DownloadCloud className="mr-2 h-4 w-4" />
              Export placeholder
            </Button>
            <Button className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">Schedule report</Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminSectionCard title="Users, jobs, and revenue" description="A shared chart component keeps reports visually consistent across admin modules.">
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
            <AdminEmptyState compact title="No trend data yet" description="Charts will appear once user, job, and transaction records exist." />
          )}
        </AdminSectionCard>

        <AdminSectionCard title="Performance summary" description="Leadership metrics stay easy to scan in a calm side panel.">
          {reportSummary.length ? (
            <div className="space-y-3">
              {reportSummary.map((item) => (
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
            <AdminEmptyState compact title="No summary metrics" description="Summary cards will populate when analytics data becomes available." />
          )}
        </AdminSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminSectionCard title="Trend scores" description="Simple trend cards are useful when chart density should stay low.">
          {reportCards.length ? (
            <AdminSparkBars items={reportCards} />
          ) : (
            <AdminEmptyState compact title="No report scorecards" description="Weekly scorecards will appear once enough records exist for aggregation." />
          )}
        </AdminSectionCard>

        <AdminSectionCard title="Platform performance summary" description="These report cards frame the story behind the metrics.">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
              <BarChart3 className="h-5 w-5 text-sky-200" />
              <p className="mt-4 font-medium text-white">Growth is broad-based</p>
              <p className="mt-2 text-sm text-slate-400">User acquisition and job creation are rising together across multiple campuses.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
              <LineChart className="h-5 w-5 text-emerald-200" />
              <p className="mt-4 font-medium text-white">Revenue quality is improving</p>
              <p className="mt-2 text-sm text-slate-400">Growth is increasingly driven by retained users rather than one-off transactions.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
              <TrendingUp className="h-5 w-5 text-violet-200" />
              <p className="mt-4 font-medium text-white">Retention remains healthy</p>
              <p className="mt-2 text-sm text-slate-400">Completed sessions and trusted tutors continue to lift repeat marketplace usage.</p>
            </div>
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
