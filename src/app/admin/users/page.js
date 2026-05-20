import Link from "next/link";
import { CheckCheck, Download, Shield, UserCog } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminMutationButton from "@/components/admin/AdminMutationButton";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
  AdminSectionCard,
  AdminStatsGrid,
  AdminToolbar,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminUsersData } from "@/lib/admin-data.server";

export default async function AdminUsersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { rows, quickStats } = await getAdminUsersData(resolvedSearchParams || {});

  const columns = [
    {
      key: "name",
      label: "User",
      render: (row) => (
        <div>
          <Link href={`/admin/users/${row.id}`} className="font-medium text-white transition hover:text-emerald-200">
            {row.name}
          </Link>
          <p className="mt-1 text-xs text-slate-400">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => <span className="capitalize">{row.role}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <AdminToneBadge
          tone={
            row.status === "Verified" || row.status === "Active"
              ? "success"
              : row.status === "Suspended"
                ? "danger"
                : "warning"
          }
        >
          {row.status}
        </AdminToneBadge>
      ),
    },
    { key: "verification", label: "Verification" },
    { key: "university", label: "University" },
    { key: "lastSeen", label: "Last seen" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="ghost" className="h-9 rounded-full text-slate-200 hover:bg-white/[0.04]">
            <Link href={`/admin/users/${row.id}`}>View</Link>
          </Button>
          <AdminMutationButton
            entity="user"
            action={row.status === "Suspended" ? "setStatus" : "setStatus"}
            id={row.id}
            payload={{ status: row.status === "Suspended" ? "active" : "suspended" }}
            variant="outline"
            className="h-9 rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
            confirmText={`Confirm ${row.status === "Suspended" ? "reactivating" : "suspending"} ${row.name}?`}
          >
            {row.status === "Suspended" ? "Activate" : "Suspend"}
          </AdminMutationButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Users"
        title="Students and tutors across the marketplace"
        description="Search, segment, and moderate accounts with quick stats, route-safe detail views, bulk action controls, and university-aware filtering."
        actions={
          <>
            <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              <Download className="mr-2 h-4 w-4" />
              Export list
            </Button>
            <Button className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
              <CheckCheck className="mr-2 h-4 w-4" />
              Run bulk action
            </Button>
          </>
        }
      />

      <AdminStatsGrid
        items={quickStats.map((item, index) => ({ ...item, tone: index % 2 ? "sky" : "emerald" }))}
        icons={[Shield, UserCog, Shield, CheckCheck, Shield]}
      />

      <AdminSectionCard
        title="User directory"
        description="This starter table is ready for backend search, filters, sorting, and row-level moderation actions."
      >
        <div className="space-y-5">
          <AdminToolbar
            searchPlaceholder="Search by name, email, university, or city..."
            searchValue={resolvedSearchParams?.q || ""}
            filters={[
              {
                label: "Role",
                name: "role",
                value: resolvedSearchParams?.role || "all",
                options: [
                  { value: "all", label: "All roles" },
                  { value: "students", label: "Students" },
                  { value: "tutors", label: "Tutors" },
                ],
              },
              {
                label: "Status",
                name: "status",
                value: resolvedSearchParams?.status || "all",
                options: [
                  { value: "all", label: "All statuses" },
                  { value: "active", label: "Active" },
                  { value: "review", label: "Pending review" },
                  { value: "suspended", label: "Suspended" },
                ],
              },
              {
                label: "University",
                name: "university",
                value: resolvedSearchParams?.university || "all",
                options: [
                  { value: "all", label: "All universities" },
                  { value: "uz", label: "University of Zimbabwe" },
                  { value: "nust", label: "NUST" },
                  { value: "msu", label: "MSU" },
                ],
              },
            ]}
            actions={<AdminToneBadge tone="sky">{rows.length} matching accounts</AdminToneBadge>}
          />
          {rows.length ? (
            <AdminDataTable
              columns={columns}
              rows={rows}
              emptyTitle="No user results"
              emptyDescription="When live filters return nothing, an empty state can guide admins toward broader search criteria."
            />
          ) : (
            <AdminEmptyState
              compact
              title="No users found"
              description="Accounts will appear here once real user records are present in MongoDB."
            />
          )}
        </div>
      </AdminSectionCard>
    </div>
  );
}
