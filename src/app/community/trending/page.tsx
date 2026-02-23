"use client"

import Link from "next/link"
import { CommunityCard } from "@/components/community/community-card"
import { mockCommunities } from "@/data/mock-communities"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CommunityTrendingPage() {
  const trending = [...mockCommunities].sort((a, b) => b.postCountThisWeek - a.postCountThisWeek)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold gs-gradient-text mb-2">Trending communities</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Communities with the most activity this week.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trending.map((c) => (
          <CommunityCard key={c.id} community={c} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/community/browse">View all communities</Link>
        </Button>
      </div>
    </div>
  )
}
