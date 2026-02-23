"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Community, CommunityPost, SubGroup, CommunityMember, CommunityResource, CommunityEvent, ChannelKind } from "@/types/community"
import { getCategoryBadges, getCategorySlug } from "@/data/community-categories"
import { getRoleLabel } from "@/data/community-permissions"
import { getModerationSettings, checkContent } from "@/data/community-moderation"
import { addReport, getRejectedPostIds } from "@/data/community-moderation-queue"
import { addCommunityNotification } from "@/data/community-notifications"
import { awardPoints } from "@/data/community-gamification-storage"
import { downloadEventIcs } from "@/lib/ical-export"
import { FeedComposer } from "@/components/community/feed-composer"
import { CreateEventForm } from "@/components/community/create-event-form"
import { AddResourceForm } from "@/components/community/add-resource-form"
import { CommunityFeedPost } from "@/components/community/community-feed-post"
import {
  Users,
  MessageSquare,
  Calendar,
  FolderOpen,
  Settings,
  UserPlus,
  Check,
  X,
  Info,
  Share2,
  LogOut,
  Search,
  FileText,
  Link2,
  CalendarPlus,
  Plus,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MemberProfileSheet } from "@/components/community/member-profile-sheet"
import { CommunityLeaderboard } from "@/components/community/community-leaderboard"
import { CommunityWelcomeOnboarding } from "@/components/community/community-welcome-onboarding"
import { getRulesAccepted } from "@/data/community-welcome-onboarding-storage"

interface CommunityProfileProps {
  community: Community
  posts: CommunityPost[]
  subGroups: SubGroup[]
  isMember: boolean
  isBuilder: boolean
  onJoinCommunity?: () => void
  onRequestToJoin?: () => void
  isJoinRequestPending?: boolean
  onLeaveCommunity?: () => void
  onJoinChannel?: (channelId: string) => void
  isChannelJoined?: (channelId: string) => boolean
  showWelcomeBanner?: boolean
  members?: CommunityMember[]
  resources?: CommunityResource[]
  events?: CommunityEvent[]
  onCreateChannel?: (payload: { name: string; description: string; kind: ChannelKind }) => void
  onCreateEvent?: (event: CommunityEvent) => void
  onCreateResource?: (resource: CommunityResource) => void
  /** If true, current user can pin posts (defaults to isBuilder). */
  canPinPosts?: boolean
  /** For member profile sheet: communities this user is in. */
  getCommunitiesForMember?: (userId: string) => { name: string; slug: string }[]
}

