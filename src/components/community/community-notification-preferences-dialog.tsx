"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  getCommunityNotificationPreferences,
  setCommunityNotificationPreferences,
  setGranularToggles,
  type DigestOption,
} from "@/data/community-notification-preferences"
import { mockCommunities } from "@/data/mock-communities"
import { getCreatedCommunities } from "@/data/community-created-storage"
import { Bell, Mail } from "lucide-react"

const STORAGE_JOINED = "community_joined_ids"

function loadJoinedIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_JOINED)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

interface CommunityNotificationPreferencesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DIGEST_OPTIONS: { value: DigestOption; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "daily", label: "Daily digest" },
  { value: "weekly", label: "Weekly digest" },
]

export function CommunityNotificationPreferencesDialog({
  open,
  onOpenChange,
}: CommunityNotificationPreferencesDialogProps) {
  const [digest, setDigest] = useState<DigestOption>("off")
  const [perCommunity, setPerCommunity] = useState<Record<string, boolean>>({})
  const [mentionsOnly, setMentionsOnly] = useState(false)
  const [repliesOnly, setRepliesOnly] = useState(false)
  const [newEvents, setNewEvents] = useState(true)

  useEffect(() => {
    if (!open) return
    const prefs = getCommunityNotificationPreferences()
    setDigest(prefs.digest)
    setPerCommunity(prefs.perCommunity)
    setMentionsOnly(prefs.mentionsOnly ?? false)
    setRepliesOnly(prefs.repliesOnly ?? false)
    setNewEvents(prefs.newEvents !== false)
  }, [open])

  const joinedIds = typeof window !== "undefined" ? loadJoinedIds() : []
  const allCommunities = [
    ...mockCommunities,
    ...getCreatedCommunities().filter((c) => !mockCommunities.some((m) => m.id === c.id)),
  ]
  const myCommunities = allCommunities.filter((c) => joinedIds.includes(c.id))

  const handleDigestChange = (value: DigestOption) => {
    setDigest(value)
    setCommunityNotificationPreferences({ digest: value, perCommunity, mentionsOnly, repliesOnly, newEvents })
  }

  const handleCommunityToggle = (communityId: string, enabled: boolean) => {
    const next = { ...perCommunity, [communityId]: enabled }
    setPerCommunity(next)
    setCommunityNotificationPreferences({ digest, perCommunity: next, mentionsOnly, repliesOnly, newEvents })
  }

  const handleGranular = (key: "mentionsOnly" | "repliesOnly" | "newEvents", value: boolean) => {
    if (key === "mentionsOnly") setMentionsOnly(value)
    else if (key === "repliesOnly") setRepliesOnly(value)
    else setNewEvents(value)
    setGranularToggles({ [key]: value })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
            Notification preferences
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          <div>
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4" />
              Digest
            </Label>
            <select
              value={digest}
              onChange={(e) => handleDigestChange(e.target.value as DigestOption)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F7377] dark:focus:ring-teal-500"
            >
              {DIGEST_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Get a summary of mentions, replies, and activity instead of instant notifications.
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Activity
            </Label>
            <div className="space-y-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">@Mentions only</span>
                <Switch checked={mentionsOnly} onCheckedChange={(v) => handleGranular("mentionsOnly", v)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Replies to my posts</span>
                <Switch checked={repliesOnly} onCheckedChange={(v) => handleGranular("repliesOnly", v)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">New events</span>
                <Switch checked={newEvents} onCheckedChange={(v) => handleGranular("newEvents", v)} />
              </div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Notify me for
            </Label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Choose which communities can send you notifications.
            </p>
            {myCommunities.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-2">
                Join communities to see per-community options.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 p-2">
                {myCommunities.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-3 py-2 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {c.name}
                    </span>
                    <Switch
                      checked={perCommunity[c.id] ?? true}
                      onCheckedChange={(checked) => handleCommunityToggle(c.id, checked)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
