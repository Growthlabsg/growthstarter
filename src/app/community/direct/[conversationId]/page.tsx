"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getDMConversations, getDMMessages, sendDMMessage, markDMConversationRead } from "@/data/direct-messages-storage"
import type { DMConversation, DMMessage } from "@/types/direct-messages"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Send } from "lucide-react"

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
}

function conversationTitle(c: DMConversation): string {
  if (c.name) return c.name
  const others = c.participants.filter((p) => p.userId !== "current-user")
  if (others.length === 0) return "You"
  if (others.length === 1) return others[0].userName ?? "Member"
  return others.map((p) => p.userName ?? "Member").join(", ")
}

export default function DMConversationPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params?.conversationId as string
  const [conversation, setConversation] = useState<DMConversation | null>(null)
  const [messages, setMessages] = useState<DMMessage[]>([])
  const [draft, setDraft] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = getDMConversations()
    const conv = list.find((c) => c.id === conversationId)
    if (!conv) {
      router.replace("/community/direct")
      return
    }
    setConversation(conv)
    setMessages(getDMMessages(conversationId))
    markDMConversationRead(conversationId)
  }, [conversationId, router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const onUpdate = () => {
      if (conversationId) {
        setMessages(getDMMessages(conversationId))
        const list = getDMConversations()
        const conv = list.find((c) => c.id === conversationId)
        if (conv) setConversation(conv)
      }
    }
    window.addEventListener("community-dm-updated", onUpdate)
    return () => window.removeEventListener("community-dm-updated", onUpdate)
  }, [conversationId])

  const handleSend = () => {
    const text = draft.trim()
    if (!text || !conversationId) return
    sendDMMessage(conversationId, text)
    setDraft("")
    setMessages(getDMMessages(conversationId))
  }

  if (!conversation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-slate-500">Loading…</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex flex-col h-[calc(100vh-7rem)]">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Button variant="ghost" size="icon" className="rounded-full shrink-0" asChild>
          <Link href="/community/direct">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="font-semibold text-slate-900 dark:text-white truncate">
          {conversationTitle(conversation)}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8 text-sm">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.authorId === "current-user"
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
              >
                <img
                  src={msg.authorAvatar ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className={`min-w-0 max-w-[80%] ${isMe ? "text-right" : ""}`}>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                    {msg.authorName} · {formatTime(msg.createdAt)}
                  </p>
                  <div
                    className={`rounded-xl px-3 py-2 text-sm ${
                      isMe
                        ? "bg-[#0F7377] dark:bg-teal-600 text-white ml-auto"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 shrink-0">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message…"
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F7377] dark:focus:ring-teal-500"
        />
        <Button
          size="icon"
          className="rounded-xl gs-gradient text-white shrink-0"
          onClick={handleSend}
          disabled={!draft.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
