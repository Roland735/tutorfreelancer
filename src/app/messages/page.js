"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Send,
} from "lucide-react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { EmptyState, PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { useWorkspace } from "@/components/dashboard/useWorkspace";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";

export default function MessagesPage() {
  const { data, loading, error } = useWorkspace();
  const [search, setSearch] = useState("");

  const conversations = useMemo(() => {
    return (data?.messages?.conversations || []).filter((item) => {
      const value = search.toLowerCase();
      return !value || item.participant.name.toLowerCase().includes(value);
    });
  }, [data, search]);

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Inbox"
          title="Messages and conversations"
          description="Search recent conversations, monitor unread activity, and jump into the full chat workspace on mobile or desktop."
        />

        <SectionCard title="Conversation list" description="Recent chats update from your authenticated workspace data.">
          <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations..." className="h-11 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-white" />
            </div>
            <StatusPill tone="sky">{data?.notifications?.unreadCount || 0} unread notifications</StatusPill>
          </div>

          {loading ? (
            <div className="text-slate-300">Loading messages...</div>
          ) : error ? (
            <EmptyState title="Unable to load messages" description={error} ctaHref="/dashboard" ctaLabel="Go to dashboard" />
          ) : conversations.length ? (
            <div className="grid gap-3">
              {conversations.map((conversation) => (
                <Link key={conversation.id} href={`/messages/${conversation.id}`} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-emerald-300/20 hover:bg-white/[0.06]">
                  <Avatar src={conversation.participant.avatar} alt={conversation.participant.name} fallback={conversation.participant.name.charAt(0)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="truncate font-medium text-white">{conversation.participant.name}</p>
                      {conversation.unreadCount ? <StatusPill tone="warning">{conversation.unreadCount} unread</StatusPill> : null}
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-400">{conversation.lastMessage}</p>
                  </div>
                  <Button size="sm" className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                    <Send className="mr-2 h-4 w-4" />
                    Open chat
                  </Button>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No conversations yet" description="Once you start applying, booking, and messaging on the platform, your inbox will fill up here." ctaHref="/jobs" ctaLabel="Browse jobs" />
          )}
        </SectionCard>
      </div>
    </WorkspaceShell>
  );
}
