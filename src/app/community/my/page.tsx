"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { CommunityCard } from "@/components/community/community-card"
import { useCommunityJoin } from "@/components/community/community-join-context"
import { mockCommunities } from "@/data/mock-communities"
import { getCreatedCommunities } from "@/data/community-created-storage"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"

export default function MyCommunitiesPage() {
  const { joinedCommunityIds } = useCommunityJoin()
  const [createdList, setCreatedList] = useState(getCreatedCommunities())
  useEffect(() => {
    setCreatedList(getCreatedCommunities())
  }, [])

  const allCommunities = useMemo(() => {
    const created = createdList.filter((c) => !mockCommunities.some((m) => m.id === c.id))
    return [...mockCommunities, ...created]
  }, [createdList])

  const joined = allCommunities.filter((c) => joinedCommunityIds.includes(c.id))
  const built = allCommunities.filter((c) => c.ownerId === "current-user")

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold gs-gradient-text mb-2">My communities</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Communities you’ve joined and communities you manage. Open any to view the feed, members, events, or admin.
          </p>
        </div>
        <Button asChild className="gs-gradient text-white rounded-xl shrink-0 gap-2">
          <Link href="/community/create">
            <Plus className="h-4 w-4" />
            Create community
          </Link>
        </Button>
      </div>

      {built.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Built by you
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {built.map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Joined
        </h2>
        {joined.length === 0 && built.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">You’re not in any communities yet.</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Browse the directory or create your own.</p>
            <div className="flex gap-3 justify-center mt-6">
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/community/browse">Browse directory</Link>
              </Button>
              <Button asChild className="gs-gradient text-white rounded-xl">
                <Link href="/community/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create community
                </Link>
              </Button>
            </div>
          </div>
        ) : joined.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">You haven’t joined any communities yet.</p>
            <Button asChild className="mt-3 gs-gradient text-white rounded-xl" size="sm">
              <Link href="/community/browse">Browse directory</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {joined.map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