export function CommunityProfile({
  community,
  posts,
  subGroups,
  isMember,
  isBuilder,
  onJoinCommunity,
  onRequestToJoin,
  isJoinRequestPending = false,
  onLeaveCommunity,
  onJoinChannel,
  isChannelJoined = () => false,
  showWelcomeBanner = false,
  members = [],
  resources = [],
  events = [],
  onCreateChannel,
  onCreateEvent,
  onCreateResource,
  canPinPosts = isBuilder,
  getCommunitiesForMember,
}: CommunityProfileProps) {
  const [activeSection, setActiveSection] = useState<"feed" | "members" | "events" | "resources" | "about" | "admin" | "search">("feed")
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null)
  const [communitySearchQuery, setCommunitySearchQuery] = useState("")
  const [feedChannelId, setFeedChannelId] = useState<string | "all">("all")
  const [feedSearchQuery, setFeedSearchQuery] = useState("")
  const [feedSort, setFeedSort] = useState<"latest" | "top">("latest")
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set())
  const [welcomeDismissed, setWelcomeDismissed] = useState(false)
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>([])
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false)
  const [membersSearchQuery, setMembersSearchQuery] = useState("")
  const [membersRoleFilter, setMembersRoleFilter] = useState<string>("all")
  const [feedPostTypeFilter, setFeedPostTypeFilter] = useState<string>("all")
  const [feedShowSavedOnly, setFeedShowSavedOnly] = useState(false)
  const [pinnedPostIds, setPinnedPostIds] = useState<Set<string>>(new Set())
  const [eventGoingIds, setEventGoingIds] = useState<Set<string>>(new Set())
  const [eventInterestedIds, setEventInterestedIds] = useState<Set<string>>(new Set())
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [addResourceOpen, setAddResourceOpen] = useState(false)
  const [createChannelOpen, setCreateChannelOpen] = useState(false)
  const [createChannelName, setCreateChannelName] = useState("")
  const [createChannelDescription, setCreateChannelDescription] = useState("")
  const [createChannelKind, setCreateChannelKind] = useState<ChannelKind>("channel")

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("community_saved_post_ids") : null
      if (raw) setSavedPostIds(new Set(JSON.parse(raw)))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      const key = `community_pinned_${community.id}`
      const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null
      if (raw) setPinnedPostIds(new Set(JSON.parse(raw)))
    } catch {}
  }, [community.id])

  const togglePinPost = (postId: string) => {
    setPinnedPostIds((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      try {
        localStorage.setItem(`community_pinned_${community.id}`, JSON.stringify([...next]))
      } catch {}
      return next
    })
    toast.success("Pin updated")
  }

  const toggleSavePost = (postId: string) => {
    setSavedPostIds((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      try {
        localStorage.setItem("community_saved_post_ids", JSON.stringify([...next]))
      } catch {}
      return next
    })
  }

  const selectChannel = (id: string | "all") => {
    setFeedChannelId(id)
    setActiveSection("feed")
  }

  const isPinned = (p: CommunityPost) => p.pinned || pinnedPostIds.has(p.id)
  const rejectedPostIds = new Set(getRejectedPostIds(community.id))
  const feedPosts = [...localPosts, ...posts]
    .filter((p) => !rejectedPostIds.has(p.id))
    .sort((a, b) => {
    if (isPinned(a) !== isPinned(b)) return isPinned(a) ? -1 : 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
  const byChannel =
    feedChannelId === "all"
      ? feedPosts
      : feedPosts.filter((p) => p.subGroupId === feedChannelId)
  const bySearch = feedSearchQuery.trim()
    ? byChannel.filter(
        (p) =>
          p.content.toLowerCase().includes(feedSearchQuery.toLowerCase()) ||
          p.authorName.toLowerCase().includes(feedSearchQuery.toLowerCase())
      )
    : byChannel
  const byType =
    feedPostTypeFilter === "all"
      ? bySearch
      : bySearch.filter((p) => (p.postType ?? "discussion") === feedPostTypeFilter)
  const bySaved = feedShowSavedOnly ? byType.filter((p) => savedPostIds.has(p.id)) : byType
  const filteredFeedPosts =
    feedSort === "top"
      ? [...bySaved].sort((a, b) => (b.likes || 0) - (a.likes || 0))
      : bySaved

  const q = communitySearchQuery.trim().toLowerCase()
  const searchPosts = q ? feedPosts.filter((p) => p.content.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q)) : []
  const searchMembers = q ? members.filter((m) => (m.userName ?? "").toLowerCase().includes(q)) : []
  const searchResources = q ? resources.filter((r) => (r.title + " " + (r.description ?? "")).toLowerCase().includes(q)) : []
  const searchEvents = q ? events.filter((e) => (e.title + " " + (e.description ?? "")).toLowerCase().includes(q)) : []
  const hasSearchResults = searchPosts.length > 0 || searchMembers.length > 0 || searchResources.length > 0 || searchEvents.length > 0

  const handleShareCommunity = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/community/${community.slug}` : ""
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => toast.success("Link copied to clipboard"))
    }
  }

  const sortedChannels = [...subGroups].sort((a, b) => {
    const order = { announcement: 0, general: 1, channel: 2 }
    const ka = a.kind ?? "channel"
    const kb = b.kind ?? "channel"
    return (order[ka] ?? 2) - (order[kb] ?? 2) || a.name.localeCompare(b.name)
  })

  const generalChannels = subGroups.filter((c) => c.kind === "general" || c.kind === "channel")

  const joinLabel =
    community.privacy === "public"
      ? "Join"
      : community.privacy === "approval"
        ? (isJoinRequestPending ? "Requested" : "Request to join")
        : "Invite only"

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={community.bannerUrl}
          alt=""
          className="w-full h-48 sm:h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            <img
              src={community.logoUrl}
              alt=""
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl object-cover"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                  {community.name}
                </h1>
                {community.verified && (
                  <Badge className="gs-gradient text-white border-0">Verified</Badge>
                )}
              </div>
              <p className="text-white/90 text-sm sm:text-base mt-1">{community.tagline}</p>
            </div>
          </div>
          {!isMember && (
            <Button
              className="gs-gradient text-white rounded-xl shrink-0 min-h-[44px]"
              onClick={(e) => {
                e.preventDefault()
                if (community.privacy === "approval") {
                  onRequestToJoin?.()
                } else {
                  onJoinCommunity?.()
                }
              }}
              disabled={community.privacy === "approval" && isJoinRequestPending}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {joinLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-4 border-b border-slate-200 dark:border-slate-700 text-sm">
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <Users className="h-4 w-4 text-[#0F7377] dark:text-teal-400" />
          {community.memberCount.toLocaleString()} members
        </span>
        {(community.activeNow != null && community.activeNow > 0) && (
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" aria-hidden />
            {community.activeNow} online now
          </span>
        )}
        {(community.activeMembers24h != null && community.activeMembers24h > 0) && (
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-[#0F7377] dark:bg-teal-400 opacity-70" aria-hidden />
            {community.activeMembers24h} active in 24h
          </span>
        )}
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <MessageSquare className="h-4 w-4 text-[#0F7377] dark:text-teal-400" />
          {community.postCountThisWeek} posts this week
        </span>
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <Calendar className="h-4 w-4 text-[#0F7377] dark:text-teal-400" />
          Upcoming events
        </span>
        <div className="flex items-center gap-2 ml-auto">
          {isBuilder && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-slate-600 dark:text-slate-400"
              onClick={() => {
                const url = typeof window !== "undefined" ? `${window.location.origin}/community/${community.slug}?invite=link` : ""
                if (url && navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast.success("Invite link copied"))
              }}
            >
              Copy invite link
            </Button>
          )}
          <Button variant="ghost" size="sm" className="rounded-lg text-slate-600 dark:text-slate-400" onClick={handleShareCommunity}>
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </Button>
        </div>
      </div>

      {/* Sidebar + main */}
      <div className="flex gap-6 mt-6">
        {/* Sidebar: channels + nav */}
        <aside className="w-52 shrink-0 hidden sm:block">
          <nav className="sticky top-28 space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-2">
              Channels
            </p>
            <button
              type="button"
              onClick={() => selectChannel("all")}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                activeSection === "feed" && feedChannelId === "all"
                  ? "gs-gradient text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              All
            </button>
            {sortedChannels.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => selectChannel(ch.id)}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                  activeSection === "feed" && feedChannelId === ch.id
                    ? "gs-gradient text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <FolderOpen className="h-4 w-4 shrink-0" />
                <span className="truncate">{ch.name}</span>
              </button>
            ))}
            {isBuilder && onCreateChannel && (
              <button
                type="button"
                onClick={() => setCreateChannelOpen(true)}
                className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-600 mt-1"
              >
                <Plus className="h-4 w-4 shrink-0" />
                Create channel
              </button>
            )}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-2">
                Community
              </p>
              <button
                type="button"
                title="Search posts, members, resources, and events"
                onClick={() => setActiveSection("search")}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                  activeSection === "search" ? "gs-gradient text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Search className="h-4 w-4 shrink-0" />
                Search
              </button>
              {[
                { id: "members" as const, label: "Members", icon: Users, title: "View and search members" },
                { id: "events" as const, label: "Events", icon: Calendar, title: "Upcoming events" },
                { id: "resources" as const, label: "Resources", icon: FolderOpen, title: "Files and links" },
                { id: "about" as const, label: "About", icon: Info, title: "About this community, leave" },
                ...(isBuilder ? [{ id: "admin" as const, label: "Admin", icon: Settings, title: "Manage channels, members, join requests" }] : []),
              ].map(({ id, label, icon: Icon, title }) => (
                <button
                  key={id}
                  type="button"
                  title={title}
                  onClick={() => setActiveSection(id)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                    activeSection === id
                      ? "gs-gradient text-white"
                      : id === "admin"
                        ? "text-slate-700 dark:text-slate-300 hover:bg-[#0F7377]/10 dark:hover:bg-teal-500/20 border border-[#0F7377]/20 dark:border-teal-500/30"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main: feed (default) or section content */}
        <main className="flex-1 min-w-0">
          {/* Mobile: horizontal scroll section/channel pills (app-style) */}
          <div className="sm:hidden -mx-4 px-4 mb-4 overflow-x-auto overflow-y-hidden touch-pan-x" style={{ WebkitOverflowScrolling: "touch" }}>
            <div className="flex gap-2 pb-1 min-h-[44px] items-center">
              <button
                type="button"
                onClick={() => selectChannel("all")}
                title="All posts"
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center ${
                  activeSection === "feed" && feedChannelId === "all"
                    ? "gs-gradient text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                All
              </button>
              {sortedChannels.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => selectChannel(ch.id)}
                  title={ch.name}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center ${
                    activeSection === "feed" && feedChannelId === ch.id
                      ? "gs-gradient text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  #{ch.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setActiveSection("search")}
                title="Search"
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center ${
                  activeSection === "search" ? "gs-gradient text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("members")}
                title="View members"
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center ${
                  activeSection === "members" ? "gs-gradient text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                Members
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("events")}
                title="Events"
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center ${
                  activeSection === "events" ? "gs-gradient text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                Events
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("resources")}
                title="Resources"
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center ${
                  activeSection === "resources" ? "gs-gradient text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                Resources
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("about")}
                title="About & leave"
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center ${
                  activeSection === "about" ? "gs-gradient text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                About
              </button>
              {isBuilder && (
                <button
                  type="button"
                  onClick={() => setActiveSection("admin")}
                  title="Manage community"
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center ${
                    activeSection === "admin" ? "gs-gradient text-white" : "bg-[#0F7377]/10 dark:bg-teal-500/20 text-[#0F7377] dark:text-teal-400 border border-[#0F7377]/30 dark:border-teal-500/40"
                  }`}
                >
                  Admin
                </button>
              )}
            </div>
          </div>

          {activeSection === "search" && (
            <div className="pt-2">
              <div className="mb-4 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search posts, members, resources, events…"
                    value={communitySearchQuery}
                    onChange={(e) => setCommunitySearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F7377] dark:focus:ring-teal-500"
                  />
                </div>
              </div>
              {!communitySearchQuery.trim() ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Search className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400">Enter a term to search across posts, members, resources, and events.</p>
                </div>
              ) : !hasSearchResults ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Search className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400">No results for &quot;{communitySearchQuery}&quot;</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {searchPosts.length > 0 && (
                    <section>
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Posts ({searchPosts.length})
                      </h3>
                      <div className="space-y-3">
                        {searchPosts.slice(0, 5).map((p) => (
                          <CommunityFeedPost
                            key={p.id}
                            post={{ ...p, pinned: isPinned(p) }}
                            postLink={typeof window !== "undefined" ? `${window.location.origin}/community/${community.slug}` : undefined}
                            isSaved={savedPostIds.has(p.id)}
                            onToggleSave={() => toggleSavePost(p.id)}
                            isBuilder={canPinPosts}
                            onPinPost={() => togglePinPost(p.id)}
                            onReport={(post, reason) => addReport(community.id, post.id, reason, { authorName: post.authorName, content: post.content })}
                          />
                        ))}
                        {searchPosts.length > 5 && <p className="text-xs text-slate-500">+{searchPosts.length - 5} more</p>}
                      </div>
                    </section>
                  )}
                  {searchMembers.length > 0 && (
                    <section>
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Members ({searchMembers.length})
                      </h3>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                        {searchMembers.slice(0, 10).map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => getCommunitiesForMember && setSelectedMember(m)}
                            className="w-full p-3 flex items-center gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <img src={m.userAvatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-slate-900 dark:text-white text-sm">{m.userName ?? "—"}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{getRoleLabel(m.role ?? "member")}</p>
                            </div>
                          </button>
                        ))}
                        {searchMembers.length > 10 && <p className="p-2 text-xs text-slate-500">+{searchMembers.length - 10} more</p>}
                      </div>
                    </section>
                  )}
                  {searchResources.length > 0 && (
                    <section>
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <FolderOpen className="h-4 w-4" />
                        Resources ({searchResources.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResources.slice(0, 5).map((r) => (
                          <a
                            key={r.id}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          >
                            {r.type === "link" ? <Link2 className="h-4 w-4 text-slate-500 shrink-0" /> : <FileText className="h-4 w-4 text-slate-500 shrink-0" />}
                            <span className="font-medium text-slate-900 dark:text-white text-sm truncate">{r.title}</span>
                          </a>
                        ))}
                        {searchResources.length > 5 && <p className="text-xs text-slate-500">+{searchResources.length - 5} more</p>}
                      </div>
                    </section>
                  )}
                  {searchEvents.length > 0 && (
                    <section>
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Events ({searchEvents.length})
                      </h3>
                      <div className="space-y-2">
                        {searchEvents.slice(0, 5).map((ev) => {
                          const start = new Date(ev.startAt)
                          return (
                            <div key={ev.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#0F7377]/10 dark:bg-teal-500/20 flex items-center justify-center shrink-0">
                                <Calendar className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-slate-900 dark:text-white text-sm">{ev.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{start.toLocaleDateString()} · {ev.type}</p>
                              </div>
                            </div>
                          )
                        })}
                        {searchEvents.length > 5 && <p className="text-xs text-slate-500">+{searchEvents.length - 5} more</p>}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSection === "feed" && (
            <>
              {showWelcomeBanner && !getRulesAccepted(community.id) && (
                <CommunityWelcomeOnboarding
                  community={community}
                  onDismiss={() => setWelcomeDismissed(true)}
                  onIntroduceYourself={() =>
                    document.getElementById("feed-composer")?.scrollIntoView({ behavior: "smooth" })
                  }
                />
              )}
              {showWelcomeBanner && welcomeDismissed && getRulesAccepted(community.id) && (
                <div className="mb-6 rounded-xl bg-[#0F7377]/10 dark:bg-teal-500/20 border border-[#0F7377]/20 dark:border-teal-500/30 p-4 flex items-start justify-between gap-3">
                  <p className="text-slate-700 dark:text-slate-300 text-sm">
                    You&apos;re in! Pick a channel in the sidebar to see updates.
                  </p>
                  <button
                    type="button"
                    onClick={() => setWelcomeDismissed(true)}
                    className="shrink-0 p-1 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {community.welcomeMessage && feedChannelId === "all" && (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 mb-6">
                  <p className="text-slate-700 dark:text-slate-300">{community.welcomeMessage}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search posts and authors…"
                    value={feedSearchQuery}
                    onChange={(e) => setFeedSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-background pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F7377] dark:focus:ring-teal-500"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex gap-1 rounded-lg border border-slate-200 dark:border-slate-600 p-1 bg-slate-50 dark:bg-slate-800/50">
                    <button
                      type="button"
                      onClick={() => setFeedSort("latest")}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${feedSort === "latest" ? "gs-gradient text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                    >
                      Latest
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedSort("top")}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${feedSort === "top" ? "gs-gradient text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                    >
                      Top
                    </button>
                  </div>
                  <select
                    value={feedPostTypeFilter}
                    onChange={(e) => setFeedPostTypeFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-2 py-1.5 text-sm text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F7377]"
                  >
                    <option value="all">All types</option>
                    <option value="discussion">Discussion</option>
                    <option value="announcement">Announcement</option>
                    <option value="question">Question</option>
                    <option value="event">Event</option>
                    <option value="resource">Resource</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setFeedShowSavedOnly((v) => !v)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${feedShowSavedOnly ? "gs-gradient text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                  >
                    Saved only
                  </button>
                </div>
              </div>
              {isMember && generalChannels.length > 0 && (
                <div id="feed-composer" className="mb-6 scroll-mt-4">
                  <FeedComposer
                    channels={generalChannels}
                    defaultChannelId={subGroups.find((c) => c.kind === "general")?.id}
                    placeholder="Share an update, image, video, or document…"
                    mentionableUsers={members
                      .filter((m) => m.userId !== "current-user")
                      .map((m) => ({ id: m.userId, displayName: m.userName ?? m.userId }))}
                    onPost={(text, channelId, mentionedUserIds) => {
                      const settings = getModerationSettings(community.id)
                      const result = checkContent(text, settings)
                      if (!result.allowed) {
                        toast.error(result.reason)
                        return
                      }
                      const ch = subGroups.find((c) => c.id === channelId)
                      setLocalPosts((prev) => [
                        ...prev,
                        {
                          id: `local-${Date.now()}`,
                          communityId: community.id,
                          subGroupId: channelId,
                          subGroupName: ch?.name ?? "General",
                          authorId: "current-user",
                          authorName: "You",
                          authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                          content: text,
                          pinned: false,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          likes: 0,
                          comments: 0,
                        },
                      ])
                      awardPoints(community.id, "current-user", "post")
                      if (mentionedUserIds?.length) {
                        const names = members
                          .filter((m) => mentionedUserIds.includes(m.userId))
                          .map((m) => m.userName ?? m.userId)
                        addCommunityNotification({
                          type: "mention",
                          title: "You mentioned someone",
                          message: `You mentioned ${names.join(", ")} in ${community.name}.`,
                          communityId: community.id,
                          communityName: community.name,
                          communitySlug: community.slug,
                          authorName: "You",
                        })
                      }
                      toast.success("Posted!")
                    }}
                  />
                </div>
              )}
              <CommunityLeaderboard communityId={community.id} limit={5} compact />
              {filteredFeedPosts.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {filteredFeedPosts.map((p) => (
                    <CommunityFeedPost
                      key={p.id}
                      post={{ ...p, pinned: isPinned(p) }}
                      postLink={typeof window !== "undefined" ? `${window.location.origin}/community/${community.slug}` : undefined}
                      isSaved={savedPostIds.has(p.id)}
                      onToggleSave={() => toggleSavePost(p.id)}
                      isBuilder={canPinPosts}
                      onPinPost={() => togglePinPost(p.id)}
                      onReport={(post, reason) =>
                        addReport(community.id, post.id, reason, { authorName: post.authorName, content: post.content })
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400">
                    {feedShowSavedOnly ? "No saved posts. Save posts to see them here." : feedSearchQuery.trim() ? "No posts match your search." : "No posts yet. Be the first to post."}
                  </p>
                </div>
              )}
            </>
          )}

          {activeSection === "members" && (
            <div className="pt-2">
              {members.length > 0 ? (
                <>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="search"
                        placeholder="Search members…"
                        value={membersSearchQuery}
                        onChange={(e) => setMembersSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F7377] dark:focus:ring-teal-500"
                      />
                    </div>
                    <select
                      value={membersRoleFilter}
                      onChange={(e) => setMembersRoleFilter(e.target.value)}
                      className="rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-3 py-2 text-sm text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F7377] sm:w-40"
                    >
                      <option value="all">All roles</option>
                      <option value="owner">Owner</option>
                      <option value="moderator">Moderator</option>
                      <option value="member">Member</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg shrink-0"
                      onClick={() => {
                        const headers = "Name,Role,Joined\n"
                        const rows = members
                          .filter((m) => membersRoleFilter === "all" || m.role === membersRoleFilter)
                          .filter((m) => !membersSearchQuery.trim() || (m.userName ?? "").toLowerCase().includes(membersSearchQuery.toLowerCase()))
                          .map((m) => `${m.userName ?? "—"},${m.role},${m.joinedAt}`)
                        const csv = headers + rows.join("\n")
                        const blob = new Blob([csv], { type: "text/csv" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `${community.slug}-members.csv`
                        a.click()
                        URL.revokeObjectURL(url)
                        toast.success("Members list exported")
                      }}
                    >
                      Export CSV
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                  {members
                    .filter((m) => membersRoleFilter === "all" || m.role === membersRoleFilter)
                    .filter((m) => !membersSearchQuery.trim() || (m.userName ?? "").toLowerCase().includes(membersSearchQuery.toLowerCase()))
                    .map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => getCommunitiesForMember && setSelectedMember(m)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-left w-full hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <img
                        src={m.userAvatar ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">{m.userName ?? "Member"}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{getRoleLabel(m.role ?? "member")}</p>
                      </div>
                    </button>
                  ))}
                  </div>
                </>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  {community.memberCount.toLocaleString()} members. Member list can be shown here (optional).
                </p>
              )}
            </div>
          )}

          {activeSection === "events" && (
            <div className="pt-2">
              {isBuilder && onCreateEvent && (
                <>
                  <div className="flex justify-end mb-3">
                    <Button size="sm" className="gs-gradient text-white rounded-lg" onClick={() => setCreateEventOpen(true)}>
                      <CalendarPlus className="h-3.5 w-3.5 mr-1" />
                      Create event
                    </Button>
                  </div>
                  <CreateEventForm
                    communityId={community.id}
                    open={createEventOpen}
                    onOpenChange={setCreateEventOpen}
                    onSubmit={(event) => {
                      onCreateEvent(event)
                      toast.success("Event created")
                    }}
                  />
                </>
              )}
              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((ev) => {
                    const start = new Date(ev.startAt)
                    const end = ev.endAt ? new Date(ev.endAt) : new Date(start.getTime() + 60 * 60 * 1000)
                    const formatCal = (d: Date) => d.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"
                    const addToCalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${formatCal(start)}/${formatCal(end)}`
                    const going = eventGoingIds.has(ev.id)
                    const interested = eventInterestedIds.has(ev.id)
                    const goingCount = 12 + (going ? 1 : 0)
                    const interestedCount = 8 + (interested ? 1 : 0)
                    return (
                      <div
                        key={ev.id}
                        className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 gs-card-hover"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#0F7377]/10 dark:bg-teal-500/20 flex items-center justify-center shrink-0">
                          <Calendar className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">{ev.title}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {start.toLocaleDateString(undefined, { dateStyle: "medium" })} · {ev.type}
                          </p>
                          {ev.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{ev.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {ev.meetingUrl && (
                              <a href={ev.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#0F7377] dark:text-teal-400 hover:underline">
                                Join meeting
                              </a>
                            )}
                            <a href={addToCalUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 inline-flex items-center gap-1">
                              <CalendarPlus className="h-3.5 w-3.5" />
                              Add to Google Calendar
                            </a>
                            <button
                              type="button"
                              onClick={() => downloadEventIcs(ev, community.name)}
                              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 inline-flex items-center gap-1"
                            >
                              Export .ics
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <button
                              type="button"
                              onClick={() => setEventGoingIds((prev) => {
                                const next = new Set(prev)
                                if (next.has(ev.id)) next.delete(ev.id)
                                else next.add(ev.id)
                                return next
                              })}
                              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${going ? "gs-gradient text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                            >
                              I&apos;m going · {goingCount}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEventInterestedIds((prev) => {
                                const next = new Set(prev)
                                if (next.has(ev.id)) next.delete(ev.id)
                                else next.add(ev.id)
                                return next
                              })}
                              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${interested ? "gs-gradient text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                            >
                              Interested · {interestedCount}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Calendar className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400">No upcoming events. Events from GrowthLab can be scoped here.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === "resources" && (
            <div className="pt-2">
              {isBuilder && onCreateResource && (
                <>
                  <div className="flex justify-end mb-3">
                    <Button size="sm" className="gs-gradient text-white rounded-lg" onClick={() => setAddResourceOpen(true)}>
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add resource
                    </Button>
                  </div>
                  <AddResourceForm
                    communityId={community.id}
                    open={addResourceOpen}
                    onOpenChange={setAddResourceOpen}
                    existingCategories={[...new Set(resources.map((r) => r.category).filter(Boolean))] as string[]}
                    onSubmit={(resource) => {
                      onCreateResource(resource)
                      toast.success("Resource added")
                    }}
                  />
                </>
              )}
              {resources.length > 0 ? (
                <div className="space-y-5">
                  {(() => {
                    const byFolder = resources.reduce<Record<string, CommunityResource[]>>((acc, r) => {
                      const folder = r.category?.trim() || "Uncategorized"
                      if (!acc[folder]) acc[folder] = []
                      acc[folder].push(r)
                      return acc
                    }, {})
                    const folderOrder = Object.keys(byFolder).sort((a, b) => (a === "Uncategorized" ? 1 : b === "Uncategorized" ? -1 : a.localeCompare(b)))
                    return folderOrder.map((folder) => (
                      <div key={folder}>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{folder}</p>
                        <div className="space-y-2">
                          {byFolder[folder].map((r) => (
                            <a
                              key={r.id}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 gs-card-hover"
                            >
                              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                {r.type === "link" ? (
                                  <Link2 className="h-5 w-5 text-slate-500" />
                                ) : (
                                  <FileText className="h-5 w-5 text-slate-500" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-slate-900 dark:text-white">{r.title}</p>
                                {r.description && (
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{r.description}</p>
                                )}
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              ) : (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <FolderOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400">No resources yet. Builders can add links and files.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === "about" && (
            <div className="pt-2 space-y-4">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">Description</h4>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{community.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">Guidelines</h4>
                {community.guidelines?.trim() ? (
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{community.guidelines}</p>
                ) : (
                  <p className="text-slate-500 dark:text-slate-500 italic">No guidelines set.</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {getCategoryBadges(community, 3).map((label) => (
                  <Link
                    key={label}
                    href={`/community/category/${getCategorySlug(label)}`}
                    className="inline-flex px-2.5 py-1 rounded-lg text-sm bg-[#0F7377]/10 dark:bg-teal-500/20 text-[#0F7377] dark:text-teal-400 hover:bg-[#0F7377]/20 dark:hover:bg-teal-500/30"
                  >
                    {label}
                  </Link>
                ))}
                {community.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="rounded-lg">{t}</Badge>
                ))}
              </div>
              {isMember && onLeaveCommunity && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  {!leaveConfirmOpen ? (
                    <Button variant="outline" size="sm" className="rounded-lg text-slate-600 dark:text-slate-400" onClick={() => setLeaveConfirmOpen(true)}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Leave community
                    </Button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Leave {community.name}?</span>
                      <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setLeaveConfirmOpen(false)}>Cancel</Button>
                      <Button size="sm" className="rounded-lg bg-red-600 hover:bg-red-700 text-white" onClick={() => { onLeaveCommunity(); setLeaveConfirmOpen(false); toast.success("You left the community"); }}>
                        Leave
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSection === "admin" && isBuilder && (
            <div className="pt-2">
              <div className="rounded-xl border border-[#0F7377]/20 dark:border-teal-500/30 bg-[#0F7377]/5 dark:bg-teal-500/10 p-6 space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Manage your community</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Approve join requests, create channels, change member roles, copy invite link, and more.
                </p>
                <Button asChild className="gs-gradient text-white rounded-xl gap-2">
                  <Link href={`/community/${community.slug}/admin`}>
                    <Settings className="h-4 w-4" />
                    Open admin dashboard
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedMember && getCommunitiesForMember && (
        <MemberProfileSheet
          member={selectedMember}
          currentCommunity={community}
          communitiesForMember={getCommunitiesForMember(selectedMember.userId)}
          open={!!selectedMember}
          onOpenChange={(open) => !open && setSelectedMember(null)}
          isCurrentUser={selectedMember.userId === "current-user"}
        />
      )}
    </div>
  )
}

