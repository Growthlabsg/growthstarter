"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  mockCommunities,
  mockCommunityPosts,
  mockCommunityMembers,
  mockSubGroups,
} from "@/data/mock-communities"
import { getCreatedCommunities, saveCreatedCommunity } from "@/data/community-created-storage"
import { getGuidelinesOverride, setGuidelinesOverride } from "@/data/community-guidelines-overrides"
import {
  getPendingJoinRequests,
  removePendingJoinRequest,
  addPendingJoinRequest,
  type PendingJoinRequest,
} from "@/data/community-join-requests"
import { ROLE_OPTIONS, getRoleLabel } from "@/data/community-permissions"
import { useCommunityBuilder, applyRoleOverrides } from "@/hooks/use-community-builder"
import { useCommunityJoin } from "@/components/community/community-join-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, Users, BarChart3, Settings, UserPlus, Shield, Copy, Flag, Hash, Trash2, UserCheck, UserX, ShieldCheck, MoreHorizontal, LogOut, Ban, Clock, RotateCcw, TrendingUp, MessageSquare, Trophy } from "lucide-react"
import {
  getModerationSettings,
  saveModerationSettings,
  PRESET_LABELS,
  type ModerationSettings,
  type ModerationPreset,
} from "@/data/community-moderation"
import {
  getPendingReports,
  setModerationDecision,
} from "@/data/community-moderation-queue"
import { CreateChannelForm } from "@/components/community/admin-create-channel"
import {
  getCommunityGamificationSettings,
  setLeaderboardEnabled,
} from "@/data/community-gamification-storage"

const JOIN_REQUESTS_KEY = "community_join_requests"

