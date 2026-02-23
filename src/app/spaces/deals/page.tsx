"use client"

import Link from "next/link"
import { Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SpaceCard } from "@/components/spaces/space-card"
import { getSpacesWithStartupOffer } from "@/data/spaces-storage"

export default function StartupDealsPage() {
  const spaces = getSpacesWithStartupOffer()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="h-7 w-7 text-[#0F7377] dark:text-teal-400" />
          Startup Deals
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
          Curated discounts and free trials for verified GrowthLab startups.
        </p>
      </div>
      {spaces.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">No startup deals at the moment.</p>
          <Button asChild className="mt-4 gs-gradient text-white">
            <Link href="/spaces/explore">Explore all spaces</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  )
}
