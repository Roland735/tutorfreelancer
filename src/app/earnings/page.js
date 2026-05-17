"use client";

import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { EmptyState, MetricCard, PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { useWorkspace } from "@/components/dashboard/useWorkspace";
import { CircleDollarSign, Landmark, Wallet } from "lucide-react";

export default function EarningsPage() {
  const { data, loading, error } = useWorkspace();
  const earnings = data?.earnings;

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Revenue"
          title="Tutor earnings dashboard"
          description="Track total earnings, pending balances, payout history, and transaction placeholders for future downloads."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Total earnings" value={`$${earnings?.totalEarnings?.toFixed(2) || "0.00"}`} helper="All completed tutor payouts" icon={CircleDollarSign} accent="primary" />
          <MetricCard label="Pending balance" value={`$${earnings?.pendingBalance?.toFixed(2) || "0.00"}`} helper="Awaiting payout or release" icon={Wallet} accent="sky" />
          <MetricCard label="Paid out" value={`$${earnings?.paidOut?.toFixed(2) || "0.00"}`} helper="Successfully settled withdrawals" icon={Landmark} accent="emerald" />
        </div>

        <SectionCard title="Payout history" description="Starter transaction history with a placeholder path for downloadable exports.">
          {loading ? (
            <div className="text-slate-300">Loading earnings...</div>
          ) : error ? (
            <EmptyState title="Unable to load earnings" description={error} ctaHref="/dashboard" ctaLabel="Go to dashboard" />
          ) : earnings?.transactions?.length ? (
            <div className="space-y-4">
              {earnings.transactions.map((transaction) => (
                <div key={transaction._id} className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold text-white">{transaction.method || "Payout transaction"}</p>
                    <p className="mt-1 text-sm text-slate-400">{new Date(transaction.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill tone={transaction.status === "Completed" ? "success" : "warning"}>{transaction.status}</StatusPill>
                    <p className="font-semibold text-white">${transaction.netPayout?.toFixed(2) || "0.00"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No earnings yet" description="Once tutoring payments are completed, your payout history appears here." />
          )}
        </SectionCard>
      </div>
    </WorkspaceShell>
  );
}
