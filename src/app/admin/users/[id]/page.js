import { notFound } from "next/navigation";
import { RotateCcw, ShieldAlert, Trash2, UserRoundCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminMutationButton from "@/components/admin/AdminMutationButton";
import {
  AdminBreadcrumbCard,
  AdminKeyValueGrid,
  AdminPageHeader,
  AdminProfileSummary,
  AdminSectionCard,
  AdminTimeline,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminUserDetailData } from "@/lib/admin-data.server";

export default async function AdminUserDetailPage({ params }) {
  const { id } = await params;
  const data = await getAdminUserDetailData(id);

  if (!data) {
    notFound();
  }

  const { user, accountDetails, actions, reports, payments, auditTrail } = data;

  return (
    <div className="space-y-6">
      <AdminBreadcrumbCard
        items={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Users", href: "/admin/users" },
          { label: user.name },
        ]}
      />

      <AdminPageHeader
        eyebrow="User profile"
        title={`${user.name} account review`}
        description="Review identity, role, moderation history, payments, and activity before changing account state."
        actions={
          <>
            <AdminMutationButton
              entity="user"
              action="setRole"
              id={user.id}
              payload={{ role: user.role === "student" ? "tutor" : "student" }}
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            >
              <UserRoundCheck className="mr-2 h-4 w-4" />
              Toggle role
            </AdminMutationButton>
            <AdminMutationButton
              entity="user"
              action="resetAccess"
              id={user.id}
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset access
            </AdminMutationButton>
            <AdminMutationButton
              entity="user"
              action="setStatus"
              id={user.id}
              payload={{ status: user.status === "Suspended" ? "active" : "suspended" }}
              variant="outline"
              className="rounded-full border-rose-300/15 bg-rose-500/[0.08] text-rose-100 hover:bg-rose-500/[0.12]"
              confirmText={`Confirm ${user.status === "Suspended" ? "reactivating" : "suspending"} this account?`}
            >
              {user.status === "Suspended" ? "Activate account" : "Suspend account"}
            </AdminMutationButton>
          </>
        }
      />

      <AdminProfileSummary
        title={user.name}
        subtitle={`${user.role} from ${user.university}`}
        badge={
          <AdminToneBadge tone={user.status === "Suspended" ? "danger" : user.status === "Pending" ? "warning" : "success"}>
            {user.status}
          </AdminToneBadge>
        }
        meta={[user.city, user.verification, user.lastSeen]}
        helper={user.email}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSectionCard title="Account details" description="Starter detail blocks are mapped for future backend fields and policy checks.">
          <AdminKeyValueGrid items={accountDetails} />
        </AdminSectionCard>

        <AdminSectionCard title="Admin actions" description="A clean stack of next-best actions keeps moderation decisions deliberate.">
          <div className="space-y-3">
            {actions.map((action) => (
              <div key={action} className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">
                {action}
              </div>
            ))}
            <div className="rounded-[1.5rem] border border-amber-400/15 bg-amber-400/10 p-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-200" />
                <p className="font-medium text-white">Audit-safe workflow recommended</p>
              </div>
              <p className="mt-2 text-sm text-amber-100/80">
                Pair any destructive action with moderation notes, actor identity, and timestamped approval.
              </p>
            </div>
            <AdminMutationButton
              entity="user"
              action="delete"
              id={user.id}
              variant="outline"
              className="w-full rounded-full border-rose-300/15 bg-rose-500/[0.08] text-rose-100 hover:bg-rose-500/[0.12]"
              confirmText="Confirm marking this account as deleted?"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete account
            </AdminMutationButton>
          </div>
        </AdminSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminSectionCard title="Reports and payments" description="Trust signals and financial history help explain account health.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
              <p className="text-sm font-medium text-white">Reports</p>
              <div className="mt-3 space-y-3">
                {reports.map((item) => (
                  <p key={item} className="text-sm text-slate-400">{item}</p>
                ))}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4">
              <p className="text-sm font-medium text-white">Payments</p>
              <div className="mt-3 space-y-3">
                {payments.map((item) => (
                  <p key={item} className="text-sm text-slate-400">{item}</p>
                ))}
              </div>
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Audit trail" description="Every sensitive admin action belongs in a clear chronological log.">
          <AdminTimeline items={auditTrail} />
        </AdminSectionCard>
      </div>
    </div>
  );
}
