"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCommunityJoin } from "@/components/community/community-join-context"
import type { Community } from "@/types/community"
import { getCategoryBadges, getCategorySlug } from "@/data/community-categories"
import { Users, MessageSquare, Lock, UserCheck, Link2, Circle } from "lucide-react"

interface CommunityCardProps {
  community: Community
  viewMode?: "grid" | "list"
}

export function CommunityCard({ community, viewMode = "grid" }: CommunityCardProps) {
  const router = useRouter()
  const { isMember: isMemberOf, joinCommunity } = useCommunityJoin()
  const isMember = isMemberOf(community.id)
  const joinLabel =
    community.privacy === "public"
      ? "Join"
      : community.privacy === "approval"
        ? "Request to join"
        : "Invite only"

  const JoinIcon =
    community.privacy === "public"
      ? Users
      : community.privacy === "approval"
        ? UserCheck
        : Link2

  return (
    <article
      className={`relative gs-card-hover rounded-xl border border-slate-200 dark:border-slate-700 bg-card overflow-hidden group ${
        viewMode === "list" ? "flex flex-row" : ""
      }`}
    >
      <div className={`relative z-0 ${viewMode === "list" ? "w-28 sm:w-48 flex-shrink-0" : ""}`}>
        <Link href={`/community/${community.slug}`} className="block relative z-0" aria-label={`View ${community.name}`}>
          <div className={`relative bg-slate-100 dark:bg-slate-800 ${viewMode === "list" ? "h-full min-h-[100px] sm:min-h-[140px]" : "h-32 sm:h-36"}`}>
          <img
            src={community.bannerUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-end gap-3">
            <img
              src={community.logoUrl}
              alt=""
              className="w-12 h-12 rounded-xl border-2 border-white dark:border-slate-800 shadow-md object-cover"
            />
            {community.verified && (
              <Badge className="mb-1 gs-gradient text-white text-[10px] border-0">Verified</Badge>
            )}
          </div>
        </div>
        </Link>
      </div>
      <div className="relative z-20 p-4 flex-1 flex flex-col">
        <Link href={`/community/${community.slug}`} className="group/title block">
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover/title:text-[#0F7377] dark:group-hover/title:text-teal-400 transition-colors line-clamp-1">
            {community.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
            {community.tagline}
          </p>
        </Link>
        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {community.memberCount.toLocaleString()} members
          </span>
          {(community.activeNow != null && community.activeNow > 0) && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <Circle className="h-1.5 w-1.5 fill-current" />
              {community.activeNow} online
            </span>
          )}
          {(community.activeMembers24h != null && community.activeMembers24h > 0) && (
            <span className="flex items-center gap-1 text-[#0F7377] dark:text-teal-400">
              <Circle className="h-1.5 w-1.5 fill-current opacity-70" />
              {community.activeMembers24h} active in 24h
            </span>
          )}
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {community.postCountThisWeek} posts this week
          </span>
          {community.privacy !== "public" && (
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              {community.privacy === "approval" ? "Approval required" : "Invite only"}
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {getCategoryBadges(community, 2).map((label) => {
              const slug = getCategorySlug(label)
              return (
                <Link
                  key={label}
                  href={`/community/category/${slug}`}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#0F7377]/10 dark:bg-teal-500/20 text-[#0F7377] dark:text-teal-400 hover:bg-[#0F7377]/20 dark:hover:bg-teal-500/30 transition-colors"
                >
                  {label}
                </Link>
              )
            })}
          </div>
          {isMember ? (
            <Button size="sm" className="gs-gradient text-white rounded-lg text-xs relative z-20 min-h-[44px] px-4" asChild>
              <Link href={`/community/${community.slug}`}>
                Open
                <JoinIcon className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              className="gs-gradient text-white rounded-lg text-xs relative z-20 min-h-[44px] px-4"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                joinCommunity(community.id)
                toast.success(`You joined ${community.name}`)
                router.push(`/community/${community.slug}?welcome=1`)
              }}
            >
              {joinLabel}
              <JoinIcon className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
