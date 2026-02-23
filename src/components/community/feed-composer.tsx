"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { SubGroup } from "@/types/community"
import { Image, Video, FileText, Send } from "lucide-react"

export interface MentionableUser {
  id: string
  displayName: string
}

interface FeedComposerProps {
  channels: SubGroup[]
  defaultChannelId?: string
  onPost?: (content: string, channelId: string, mentionedUserIds?: string[]) => void
  placeholder?: string
  /** Members to show in @mention dropdown (e.g. community members). */
  mentionableUsers?: MentionableUser[]
}

/** Parse @DisplayName segments from content (supports names with spaces). */
export function parseMentionedNames(content: string, mentionableUsers: MentionableUser[]): string[] {
  if (!mentionableUsers.length) return []
  const names: string[] = []
  const byLength = [...mentionableUsers].sort((a, b) => b.displayName.length - a.displayName.length)
  let pos = 0
  while ((pos = content.indexOf("@", pos)) !== -1) {
    const after = content.slice(pos + 1)
    for (const u of byLength) {
      const rest = after.startsWith(u.displayName) ? after.slice(u.displayName.length) : null
      if (rest !== null && (rest === "" || /[\s\n,.)]/.test(rest[0]))) {
        names.push(u.displayName)
        break
      }
    }
    pos += 1
  }
  return [...new Set(names)]
}

export function FeedComposer({
  channels,
  defaultChannelId,
  onPost,
  placeholder = "Share an update with the community…",
  mentionableUsers = [],
}: FeedComposerProps) {
  const [content, setContent] = useState("")
  const [channelId, setChannelId] = useState(defaultChannelId ?? channels.find((c) => c.kind === "general")?.id ?? channels[0]?.id ?? "")
  const [posting, setPosting] = useState(false)
  const [mentionOpen, setMentionOpen] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionStart, setMentionStart] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const generalAndChannels = channels.filter((c) => c.kind === "general" || c.kind === "channel")

  const filteredMentions = mentionableUsers.filter((u) =>
    u.displayName.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  useEffect(() => {
    if (!content || mentionableUsers.length === 0) {
      setMentionOpen(false)
      return
    }
    const i = content.lastIndexOf("@")
    if (i === -1) {
      setMentionOpen(false)
      return
    }
    const after = content.slice(i + 1)
    const space = after.search(/\s|\n/)
    const query = space === -1 ? after : after.slice(0, space)
    setMentionQuery(query)
    setMentionStart(i)
    setMentionOpen(true)
  }, [content, mentionableUsers.length])

  const insertMention = (displayName: string) => {
    const before = content.slice(0, mentionStart)
    const afterAt = content.slice(mentionStart + 1)
    const space = afterAt.search(/\s|\n/)
    const rest = space === -1 ? afterAt : afterAt.slice(space)
    setContent(before + "@" + displayName + (rest.startsWith(" ") ? rest : " " + rest))
    setMentionOpen(false)
    textareaRef.current?.focus()
  }

  const handleSubmit = () => {
    const text = content.trim()
    if (!text) return
    setPosting(true)
    const names = parseMentionedNames(text, mentionableUsers)
    const mentionedUserIds = mentionableUsers
      .filter((u) => names.includes(u.displayName))
      .map((u) => u.id)
    onPost?.(text, channelId, mentionedUserIds)
    setContent("")
    setMentionOpen(false)
    setPosting(false)
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-4 relative">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (mentionOpen && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Escape")) {
            e.preventDefault()
            if (e.key === "Escape") setMentionOpen(false)
          }
        }}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F7377] dark:focus:ring-teal-500"
        aria-label="Post content. Type @ to mention a member."
      />
      {mentionOpen && filteredMentions.length > 0 && (
        <div className="absolute left-4 right-4 mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg py-1 z-[100] max-h-40 overflow-y-auto">
          {filteredMentions.slice(0, 8).map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => insertMention(u.displayName)}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              @{u.displayName}
            </button>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {mentionableUsers.length > 0 && (
            <span className="text-xs text-slate-400 dark:text-slate-500 self-center mr-1" title="Mention members in your post">
              @ to mention
            </span>
          )}
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Add image"
          >
            <Image className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Add video"
          >
            <Video className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Add document"
          >
            <FileText className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {generalAndChannels.length > 1 && (
            <select
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F7377]"
            >
              {generalAndChannels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  #{ch.name}
                </option>
              ))}
            </select>
          )}
          <Button
            size="sm"
            className="gs-gradient text-white rounded-lg"
            onClick={handleSubmit}
            disabled={!content.trim() || posting}
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}
