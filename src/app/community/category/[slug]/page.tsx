"use client"

import { useParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { CommunityCard } from "@/components/community/community-card"
import { mockCommunities } from "@/data/mock-communities"
import { getCreatedCommunities } from "@/data/community-created-storage"
import {
  COMMUNITY_CATEGORY_LIST,
  getCategoryLabel,
} from "@/data/community-categories"
import { Button } from "@/components/ui/button"
import { Plus, Users, ChevronLeft } from "lucide-react"
import type { Community } from "@/types/community"

export default function CommunityCategoryPage() {
  const params = useParams()
  const slug = params?.slug as string
  const category = COMMUNITY_CATEGORY_LIST.find((c) => c.slug === slug)
  const label = category?.label ?? getCategoryLabel(slug)
  const [createdList, setCreatedList] = useState<Community[]>([])
  useEffect(() => {
    setCreatedList(getCreatedCommunities())
  }, [])

  const allCommunities = useMemo(() => {
    const created = createdList.filter((c) => !mockCommunities.some((m) => m.id === c.id))
    return [...mockCommunities, ...created]
  }, [createdList])

  const communities: Community[] = allCommunities.filter(
    (c) =>
      c.privacy !== "secret" &&
      ((c.categories ?? [c.category]).includes(label) || c.category === label)
  )

  const totalMembers = communities.reduce((sum, c) => sum + c.memberCount, 0)
  const activeThisWeek = communities.reduce((sum, c) => sum + c.postCountThisWeek, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/community/browse"
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to directory
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold gs-gradient-text">{label}</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {communities.length} {communities.length === 1 ? "community" : "communities"} · {totalMembers.toLocaleString()} members · {activeThisWeek} posts this week
        </p>
        <Button asChild className="mt-4 gs-gradient text-white rounded-xl">
          <Link href="/community/create">
            <Plus className="h-4 w-4 mr-2" />
            Create your own {label} community
          </Link>
        </Button>
      </div>

      {communities.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
          <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">No communities in this category yet.</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Be the first to create one.</p>
          <Button asChild className="mt-4 gs-gradient text-white rounded-xl">
            <Link href="/community/create">Create community</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      )}
    </div>
  )
}
