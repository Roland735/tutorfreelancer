"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Info, Paperclip, Send } from "lucide-react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";
import { EmptyState, PageIntro, SectionCard, StatusPill } from "@/components/dashboard/WorkspaceUI";
import { mutateWorkspace, useWorkspace } from "@/components/dashboard/useWorkspace";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";

export default function MessageThreadPage() {
  const { id } = useParams();
  const { data, loading, error, reload } = useWorkspace(`conversationId=${id}`);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");

  const activeConversation = useMemo(
    () => data?.messages?.conversations?.find((item) => item.id === id),
    [data, id]
  );

  async function sendMessage(event) {
    event.preventDefault();

    if (!message.trim() || !activeConversation?.participant?.id) {
      return;
    }

    try {
      await mutateWorkspace("sendMessage", {
        conversationId: id,
        receiverId: activeConversation.participant.id,
        content: message,
      });
      setMessage("");
      setFeedback("Message sent.");
      reload();
    } catch (err) {
      setFeedback(err.message);
    }
  }

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Chat"
          title={activeConversation ? `Conversation with ${activeConversation.participant.name}` : "Conversation"}
          description="Use the focused chat layout for messages, attachment placeholders, and a clean student-first thread."
        />

        {feedback ? <StatusPill tone="success">{feedback}</StatusPill> : null}

        <div className="grid gap-4 xl:grid-cols-[1fr_0.32fr]">
          <SectionCard title="Thread" description="Messages appear in chronological order for faster collaboration.">
            {loading ? (
              <div className="text-slate-300">Loading conversation...</div>
            ) : error ? (
              <EmptyState title="Unable to load conversation" description={error} ctaHref="/messages" ctaLabel="Back to inbox" />
            ) : !activeConversation ? (
              <EmptyState title="Conversation not found" description="Pick another chat from the inbox list." ctaHref="/messages" ctaLabel="Go to inbox" />
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {(data?.messages?.thread || []).map((item) => {
                    const mine = item.senderId === data?.profileSummary?.id;

                    return (
                      <div key={item.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-3xl px-4 py-3 ${mine ? "bg-emerald-400 text-slate-950" : "border border-white/10 bg-slate-950/60 text-white"}`}>
                          <p className="text-sm leading-6">{item.content}</p>
                          <p className={`mt-2 text-xs ${mine ? "text-slate-700" : "text-slate-400"}`}>
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={sendMessage} className="flex gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-3">
                  <Button type="button" variant="outline" className="rounded-2xl border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message..." className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
                  <Button type="submit" className="rounded-2xl bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Conversation info" description="Useful context and placeholders for richer messaging tools.">
            {activeConversation ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                  <Avatar src={activeConversation.participant.avatar} alt={activeConversation.participant.name} fallback={activeConversation.participant.name.charAt(0)} />
                  <div>
                    <p className="font-medium text-white">{activeConversation.participant.name}</p>
                    <p className="text-sm text-slate-400">{activeConversation.participant.university || "University user"}</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                  <div className="mb-3 flex items-center gap-2 font-medium text-white">
                    <Info className="h-4 w-4 text-sky-300" />
                    Chat helpers
                  </div>
                  <p className="leading-6">Attachment uploads and typing indicators are included as UI placeholders and can be connected to real-time transport later.</p>
                </div>
                <Button asChild variant="outline" className="w-full rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                  <Link href="/messages">Back to inbox</Link>
                </Button>
              </div>
            ) : null}
          </SectionCard>
        </div>
      </div>
    </WorkspaceShell>
  );
}
