"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { CommunityProfile } from "@/components/community/community-profile"
import { useCommunityJoin } from "@/components/community/community-join-context"
import { useCommunityBuilder, applyRoleOverrides, filterMembersByStatus, isUserBanned } from "@/hooks/use-community-builder"
import { can } from "@/data/community-permissions"
import { getCreatedCommunities } from "@/data/community-created-storage"
import { addPendingJoinRequest } from "@/data/community-join-requests"
import { mockCommunities, mockSubGroups, mockCommunityPosts, mockCommunityMembers, mockCommunityResources, mockCommunityEvents } from "@/data/mock-communities"
import { getCreatedEvents, addCreatedEvent } from "@/data/community-events-storage"
import { awardPoints } from "@/data/community-gamification-storage"
import { getCreatedResources, addCreatedResource } from "@/data/community-resources-storage"
import { getGuidelinesOverride } from "@/data/community-guidelines-overrides"
import type { ChannelKind, CommunityEvent, CommunityResource } from "@/types/community"
import { ChevronLeft } from "lucide-react"

const WELCOME_KEY = "community_welcome"
const JOIN_REQUESTS_KEY = "community_join_requests"

export default function CommunitySlugPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params?.slug as string
  const [createdList, setCreatedList] = useState(getCreatedCommunities())
  useEffect(() => {
    setCreatedList(getCreatedCommunities())
  }, [])

  const allCommunities = useMemo(() => {
    const created = createdList.filter((c) => !mockCommunities.some((m) => m.id === c.id))
    return [...mockCommunities, ...created]
  }, [createdList])

  const communityFound = allCommunities.find((c) => c.slug === slug)
  const community = useMemo(() => {
    if (!communityFound) return undefined
    const isMock = mockCommunities.some((m) => m.id === communityFound.id)
    const guidelines =
      isMock ? (getGuidelinesOverride(communityFound.id) ?? communityFound.guidelines) : communityFound.guidelines
    return { ...communityFound, guidelines }
  }, [communityFound])
  const { isMember, joinCommunity, leaveCommunity, joinChannel, isChannelJoined } = useCommunityJoin()
  const { customChannels, addChannel, roleOverrides, statusOverrides } = useCommunityBuilder(community?.id ?? "")
  const [showWelcome, setShowWelcome] = useState(false)
  const [joinRequestedIds, setJoinRequestedIds] = useState<Set<string>>(new Set())
  const [createdEvents, setCreatedEvents] = useState<CommunityEvent[]>([])
  const [createdResources, setCreatedResources] = useState<CommunityResource[]>([])

  const handleCreateChannel = (payload: { name: string; description: string; kind: ChannelKind }) => {
    if (!community) return
    const channelSlug = payload.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || `channel-${Date.now()}`
    addChannel({
      communityId: community.id,
      slug: channelSlug,
      name: payload.name,
      description: payload.description,
      kind: payload.kind,
      createdBy: "current-user",
    })
    toast.success(`Channel "${payload.name}" created`)
  }

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(JOIN_REQUESTS_KEY) : null
      if (raw) setJoinRequestedIds(new Set(JSON.parse(raw)))
    } catch {}
  }, [])

  const member = community ? isMember(community.id) : false

  useEffect(() => {
    if (!community || !member) return
    const fromUrl = searchParams?.get("welcome") === "1"
    const fromStorage = typeof window !== "undefined" && sessionStorage.getItem(WELCOME_KEY) === community.id
    setShowWelcome(fromUrl || fromStorage)
  }, [community, member, searchParams])

  useEffect(() => {
    if (community) {
      setCreatedEvents(getCreatedEvents(community.id))
      setCreatedResources(getCreatedResources(community.id))
    }
  }, [community?.id])

  const events = useMemo(() => {
    if (!community) return []
    const mock = mockCommunityEvents.filter((e) => e.communityId === community.id)
    return [...mock, ...createdEvents].sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    )
  }, [community?.id, createdEvents])

  const resources = useMemo(() => {
    if (!community) return []
    const mock = mockCommunityResources.filter((r) => r.communityId === community.id)
    return [...mock, ...createdResources]
  }, [community?.id, createdResources])

  const handleJoinCommunity = () => {
    if (!community) return
    if (isUserBanned(community.id, "current-user")) {
      toast.error("You cannot join this community.")
      return
    }
    joinCommunity(community.id)
    if (typeof window !== "undefined") sessionStorage.setItem(WELCOME_KEY, community.id)
    toast.success(`You joined ${community.name}`)
  }

  const handleRequestToJoin = () => {
    if (!community) return
    addPendingJoinRequest(community.id, {
      userId: "current-user",
      userName: "You",
      requestedAt: new Date().toISOString(),
    })
    setJoinRequestedIds((prev) => {
      const next = new Set(prev)
      next.add(community.id)
      try {
        localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify([...next]))
      } catch {}
      return next
    })
    toast.success("Request sent. The community admin will review it.")
  }

  const handleJoinChannel = (channelId: string) => {
    if (!community) return
    const channel =
      mockSubGroups.find((sg) => sg.id === channelId && sg.communityId === community.id) ??
      customChannels.find((sg) => sg.id === channelId)
    joinChannel(community.id, channelId)
    toast.success(channel ? `Joined ${channel.name}` : "Joined channel")
  }

  if (!community) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Community not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">This community may have been removed or the link is wrong.</p>
        <Link href="/community/browse" className="inline-block mt-4 text-[#0F7377] dark:text-teal-400 font-medium">
          Browse communities
        </Link>
      </div>
    )
  }

  const subGroups = [
    ...mockSubGroups.filter((sg) => sg.communityId === community.id),
    ...customChannels,
  ]
  const posts = mockCommunityPosts.filter((p) => p.communityId === community.id)
  const membersRaw = applyRoleOverrides(
    mockCommunityMembers.filter((m) => m.communityId === community.id),
    roleOverrides
  )
  const members = filterMembersByStatus(membersRaw, statusOverrides, { includeSuspended: false })
  const currentUserRole = members.find((m) => m.userId === "current-user")?.role ?? "member"
  const isBuilder = community.ownerId === "current-user"

  const handleCreateEvent = (event: CommunityEvent) => {
    addCreatedEvent(event)
    setCreatedEvents(getCreatedEvents(community.id))
    awardPoints(community.id, "current-user", "event_created")
  }
  const handleCreateResource = (resource: CommunityResource) => {
    addCreatedResource(resource)
    setCreatedResources(getCreatedResources(community.id))
  }
  const canManageChannels = isBuilder || can(currentUserRole, "manage_channels")
  const canPinPosts = isBuilder || can(currentUserRole, "pin_posts")

  const getCommunitiesForMember = (userId: string) => {
    const communityIds = mockCommunityMembers
      .filter((m) => m.userId === userId)
      .map((m) => m.communityId)
    return allCommunities
      .filter((c) => communityIds.includes(c.id))
      .map((c) => ({ name: c.name, slug: c.slug }))
  }

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8">
      <Link
        href="/community/browse"
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 mb-6 min-h-[44px] items-center"
      >
        <ChevronLeft className="h-4 w-4 shrink-0" />
        <span>Back to directory</span>
      </Link>
      <CommunityProfile
        community={community}
        posts={posts}
        subGroups={subGroups}
        isMember={member}
        isBuilder={isBuilder}
        onJoinCommunity={handleJoinCommunity}
        onRequestToJoin={handleRequestToJoin}
        isJoinRequestPending={joinRequestedIds.has(community.id)}
        onLeaveCommunity={() => leaveCommunity(community.id)}
        onJoinChannel={handleJoinChannel}
        isChannelJoined={(channelId) => isChannelJoined(community.id, channelId)}
        showWelcomeBanner={!!showWelcome}
        members={members}
        resources={resources}
        events={events}
        onCreateChannel={canManageChannels ? handleCreateChannel : undefined}
        onCreateEvent={isBuilder ? handleCreateEvent : undefined}
        onCreateResource={isBuilder ? handleCreateResource : undefined}
        canPinPosts={canPinPosts}
        getCommunitiesForMember={getCommunitiesForMember}
      />
    </div>
  )
}