export default function CommunityAdminPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [createdList, setCreatedList] = useState(getCreatedCommunities())
  useEffect(() => {
    setCreatedList(getCreatedCommunities())
  }, [])

  const allCommunities = useMemo(() => {
    const created = createdList.filter((c) => !mockCommunities.some((m) => m.id === c.id))
    return [...mockCommunities, ...created]
  }, [createdList])

  const community = allCommunities.find((c) => c.slug === slug)
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [pendingRequests, setPendingRequests] = useState<PendingJoinRequest[]>([])
  const { joinCommunity } = useCommunityJoin()
  const [moderation, setModeration] = useState<ModerationSettings>(getModerationSettings(community?.id ?? ""))
  const [leaderboardEnabled, setLeaderboardEnabledState] = useState(
    () => getCommunityGamificationSettings(community?.id ?? "").leaderboardEnabled
  )

  useEffect(() => {
    if (community?.id) setModeration(getModerationSettings(community.id))
  }, [community?.id])

  useEffect(() => {
    if (community?.id)
      setLeaderboardEnabledState(getCommunityGamificationSettings(community.id).leaderboardEnabled)
  }, [community?.id])

  useEffect(() => {
    if (!community?.id) return
    let list = getPendingJoinRequests(community.id)
    // One-time seed so builders can see the Join requests UI (for community they own)
    const seededKey = "community_join_requests_seeded"
    try {
      const seeded = new Set(JSON.parse(localStorage.getItem(seededKey) || "[]"))
      if (list.length === 0 && !seeded.has(community.id)) {
        addPendingJoinRequest(community.id, {
          userId: "demo-requester",
          userName: "Sam Lee",
          requestedAt: new Date().toISOString(),
        })
        seeded.add(community.id)
        localStorage.setItem(seededKey, JSON.stringify([...seeded]))
        list = getPendingJoinRequests(community.id)
      }
    } catch {}
    setPendingRequests(list)
  }, [community?.id])

  const {
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
  } = useCommunityBuilder(community?.id ?? "")

  const allChannels =
    community != null
      ? [
          ...mockSubGroups.filter((g) => g.communityId === community.id),
          ...customChannels.filter((c) => c.communityId === community.id),
        ]
      : []
  const membersForCommunityRaw =
    community != null
      ? applyRoleOverrides(
          mockCommunityMembers.filter((m) => m.communityId === community.id),
          roleOverrides
        )
      : []
  const membersForCommunity = membersForCommunityRaw

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/community/${community?.slug ?? slug}?invite=link`
      : ""
  const copyInviteLink = () => {
    if (inviteUrl && navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl).then(() => toast.success("Invite link copied"))
    }
  }

  const [guidelinesText, setGuidelinesText] = useState("")
  useEffect(() => {
    if (community) {
      const override = getGuidelinesOverride(community.id)
      setGuidelinesText(override !== undefined ? override : (community.guidelines ?? ""))
    }
  }, [community?.id, community?.guidelines])

  const [pendingReports, setPendingReports] = useState<ReturnType<typeof getPendingReports>>([])
  useEffect(() => {
    if (community) setPendingReports(getPendingReports(community.id))
  }, [community?.id])
  useEffect(() => {
    const onUpdate = () => community && setPendingReports(getPendingReports(community.id))
    window.addEventListener("community-moderation-queue-updated", onUpdate)
    return () => window.removeEventListener("community-moderation-queue-updated", onUpdate)
  }, [community?.id])

  if (!community) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Community not found</h1>
        <Link href="/community/browse" className="inline-block mt-4 text-[#0F7377] dark:text-teal-400 font-medium">
          Browse communities
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href={`/community/${community.slug}`}
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to {community.name}
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Admin dashboard</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-4">
        Manage channels, members, join requests, and settings for {community.name}.
      </p>

      {/* Quick access */}
      <div className="flex flex-wrap gap-2 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider self-center mr-1">Quick access:</span>
        <a href="#join-requests" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
          <UserPlus className="h-3.5 w-3.5" />
          Join requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
        </a>
        <a href="#channels" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
          <Hash className="h-3.5 w-3.5" />
          Channels
        </a>
        <a href="#members-roles" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
          <Users className="h-3.5 w-3.5" />
          Members & roles
        </a>
        <button
          type="button"
          onClick={copyInviteLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy invite link
        </button>
        <a href="#moderation-queue" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
          <Flag className="h-3.5 w-3.5" />
          Moderation queue {pendingReports.length > 0 && `(${pendingReports.length})`}
        </a>
        <a href="#guidelines" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
          <Settings className="h-3.5 w-3.5" />
          Guidelines
        </a>
        <a href="#analytics" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
          <BarChart3 className="h-3.5 w-3.5" />
          Analytics
        </a>
        <a href="#auto-moderation" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          Auto-moderation
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{community.memberCount.toLocaleString()}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Members</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{community.postCountThisWeek}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Posts this week</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingRequests.length}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Join requests</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingReports.length}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">In moderation queue</p>
        </div>
      </div>

      <section id="analytics" className="mb-8 scroll-mt-24">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
          Analytics
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Key metrics for your community. Data is derived from current activity.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{community.memberCount}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Users className="h-4 w-4" />
              Total members
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{community.postCountThisWeek}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Posts this week
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{community.activeMembers24h ?? Math.min(community.memberCount, 12)}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Active (24h)
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{allChannels.length}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Hash className="h-4 w-4" />
              Channels
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-800/30">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Activity trend (last 7 days)</h3>
          <div className="flex items-end gap-2 h-12">
            {[community.postCountThisWeek + 2, community.postCountThisWeek - 1, community.postCountThisWeek + 5, community.postCountThisWeek, community.postCountThisWeek + 3, community.postCountThisWeek - 2, community.postCountThisWeek].map((v, i) => (
              <div
                key={i}
                className="flex-1 min-w-0 rounded-t bg-[#0F7377]/20 dark:bg-teal-500/30"
                style={{ height: `${Math.max(20, Math.min(100, (v / (community.postCountThisWeek + 6)) * 100))}%` }}
                title={`Day ${i + 1}: ${v} posts`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Relative post activity by day</p>
        </div>
      </section>

      <section id="join-requests" className="mb-8 scroll-mt-24">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
          Join requests
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Approve or deny requests to join this community. When someone clicks &quot;Request to join&quot;, they appear here.
        </p>
        {pendingRequests.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 border-dashed p-8 text-center">
            <UserPlus className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">No pending requests</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Share your invite link. When someone requests to join, they&apos;ll show up here for you to approve or deny.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
            {pendingRequests.map((req) => (
              <div key={req.userId + req.requestedAt} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white">{req.userName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Requested {new Date(req.requestedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="rounded-lg gap-1.5 bg-green-600 hover:bg-green-700 text-white border-0"
                    onClick={() => {
                      if (community) {
                        if (req.userId === "current-user") {
                          joinCommunity(community.id)
                          try {
                            const raw = localStorage.getItem(JOIN_REQUESTS_KEY)
                            const ids: string[] = raw ? JSON.parse(raw) : []
                            localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(ids.filter((id) => id !== community.id)))
                          } catch {}
                        }
                        removePendingJoinRequest(community.id, req.userId)
                        setPendingRequests((prev) => prev.filter((r) => r.userId !== req.userId || r.requestedAt !== req.requestedAt))
                        toast.success(`${req.userName} has been approved`)
                      }
                    }}
                  >
                    <UserCheck className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg gap-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={() => {
                      if (community) {
                        if (req.userId === "current-user") {
                          try {
                            const raw = localStorage.getItem(JOIN_REQUESTS_KEY)
                            const ids: string[] = raw ? JSON.parse(raw) : []
                            localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(ids.filter((id) => id !== community.id)))
                          } catch {}
                        }
                        removePendingJoinRequest(community.id, req.userId)
                        setPendingRequests((prev) => prev.filter((r) => r.userId !== req.userId || r.requestedAt !== req.requestedAt))
                        toast.success("Request denied")
                      }
                    }}
                  >
                    <UserX className="h-4 w-4" />
                    Deny
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {(pendingReports.length > 0 && (
        <section id="moderation-queue" className="mb-8 scroll-mt-24">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Flag className="h-5 w-5 text-amber-500" />
            Moderation queue
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            Reported posts. Approve to keep visible; Remove hides the post from the feed.
          </p>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
            {pendingReports.map((r) => (
              <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-slate-900 dark:text-white font-medium">{r.contentSnippet}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {r.authorName} · Reported: {r.reportReason}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg"
                    onClick={() => {
                      setModerationDecision(community.id, r.postId, "approved")
                      setPendingReports(getPendingReports(community.id))
                      toast.success("Post approved")
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-lg"
                    onClick={() => {
                      setModerationDecision(community.id, r.postId, "rejected")
                      setPendingReports(getPendingReports(community.id))
                      toast.success("Post removed from feed")
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )) || null}

      <section id="guidelines" className="mb-8 scroll-mt-24">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
          Guidelines
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Community rules and expectations. Shown in the About section.
        </p>
        <textarea
          value={guidelinesText}
          onChange={(e) => setGuidelinesText(e.target.value)}
          placeholder="e.g. Be respectful. No spam. Cite sources when sharing benchmarks."
          rows={5}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F7377] dark:focus:ring-teal-500 resize-y min-h-[120px]"
        />
        <Button
          size="sm"
          className="gs-gradient text-white rounded-lg mt-2"
          onClick={() => {
            if (!community) return
            const created = getCreatedCommunities().find((c) => c.id === community.id)
            if (created) {
              saveCreatedCommunity({ ...created, guidelines: guidelinesText })
              setCreatedList(getCreatedCommunities())
            } else {
              setGuidelinesOverride(community.id, guidelinesText)
            }
            toast.success("Guidelines saved")
          }}
        >
          Save guidelines
        </Button>
      </section>

      <section id="channels" className="mb-8 scroll-mt-24">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Hash className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
          Channels
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Create and manage channels. Custom channels can be removed; default channels are read-only.
        </p>
        {showCreateChannel && community ? (
          <div className="mb-4">
            <CreateChannelForm
              communityId={community.id}
              onSubmit={(ch) => {
                addChannel(ch)
                setShowCreateChannel(false)
                toast.success("Channel created")
              }}
              onCancel={() => setShowCreateChannel(false)}
            />
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg mb-4"
            onClick={() => setShowCreateChannel(true)}
          >
            Create channel
          </Button>
        )}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {allChannels.map((ch) => {
            const isCustom = ch.id.startsWith("custom-")
            return (
              <div
                key={ch.id}
                className="p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white">{ch.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    /{ch.slug} · {ch.kind ?? "channel"}
                    {isCustom && " · Custom"}
                  </p>
                </div>
                {isCustom && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                    onClick={() => {
                      removeChannel(ch.id)
                      toast.success("Channel removed")
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section id="members-roles" className="mb-8 scroll-mt-24">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
          Members & roles
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Change roles or take action: kick (remove), suspend (temporary), or ban. Owner cannot be removed.
        </p>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">Member</th>
                  <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">Role</th>
                  <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">Status</th>
                  <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {membersForCommunity.map((m) => {
                  const statusEntry = statusOverrides[m.userId]
                  const isOwner = m.role === "owner"
                  const isKicked = statusEntry?.status === "kicked"
                  const isBanned = statusEntry?.status === "banned"
                  const isSuspended = statusEntry?.status === "suspended"
                  const hasAction = statusEntry && (isKicked || isBanned || isSuspended)
                  return (
                    <tr key={m.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {m.userAvatar ? (
                            <img
                              src={m.userAvatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium">
                              {(m.userName ?? m.userId).slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <span className="text-slate-900 dark:text-white">{m.userName ?? m.userId}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Select
                          value={m.role}
                          onValueChange={(value) => {
                            setMemberRole(m.userId, value as typeof m.role)
                            toast.success("Role updated")
                          }}
                          disabled={isOwner}
                        >
                          <SelectTrigger className="w-[140px] rounded-lg h-8">
                            <SelectValue>{getRoleLabel(m.role)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3">
                        {hasAction ? (
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                              isBanned
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : isSuspended
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                            }`}
                          >
                            {isBanned ? "Banned" : isSuspended ? "Suspended" : "Kicked"}
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        {isOwner ? (
                          <span className="text-xs text-slate-400">—</span>
                        ) : hasAction ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg gap-1.5"
                            onClick={() => {
                              restoreMember(m.userId)
                              toast.success("Member restored")
                            }}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Restore
                          </Button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="rounded-lg h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                              <DropdownMenuItem
                                onClick={() => {
                                  kickMember(m.userId)
                                  toast.success(`${m.userName ?? m.userId} has been removed`)
                                }}
                                className="gap-2"
                              >
                                <LogOut className="h-4 w-4" />
                                Kick (remove)
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const until = new Date()
                                  until.setDate(until.getDate() + 7)
                                  suspendMember(m.userId, until.toISOString())
                                  toast.success("Member suspended for 7 days")
                                }}
                                className="gap-2"
                              >
                                <Clock className="h-4 w-4" />
                                Suspend 7 days
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  banMember(m.userId)
                                  toast.success("Member banned")
                                }}
                                className="gap-2 text-red-600 dark:text-red-400"
                              >
                                <Ban className="h-4 w-4" />
                                Ban
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Invite new members from the &quot;Invite & growth&quot; card below. Role changes are saved locally.
        </p>
      </section>

      <section id="auto-moderation" className="mb-8 scroll-mt-24">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
          Auto-moderation
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Turn on to auto-reject posts that break rules. Choose a preset or add blocked words. Off = no automatic rejection.
        </p>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Enable auto-moderation</Label>
            <Switch
              checked={moderation.enabled}
              onCheckedChange={(v) => {
                const next = { ...moderation, enabled: v }
                setModeration(next)
                if (community?.id) saveModerationSettings(community.id, next)
                toast.success(v ? "Auto-moderation on" : "Auto-moderation off")
              }}
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Preset</Label>
            <Select
              value={moderation.preset}
              onValueChange={(v) => {
                const next = { ...moderation, preset: v as ModerationPreset }
                setModeration(next)
                if (community?.id) saveModerationSettings(community.id, next)
                toast.success("Preset updated")
              }}
            >
              <SelectTrigger className="mt-1 rounded-lg w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PRESET_LABELS) as ModerationPreset[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {PRESET_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Blocked words or phrases (one per line)</Label>
            <textarea
              value={moderation.blocklist}
              onChange={(e) => {
                const next = { ...moderation, blocklist: e.target.value }
                setModeration(next)
                if (community?.id) saveModerationSettings(community.id, next)
              }}
              placeholder="spam&#10;promo&#10;buy now"
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F7377] dark:focus:ring-teal-500"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Posts containing any of these (case-insensitive) will be rejected automatically.
            </p>
          </div>
        </div>
      </section>

      <section id="gamification" className="mb-8 scroll-mt-24">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Gamification
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Points, streaks, and badges for posts and reactions. Toggle whether the leaderboard is visible to members.
        </p>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Show leaderboard</Label>
            <Switch
              checked={leaderboardEnabled}
              onCheckedChange={(v) => {
                if (community?.id) {
                  setLeaderboardEnabled(community.id, v)
                  setLeaderboardEnabledState(v)
                  toast.success(v ? "Leaderboard visible to members" : "Leaderboard hidden")
                }
              }}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 gs-card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg gs-gradient flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Moderation</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Approve members, moderate posts, mute or ban users, feature posts.
          </p>
          <Button variant="outline" size="sm" className="rounded-lg">
            Open moderation queue
          </Button>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 gs-card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F7377]/10 dark:bg-teal-500/20 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Analytics</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Growth, engagement, retention. Export member list and activity.
          </p>
          <Button variant="outline" size="sm" className="rounded-lg">
            View analytics
          </Button>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 gs-card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F7377]/10 dark:bg-teal-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Invite & growth</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Share your invite link. Anyone with the link can request to join or join (if public).
          </p>
          <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={copyInviteLink}>
            <Copy className="h-4 w-4" />
            Copy invite link
          </Button>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 gs-card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F7377]/10 dark:bg-teal-500/20 flex items-center justify-center">
              <Settings className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Settings</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Privacy, guidelines, theme, sub-groups, roles.
          </p>
          <Button variant="outline" size="sm" className="rounded-lg">
            Community settings
          </Button>
        </div>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-[#0F7377] dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white">Safety & moderation</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Use the moderation queue and member approval to keep your community safe. Report flow and clear guidelines are available from launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
