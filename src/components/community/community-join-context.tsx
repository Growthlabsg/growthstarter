"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

const STORAGE_JOINED = "community_joined_ids"
const STORAGE_CHANNELS_PREFIX = "community_channels_"

function loadJoinedIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_JOINED)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadJoinedChannels(communityId: string): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_CHANNELS_PREFIX + communityId)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

type CommunityJoinContextValue = {
  joinedCommunityIds: string[]
  joinCommunity: (id: string) => void
  leaveCommunity: (id: string) => void
  isMember: (communityId: string) => boolean
  joinedChannelIds: (communityId: string) => string[]
  joinChannel: (communityId: string, channelId: string) => void
  isChannelJoined: (communityId: string, channelId: string) => boolean
}

const CommunityJoinContext = createContext<CommunityJoinContextValue | null>(null)

export function CommunityJoinProvider({ children }: { children: React.ReactNode }) {
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>([])
  const [channelMap, setChannelMap] = useState<Record<string, string[]>>({})

  useEffect(() => {
    setJoinedCommunityIds(loadJoinedIds())
  }, [])

  const joinCommunity = useCallback((id: string) => {
    setJoinedCommunityIds((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      try {
        localStorage.setItem(STORAGE_JOINED, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const leaveCommunity = useCallback((id: string) => {
    setJoinedCommunityIds((prev) => {
      const next = prev.filter((x) => x !== id)
      try {
        localStorage.setItem(STORAGE_JOINED, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const isMember = useCallback(
    (communityId: string) => joinedCommunityIds.includes(communityId),
    [joinedCommunityIds]
  )

  const joinedChannelIds = useCallback(
    (communityId: string) => {
      if (channelMap[communityId]) return channelMap[communityId]
      return loadJoinedChannels(communityId)
    },
    [channelMap]
  )

  const joinChannel = useCallback((communityId: string, channelId: string) => {
    const key = STORAGE_CHANNELS_PREFIX + communityId
    setChannelMap((prev) => {
      const current = prev[communityId] ?? loadJoinedChannels(communityId)
      if (current.includes(channelId)) return prev
      const next = [...current, channelId]
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {}
      return { ...prev, [communityId]: next }
    })
  }, [])

  const isChannelJoined = useCallback(
    (communityId: string, channelId: string) => {
      const ids = channelMap[communityId] ?? loadJoinedChannels(communityId)
      return ids.includes(channelId)
    },
    [channelMap]
  )

  const value: CommunityJoinContextValue = {
    joinedCommunityIds,
    joinCommunity,
    leaveCommunity,
    isMember,
    joinedChannelIds: (cId) => channelMap[cId] ?? loadJoinedChannels(cId),
    joinChannel,
    isChannelJoined,
  }

  return (
    <CommunityJoinContext.Provider value={value}>
      {children}
    </CommunityJoinContext.Provider>
  )
}

export function useCommunityJoin() {
  const ctx = useContext(CommunityJoinContext)
  if (!ctx) {
    return {
      joinedCommunityIds: [],
      joinCommunity: () => {},
      leaveCommunity: () => {},
      isMember: () => false,
      joinedChannelIds: () => [] as string[],
      joinChannel: () => {},
      isChannelJoined: () => false,
    }
  }
  return ctx
}
