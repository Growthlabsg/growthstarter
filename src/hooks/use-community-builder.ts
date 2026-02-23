"use client"

import { useState, useEffect, useCallback } from "react"
import type { SubGroup, CommunityMember, CommunityMemberRole } from "@/types/community"

const CHANNELS_KEY = "community_custom_channels"
const ROLES_KEY = "community_member_roles"
const STATUS_KEY = "community_member_status"

export type MemberStatusOverride = "kicked" | "banned" | "suspended"
export type MemberStatusEntry = {
  status: MemberStatusOverride
  suspendedUntil?: string
  banReason?: string
}

function loadStatusOverrides(communityId: string): Record<string, MemberStatusEntry> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(`${STATUS_KEY}_${communityId}`)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveStatusOverrides(communityId: string, overrides: Record<string, MemberStatusEntry>) {
  try {
    localStorage.setItem(`${STATUS_KEY}_${communityId}`, JSON.stringify(overrides))
  } catch {}
}

function loadChannels(communityId: string): SubGroup[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(`${CHANNELS_KEY}_${communityId}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveChannels(communityId: string, channels: SubGroup[]) {
  try {
    localStorage.setItem(`${CHANNELS_KEY}_${communityId}`, JSON.stringify(channels))
  } catch {}
}

function loadRoleOverrides(communityId: string): Record<string, CommunityMemberRole> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(`${ROLES_KEY}_${communityId}`)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveRoleOverrides(communityId: string, overrides: Record<string, CommunityMemberRole>) {
  try {
    localStorage.setItem(`${ROLES_KEY}_${communityId}`, JSON.stringify(overrides))
  } catch {}
}

export function useCommunityBuilder(communityId: string) {
  const [customChannels, setCustomChannels] = useState<SubGroup[]>([])
  const [roleOverrides, setRoleOverrides] = useState<Record<string, CommunityMemberRole>>({})
  const [statusOverrides, setStatusOverrides] = useState<Record<string, MemberStatusEntry>>({})

  useEffect(() => {
    setCustomChannels(loadChannels(communityId))
    setRoleOverrides(loadRoleOverrides(communityId))
    setStatusOverrides(loadStatusOverrides(communityId))
  }, [communityId])

  const addChannel = useCallback(
    (channel: Omit<SubGroup, "id" | "createdAt" | "updatedAt" | "memberCount">) => {
      const id = `custom-${Date.now()}`
      const now = new Date().toISOString()
      const newChannel: SubGroup = {
        ...channel,
        id,
        memberCount: 0,
        createdAt: now,
        updatedAt: now,
      }
      setCustomChannels((prev) => {
        const next = [...prev, newChannel]
        saveChannels(communityId, next)
        return next
      })
      return id
    },
    [communityId]
  )

  const removeChannel = useCallback(
    (channelId: string) => {
      setCustomChannels((prev) => {
        const next = prev.filter((c) => c.id !== channelId)
        saveChannels(communityId, next)
        return next
      })
    },
    [communityId]
  )

  const setMemberRole = useCallback(
    (userId: string, role: CommunityMemberRole) => {
      setRoleOverrides((prev) => {
        const next = { ...prev, [userId]: role }
        saveRoleOverrides(communityId, next)
        return next
      })
    },
    [communityId]
  )

  const kickMember = useCallback(
    (userId: string) => {
      setStatusOverrides((prev) => {
        const entry: MemberStatusEntry = { status: "kicked" }
        const next = { ...prev, [userId]: entry }
        saveStatusOverrides(communityId, next)
        return next
      })
    },
    [communityId]
  )

  const banMember = useCallback(
    (userId: string, reason?: string) => {
      setStatusOverrides((prev) => {
        const entry: MemberStatusEntry = { status: "banned", banReason: reason || undefined }
        const next = { ...prev, [userId]: entry }
        saveStatusOverrides(communityId, next)
        return next
      })
    },
    [communityId]
  )

  const suspendMember = useCallback(
    (userId: string, untilDate?: string) => {
      setStatusOverrides((prev) => {
        const entry: MemberStatusEntry = { status: "suspended", suspendedUntil: untilDate }
        const next = { ...prev, [userId]: entry }
        saveStatusOverrides(communityId, next)
        return next
      })
    },
    [communityId]
  )

  const restoreMember = useCallback(
    (userId: string) => {
      setStatusOverrides((prev) => {
        const next = { ...prev }
        delete next[userId]
        saveStatusOverrides(communityId, next)
        return next
      })
    },
    [communityId]
  )

  return {
    customChannels,
    addChannel,
    removeChannel,
    roleOverrides,
    setMemberRole,
    statusOverrides,
    kickMember,
    banMember,
    suspendMember,
    restoreMember,
  }
}

/** Merge mock members with role overrides for display. */
export function applyRoleOverrides(
  members: CommunityMember[],
  overrides: Record<string, CommunityMemberRole>
): CommunityMember[] {
  return members.map((m) => ({
    ...m,
    role: overrides[m.userId] ?? m.role,
  }))
}

/** Filter members for public list: exclude kicked and banned; optionally exclude suspended. */
export function filterMembersByStatus(
  members: CommunityMember[],
  statusOverrides: Record<string, MemberStatusEntry>,
  options: { includeSuspended?: boolean } = {}
): CommunityMember[] {
  return members.filter((m) => {
    const entry = statusOverrides[m.userId]
    if (!entry) return true
    if (entry.status === "kicked" || entry.status === "banned") return false
    if (entry.status === "suspended" && !options.includeSuspended) return false
    return true
  })
}

/** Check if user is banned in this community (for join guard). */
export function isUserBanned(communityId: string, userId: string): boolean {
  if (typeof window === "undefined") return false
  try {
    const raw = localStorage.getItem(`${STATUS_KEY}_${communityId}`)
    const overrides: Record<string, MemberStatusEntry> = raw ? JSON.parse(raw) : {}
    return overrides[userId]?.status === "banned"
  } catch {
    return false
  }
}
