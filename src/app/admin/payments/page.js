import { Banknote, CircleDollarSign, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminMutationButton from "@/components/admin/AdminMutationButton";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminErrorState,
  AdminPageHeader,
  AdminSectionCard,
  AdminStatsGrid,
  AdminToolbar,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminPaymentsData } from "@/lib/admin-data.server";

export default async function AdminPaymentsPage() {
  const { rows, payoutBatches } = await getAdminPaymentsData();
  const columns = [
    { key: "id", label: "Transaction" },
    { key: "tutor", label: "Tutor" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "fee", label: "Platform fee" },
    { key: "method", label: "Method" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <AdminToneBadge tone={row.status === "Processed" ? "success" : row.status === "Queued" ? "warning" : row.status === "Review" ? "danger" : "neutral"}>
          {row.status}
        </AdminToneBadge>
      ),
    },
    { key: "date", label: "Date" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <AdminMutationButton
            entity="payment"
            action="markProcessed"
            id={row.id}
            variant="ghost"
            className="h-9 rounded-full text-slate-200 hover:bg-white/[0.04]"
          >
            Process
          </AdminMutationButton>
          <AdminMutationButton
            entity="payment"
            action="markReview"
            id={row.id}
            variant="outline"
            className="h-9 rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
          >
            Review
          </AdminMutationButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Payments"
        title="Commissions, payouts, and settlement operations"
        description="Track tutor payouts, platform fees, transaction states, and operational exceptions in one clean financial workspace."
        actions={
          <>
            <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              Mark payout processed
            </Button>
            <Button className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
              Export payout history
            </Button>
          </>
        }
      />

      <AdminStatsGrid items={payoutBatches} icons={[Banknote, Wallet, CircleDollarSign]} />

      <AdminSectionCard title="Transaction detail view" description="Ready for payout status, tutor filters, amount ranges, and date windows.">
        <div className="space-y-5">
          <AdminToolbar
            searchPlaceholder="Search transaction ID, tutor, or payout method..."
            filters={[
              {
                label: "Status",
                options: [
                  { value: "all", label: "All statuses" },
                  { value: "processed", label: "Processed" },
                  { value: "queued", label: "Queued" },
                  { value: "review", label: "Under review" },
                ],
              },
              {
                label: "Method",
                options: [
                  { value: "all", label: "All methods" },
                  { value: "bank", label: "Bank transfer" },
                  { value: "ecocash", label: "EcoCash" },
                  { value: "platform", label: "Platform fee" },
                ],
              },
            ]}
          />
          {rows.length ? (
            <AdminDataTable
              columns={columns}
              rows={rows}
              emptyTitle="No payments found"
              emptyDescription="This table can collapse into an empty state when date and status filters narrow the range."
            />
          ) : (
            <AdminEmptyState
              compact
              title="No payments found"
              description="Transaction rows will appear here once the platform records tutoring payments."
            />
          )}
        </div>
      </AdminSectionCard>

      <AdminErrorState
        title="Payout reconciliation integration pending"
        description="A live reconciliation endpoint can populate settlement errors, webhook mismatches, and retry options here."
      />
    </div>
  );
}
