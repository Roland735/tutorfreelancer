"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  Send, Paperclip, Smile, Search, Phone, Video,
  MoreVertical, Circle, Image as ImageIcon, FileText, ArrowLeft, Check, CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [activeChatId, setActiveChatId] = useState(1);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mock Data
  const conversations = [
    {
      id: 1,
      user: { name: "Sarah Jenkins", avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=10b981&color=fff", status: "online" },
      lastMessage: "That works for me! See you then.",
      timestamp: "10:30 AM",
      unread: 0
    },
    {
      id: 2,
      user: { name: "David Chen", avatar: "https://ui-avatars.com/api/?name=David+C&background=0ea5e9&color=fff", status: "offline" },
      lastMessage: "Can you send the assignment details?",
      timestamp: "Yesterday",
      unread: 2
    },
    {
      id: 3,
      user: { name: "Emily Wong", avatar: "https://ui-avatars.com/api/?name=Emily+W&background=8b5cf6&color=fff", status: "online" },
      lastMessage: "Thanks for the session!",
      timestamp: "Tue",
      unread: 0
    },
  ];

  const messages = {
    1: [
      { id: 1, sender: "me", text: "Hi Sarah, are we still on for today at 4 PM?", time: "10:15 AM", status: "read" },
      { id: 2, sender: "them", text: "Hey! Yes, absolutely.", time: "10:20 AM", status: "read" },
      { id: 3, sender: "them", text: "I've prepared some questions about the calculus problem set.", time: "10:21 AM", status: "read" },
      { id: 4, sender: "me", text: "Perfect. I'll bring some examples too.", time: "10:25 AM", status: "read" },
      { id: 5, sender: "them", text: "That works for me! See you then.", time: "10:30 AM", status: "read" },
    ],
    2: [
      { id: 1, sender: "them", text: "Hi, I'm interested in your React tutoring.", time: "Yesterday, 2:00 PM", status: "read" },
      { id: 2, sender: "me", text: "Great! What specific topics do you need help with?", time: "Yesterday, 2:15 PM", status: "delivered" },
      { id: 3, sender: "them", text: "Mainly hooks and context API.", time: "Yesterday, 2:30 PM", status: "read" },
      { id: 4, sender: "them", text: "Can you send the assignment details?", time: "Yesterday, 2:31 PM", status: "read" },
    ],
    3: [
      { id: 1, sender: "me", text: "Here are the notes from today.", time: "Tue, 5:00 PM", attachment: { type: "file", name: "Notes.pdf" }, status: "read" },
      { id: 2, sender: "them", text: "Thanks for the session!", time: "Tue, 5:05 PM", status: "read" },
    ]
  };

  const activeChat = conversations.find(c => c.id === activeChatId);
  const currentMessages = messages[activeChatId] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    // In a real app, this would send to backend
    console.log("Sending:", messageInput);
    setMessageInput("");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-6 flex gap-6 h-[calc(100vh-80px)] max-h-[900px]">

        {/* Left Panel - Conversation List */}
        <Card className={cn(
          "w-full md:w-1/3 lg:w-1/4 flex flex-col border-border overflow-hidden",
          mobileChatOpen ? 'hidden md:flex' : 'flex'
        )}>
          <div className="p-4 border-b border-border bg-card">
            <h2 className="text-xl font-bold font-heading mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto bg-card">
            {conversations.map(chat => (
              <div
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setMobileChatOpen(true);
                }}
                className={cn(
                  "p-4 border-b border-border cursor-pointer transition hover:bg-accent/50",
                  activeChatId === chat.id ? 'bg-accent/30 border-l-4 border-l-primary' : ''
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar src={chat.user.avatar} alt={chat.user.name} fallback={chat.user.name.charAt(0)} />
                    {chat.user.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={cn(
                        "font-medium truncate text-sm",
                        chat.unread > 0 ? 'text-foreground font-bold' : 'text-foreground/90'
                      )}>{chat.user.name}</h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{chat.timestamp}</span>
                    </div>
                    <p className={cn(
                      "text-sm truncate",
                      chat.unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                    )}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <Badge variant="default" className="ml-2 h-5 min-w-[20px] px-1 flex items-center justify-center">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Panel - Chat Area */}
        <Card className={cn(
          "w-full md:w-2/3 lg:w-3/4 flex flex-col border-border overflow-hidden",
          mobileChatOpen ? 'flex' : 'hidden md:flex'
        )}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex justify-between items-center bg-card shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden mr-1"
                    onClick={() => setMobileChatOpen(false)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="relative">
                    <Avatar src={activeChat.user.avatar} alt={activeChat.user.name} fallback={activeChat.user.name.charAt(0)} />
                    {activeChat.user.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground font-heading">{activeChat.user.name}</h3>
                    <span className="text-xs text-green-500 flex items-center gap-1 font-medium">
                      {activeChat.user.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" title="Call">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Video Call">
                    <Video className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" title="More Options">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-background/50">
                {currentMessages.map(msg => (
                  <div key={msg.id} className={cn("flex w-full", msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                      msg.sender === 'me'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card border border-border text-card-foreground rounded-bl-none'
                    )}>
                      {msg.attachment && (
                        <div className="flex items-center gap-3 bg-black/10 dark:bg-white/10 p-3 rounded-lg mb-2 backdrop-blur-sm">
                          <FileText className="w-8 h-8 opacity-80" />
                          <div>
                            <p className="text-sm font-medium underline cursor-pointer hover:opacity-80 transition">{msg.attachment.name}</p>
                            <p className="text-xs opacity-70">PDF Document</p>
                          </div>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className={cn(
                        "text-[10px] mt-1 flex justify-end items-center gap-1 opacity-70",
                        msg.sender === 'me' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      )}>
                        <span>{msg.time}</span>
                        {msg.sender === 'me' && (
                          <span>
                            {msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border bg-card">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                  <div className="flex gap-1 mb-1">
                    <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex-grow relative">
                    <Input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full pr-10 py-6 rounded-full"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-yellow-500"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg shrink-0 mb-px"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground bg-card/30">
              <div className="bg-muted p-6 rounded-full mb-4">
                <Send className="w-12 h-12 opacity-20" />
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground">Your Messages</h3>
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
