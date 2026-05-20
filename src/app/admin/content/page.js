import { Eye, Megaphone, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminMutationButton from "@/components/admin/AdminMutationButton";
import {
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
  AdminSectionCard,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminContentData } from "@/lib/admin-data.server";

export default async function AdminContentPage() {
  const { blogRows, announcementRows } = await getAdminContentData();
  const columns = [
    { key: "title", label: "Content" },
    { key: "type", label: "Type" },
    { key: "owner", label: "Owner" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <AdminToneBadge tone={row.status === "Published" ? "success" : row.status === "Draft" ? "neutral" : row.status === "Scheduled" ? "sky" : "warning"}>
          {row.status}
        </AdminToneBadge>
      ),
    },
    { key: "updatedAt", label: "Updated" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <AdminMutationButton
          entity="content"
          action={row.status === "Draft" ? "publish" : "draft"}
          id={row.id}
          variant="ghost"
          className="h-9 rounded-full text-slate-200 hover:bg-white/[0.04]"
        >
          {row.status === "Draft" ? "Publish" : "Move to draft"}
        </AdminMutationButton>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Content"
        title="Homepage, blog, FAQ, and announcement control"
        description="Manage copy, banners, blog posts, FAQs, and announcements with an editorial workflow that feels clean and operationally safe."
        actions={
          <>
            <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              <Eye className="mr-2 h-4 w-4" />
              Preview content
            </Button>
            <Button className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
              <PencilLine className="mr-2 h-4 w-4" />
              New announcement
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminSectionCard title="Content items" description="Starter rows for blog posts, homepage sections, banners, and status labels.">
          <AdminDataTable
            columns={columns}
            rows={blogRows}
            emptyTitle="No content items"
            emptyDescription="Use empty states to keep editorial modules feeling polished when no drafts exist yet."
          />
        </AdminSectionCard>

        <AdminSectionCard title="Campaign and preview workspace" description="Editors need a calm area for draft, publish, and content preview workflows.">
          <div className="space-y-4">
            {announcementRows.length ? (
              announcementRows.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-5">
                  <div className="flex items-center gap-3">
                    <Megaphone className="h-5 w-5 text-emerald-200" />
                    <p className="font-medium text-white">{item.title}</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">Live system announcement sourced from the notifications collection.</p>
                  <div className="mt-4 flex gap-3">
                    <AdminToneBadge tone="sky">{item.type}</AdminToneBadge>
                    <AdminToneBadge tone={item.status === "Unread" ? "warning" : "success"}>{item.status}</AdminToneBadge>
                  </div>
                </div>
              ))
            ) : (
              <AdminEmptyState
                compact
                title="No system announcements"
                description="Announcements will appear here when system notifications are created."
              />
            )}
            <AdminEmptyState
              compact
              title="No homepage content collection yet"
              description="Banners, FAQs, and homepage blocks still need dedicated database models before this area can be fully live."
            />
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
