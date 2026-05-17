"use client";

import { useState } from "react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { MetricCard, PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { mutateWorkspace, useWorkspace } from "@/components/dashboard/useWorkspace";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Landmark, Smartphone, Wallet } from "lucide-react";

export default function WalletPage() {
  const { data, reload } = useWorkspace();
  const [amount, setAmount] = useState("");
  const [feedback, setFeedback] = useState("");

  async function requestWithdrawal() {
    try {
      await mutateWorkspace("withdrawFunds", { amount });
      setFeedback("Withdrawal request submitted.");
      setAmount("");
      reload();
    } catch (err) {
      setFeedback(err.message);
    }
  }

  const wallet = data?.wallet;

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Wallet"
          title="Payout methods and transaction history"
          description="Manage EcoCash and bank payout placeholders for Zimbabwe, review recent transactions, and submit a withdrawal request."
        />

        {feedback ? <StatusPill tone="success">{feedback}</StatusPill> : null}

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Available balance" value={`$${wallet?.availableBalance?.toFixed(2) || "0.00"}`} helper="Ready to withdraw" icon={Wallet} accent="primary" />
          <MetricCard label="Pending balance" value={`$${wallet?.pendingBalance?.toFixed(2) || "0.00"}`} helper="Still processing" icon={Landmark} accent="sky" />
          <MetricCard label="Verification" value={wallet?.verificationStatus || "Pending"} helper="Payout readiness status" icon={Smartphone} accent="emerald" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <SectionCard title="Payout methods" description="Zimbabwe-focused starter payout methods with verification placeholders.">
            <div className="space-y-4">
              {(wallet?.methods || []).map((method) => (
                <div key={method.id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-semibold text-white">{method.label}</p>
                      <p className="mt-1 text-sm text-slate-400">{method.details}</p>
                    </div>
                    <div className="flex gap-3">
                      {method.isPrimary ? <StatusPill tone="success">Primary</StatusPill> : null}
                      <StatusPill tone="warning">{method.status}</StatusPill>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Withdraw funds" description="Starter withdrawal flow backed by the workspace store.">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Amount</label>
                <Input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
              </div>
              <Button onClick={requestWithdrawal} className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                Request withdrawal
              </Button>
              <div className="space-y-3">
                {(wallet?.withdrawals || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                    <div>
                      <p className="font-medium text-white">${Number(item.amount).toFixed(2)}</p>
                      <p className="text-sm text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <StatusPill tone="warning">{item.status}</StatusPill>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </WorkspaceShell>
  );
}
