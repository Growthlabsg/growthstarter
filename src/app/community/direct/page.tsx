"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getDMConversations } from "@/data/direct-messages-storage"
import type { DMConversation } from "@/types/direct-messages"
import { MessageCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffM = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffM < 1) return "Just now"
  if (diffM < 60) return `${diffM}m ago`
  if (diffH < 24) return `${diffH}h ago`
  if (diffD === 1) return "Yesterday"
  if (diffD < 7) return `${diffD}d ago`
  return d.toLocaleDateString()
}

function conversationTitle(c: DMConversation): string {
  if (c.name) return c.name
  const others = c.participants.filter((p) => p.userId !== "current-user")
  if (others.length === 0) return "You"
  if (others.length === 1) return others[0].userName ?? "Member"
  return others.map((p) => p.userName ?? "Member").join(", ")
}

function conversationAvatar(c: DMConversation): string | undefined {
  const others = c.participants.filter((p) => p.userId !== "current-user")
  if (others.length === 1 && others[0].userAvatar) return others[0].userAvatar
  return undefined
}

export default function DirectMessagesPage() {
  const [conversations, setConversations] = useState<DMConversation[]>([])

  const refresh = () => {
    setConversations(getDMConversations())
  }

  useEffect(() => {
    refresh()
    const onUpdate = () => refresh()
    window.addEventListener("community-dm-updated", onUpdate)
    return () => window.removeEventListener("community-dm-updated", onUpdate)
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold gs-gradient-text flex items-center gap-2">
            <MessageCircle className="h-7 w-7" />
            Messages
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            1:1 and small group conversations with other members.
          </p>
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
          <MessageCircle className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No conversations yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            Start a conversation from a member&apos;s profile in any community. Click &quot;Message&quot; to send a direct message.
          </p>
          <Button asChild variant="outline" className="rounded-xl" size="sm">
            <Link href="/community/browse">Browse communities</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/community/direct/${c.id}`}
              className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="relative shrink-0">
                {c.participantIds.length === 2 && conversationAvatar(c) ? (
                  <img
                    src={conversationAvatar(c)}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#0F7377]/20 dark:bg-teal-500/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#0F7377] dark:text-teal-400" />
                  </div>
                )}
                {(c.unreadCount ?? 0) > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center px-1">
                    {c.unreadCount! > 99 ? "99+" : c.unreadCount}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 dark:text-white truncate">
                  {conversationTitle(c)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {c.lastMessageAuthorId === "current-user" && "You: "}
                  {c.lastMessagePreview ?? "No messages yet"}
                </p>
              </div>
              <span className="text-xs text-slate-400 shrink-0">
                {formatTime(c.lastMessageAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
