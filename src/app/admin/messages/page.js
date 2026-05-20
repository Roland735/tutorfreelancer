import { SearchCode, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  AdminConversationCard,
  AdminEmptyState,
  AdminPageHeader,
  AdminSectionCard,
  AdminToneBadge,
} from "@/components/admin/AdminUI";
import { getAdminMessagesData } from "@/lib/admin-data.server";

export default async function AdminMessagesPage() {
  const { conversations } = await getAdminMessagesData();
  const activeConversation = conversations[0];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Messages"
        title="Inbox-style moderation for dispute-only chats"
        description="Monitor flagged conversations, review dispute evidence, and keep moderation access tightly scoped to serious cases."
        actions={
          <>
            <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              <SearchCode className="mr-2 h-4 w-4" />
              Search conversations
            </Button>
            <Button className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Review escalations
            </Button>
          </>
        }
      />

      {activeConversation ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <AdminSectionCard title="Flagged inbox" description="A compact queue helps moderators find the highest-risk chat first.">
            <div className="space-y-4">
              {conversations.map((conversation, index) => (
                <AdminConversationCard key={conversation.id} conversation={conversation} active={index === 0} />
              ))}
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title={activeConversation.subject}
            description={activeConversation.participants}
            action={<AdminToneBadge tone={activeConversation.status === "Escalated" ? "danger" : "warning"}>{activeConversation.reason}</AdminToneBadge>}
          >
            <div className="space-y-3">
              {activeConversation.messages.map((message) => (
                <div key={message} className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4 text-sm leading-7 text-slate-300">
                  {message}
                </div>
              ))}
            </div>
          </AdminSectionCard>
        </div>
      ) : (
        <AdminEmptyState
          title="No conversations found"
          description="Message moderation data will appear here once users exchange messages on the platform."
        />
      )}

      <AdminSectionCard title="No new disputes" description="A clean empty state keeps the moderation inbox from feeling noisy when queues are calm.">
        <AdminEmptyState
          compact
          title="No unresolved low-priority chats"
          description="When only severe or disputed conversations are shown, quiet periods should still feel polished and intentional."
        />
      </AdminSectionCard>
    </div>
  );
}
