import { Lock, Settings2, ShieldCheck } from "lucide-react";
import AdminMutationButton from "@/components/admin/AdminMutationButton";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminSectionCard,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminSettingsData } from "@/lib/admin-data.server";

export default async function AdminSettingsPage() {
  const { roleDistribution, verificationDistribution, financeSnapshot, securitySnapshot } =
    await getAdminSettingsData();
  const sections = [...roleDistribution, ...verificationDistribution];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Settings"
        title="Platform rules, security, and operating preferences"
        description="Manage roles, approval rules, commissions, notifications, security controls, branding, and maintenance placeholders from a modular settings hub."
        actions={
          <>
            <AdminMutationButton
              entity="platformSetting"
              action="save"
              id="commission-policy"
              payload={{ value: { commissionRate: 12, payoutDelayDays: 2 } }}
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            >
              Save draft policy
            </AdminMutationButton>
            <AdminMutationButton
              entity="platformSetting"
              action="save"
              id="maintenance-mode"
              payload={{ value: { enabled: false, banner: "Platform operating normally" } }}
              className="rounded-full bg-white text-slate-950 hover:bg-emerald-300"
            >
              Publish settings plan
            </AdminMutationButton>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {sections.length ? (
          sections.map((group, index) => (
            <AdminSectionCard
              key={`${group.title}-${index}`}
              title={group.title}
              description={group.summary}
              action={<AdminToneBadge tone={index % 2 === 0 ? "sky" : "success"}>Live snapshot</AdminToneBadge>}
            >
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </AdminSectionCard>
          ))
        ) : (
          <AdminEmptyState
            title="No settings snapshot data"
            description="Role and verification distributions will appear here once users and tutor profiles exist."
          />
        )}
      </div>

      <AdminSectionCard title="System posture" description="A compact footer panel reinforces security and maintenance awareness.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
            <ShieldCheck className="h-5 w-5 text-emerald-200" />
            <p className="mt-4 font-medium text-white">Future RBAC ready</p>
            <p className="mt-2 text-sm text-slate-400">{securitySnapshot[0] || "Admin access metrics will appear here."}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
            <Lock className="h-5 w-5 text-sky-200" />
            <p className="mt-4 font-medium text-white">Security-first defaults</p>
            <p className="mt-2 text-sm text-slate-400">{securitySnapshot[1] || "Security signals will appear here."}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
            <Settings2 className="h-5 w-5 text-violet-200" />
            <p className="mt-4 font-medium text-white">Finance and maintenance snapshot</p>
            <p className="mt-2 text-sm text-slate-400">{financeSnapshot[0] || "Finance metrics will appear here."}</p>
          </div>
        </div>
      </AdminSectionCard>
    </div>
  );
}
