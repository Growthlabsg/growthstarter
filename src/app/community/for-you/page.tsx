"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { CommunityCard } from "@/components/community/community-card"
import { mockCommunities } from "@/data/mock-communities"
import { getCreatedCommunities } from "@/data/community-created-storage"
import { Button } from "@/components/ui/button"
import { Star, Sparkles, Users } from "lucide-react"
import type { Community } from "@/types/community"

const INTERESTS_KEY = "community_interests"
const JOINED_KEY = "community_joined_ids"

/**
 * "Recommended for you" – category-powered discovery.
 * Based on user profile interests (onboarding), joined communities, and activity.
 */
export default function CommunityForYouPage() {
  const [interests, setInterests] = useState<string[]>([])
  const [createdList, setCreatedList] = useState<Community[]>([])
  const [joinedIds, setJoinedIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(INTERESTS_KEY)
      if (stored) setInterests(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])
  useEffect(() => {
    setCreatedList(getCreatedCommunities())
  }, [])
  useEffect(() => {
    try {
      const raw = localStorage.getItem(JOINED_KEY)
      setJoinedIds(raw ? JSON.parse(raw) : [])
    } catch {
      setJoinedIds([])
    }
  }, [])

  const allCommunities = useMemo(() => {
    const created = createdList.filter((c) => !mockCommunities.some((m) => m.id === c.id))
    return [...mockCommunities, ...created]
  }, [createdList])

  const recommended: Community[] = allCommunities
    .filter((c) => c.privacy !== "secret")
    .filter(
      (c) =>
        interests.length === 0 ||
        (c.categories ?? [c.category]).some((cat) => interests.includes(cat))
    )
    .filter((c) => !joinedIds.includes(c.id))
    .sort((a, b) => b.postCountThisWeek - a.postCountThisWeek)
    .slice(0, 6)

  const joinedCommunities = useMemo(
    () => allCommunities.filter((c) => joinedIds.includes(c.id)),
    [allCommunities, joinedIds]
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold gs-gradient-text mb-2">For you</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        {interests.length > 0
          ? "Communities matching your interests. We hide ones you’ve already joined."
          : "Set your interests to get personalized picks, or browse all communities."}
      </p>
      {interests.length === 0 && (
        <Button asChild variant="outline" size="sm" className="rounded-xl mb-6">
          <Link href="/community/onboarding">
            <Sparkles className="h-4 w-4 mr-2" />
            Pick your interests
          </Link>
        </Button>
      )}
      {interests.length > 0 && <div className="mb-6" />}

      {joinedCommunities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Users className="h-4 w-4" />
            Your communities ({joinedCommunities.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {joinedCommunities.slice(0, 3).map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
          {joinedCommunities.length > 3 && (
            <Button asChild variant="ghost" size="sm" className="mt-2 text-[#0F7377] dark:text-teal-400">
              <Link href="/community/my">View all ({joinedCommunities.length})</Link>
            </Button>
          )}
        </div>
      )}

      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        {interests.length > 0 ? "Recommended for you" : "Discover"}
      </h2>
      {recommended.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          <Star className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 dark:text-slate-400">
            {joinedIds.length > 0
              ? "You’ve joined everything we recommended. Browse the directory for more."
              : "No recommendations yet. Pick your interests or browse all communities."}
          </p>
          <Button asChild className="mt-3 gs-gradient text-white rounded-xl" size="sm">
            <Link href="/community/browse">Browse directory</Link>
          </Button>
        </div>
      )}
      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/community/browse">View all communities</Link>
        </Button>
      </div>
    </div>
  )
}
