"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { CommunityCard } from "@/components/community/community-card"
import { DirectoryFilters, type SortOption, type SizeFilter } from "@/components/community/directory-filters"
import { mockCommunities } from "@/data/mock-communities"
import { getCreatedCommunities } from "@/data/community-created-storage"
import { COMMUNITY_CATEGORY_LIST, COMMUNITY_CATEGORY_LABELS } from "@/data/community-categories"
import { Button } from "@/components/ui/button"
import { Plus, Users, LayoutGrid } from "lucide-react"
import type { Community } from "@/types/community"

export type TopLevelFilter = "all" | "trending" | "new" | "recommended" | "by-category"

export default function CommunityBrowsePage() {
  const [topLevel, setTopLevel] = useState<TopLevelFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState<SortOption>("trending")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>("all")
  const [createdList, setCreatedList] = useState<Community[]>([])
  useEffect(() => {
    setCreatedList(getCreatedCommunities())
  }, [])

  const allCommunities = useMemo(() => {
    const created = createdList.filter((c) => !mockCommunities.some((m) => m.id === c.id))
    return [...mockCommunities, ...created]
  }, [createdList])

  const filtered = useMemo(() => {
    let list: Community[] = allCommunities.filter((c) => c.privacy !== "secret")
    if (verifiedOnly) list = list.filter((c) => c.verified)
    if (sizeFilter === "small") list = list.filter((c) => c.memberCount < 500)
    else if (sizeFilter === "medium") list = list.filter((c) => c.memberCount >= 500 && c.memberCount < 2000)
    else if (sizeFilter === "large") list = list.filter((c) => c.memberCount >= 2000)
    const q = searchQuery.toLowerCase().trim()
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.category && c.category.toLowerCase().includes(q)) ||
          (c.categories && c.categories.some((cat) => cat.toLowerCase().includes(q))) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (category !== "all") {
      list = list.filter(
        (c) => c.category === category || (c.categories && c.categories.includes(category))
      )
    }
    if (topLevel === "trending") list.sort((a, b) => b.postCountThisWeek - a.postCountThisWeek)
    else if (topLevel === "new") {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 30)
      list = list.filter((c) => new Date(c.createdAt) >= cutoff)
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (topLevel === "recommended") {
      try {
        if (typeof window !== "undefined") {
          const interests = JSON.parse(localStorage.getItem("community_interests") ?? "[]") as string[]
          if (interests.length > 0) {
            list = list.filter((c) => (c.categories ?? [c.category]).some((cat) => interests.includes(cat)))
          }
        }
        list.sort((a, b) => b.postCountThisWeek - a.postCountThisWeek)
      } catch {
        list.sort((a, b) => b.postCountThisWeek - a.postCountThisWeek)
      }
    } else if (sort === "members") list.sort((a, b) => b.memberCount - a.memberCount)
    else if (sort === "activity") list.sort((a, b) => b.postCountThisWeek - a.postCountThisWeek)
    else if (sort === "recent") list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    else if (sort === "new") {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 30)
      list = list.filter((c) => new Date(c.createdAt) >= cutoff)
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else {
      list.sort((a, b) => b.postCountThisWeek - a.postCountThisWeek)
    }
    return list
  }, [allCommunities, searchQuery, category, sort, topLevel, verifiedOnly, sizeFilter])

  const clearFilters = () => {
    setTopLevel("all")
    setSearchQuery("")
    setCategory("all")
    setSort("trending")
    setVerifiedOnly(false)
    setSizeFilter("all")
  }

  const featured = allCommunities.filter((c) => c.featured)
  const [onboardingDone, setOnboardingDone] = useState(true)
  useEffect(() => {
    try {
      setOnboardingDone(localStorage.getItem("community_onboarding_done") === "true")
    } catch {
      setOnboardingDone(true)
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {!onboardingDone && (
        <div className="mb-6 p-4 rounded-xl border border-[#0F7377]/30 dark:border-teal-500/30 bg-[#0F7377]/5 dark:bg-teal-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Get personalized recommendations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Select your interests and we’ll suggest communities you might like.</p>
          </div>
          <Button asChild size="sm" className="gs-gradient text-white rounded-xl shrink-0">
            <Link href="/community/onboarding">Pick interests</Link>
          </Button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold gs-gradient-text">Community directory</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Find and join communities, or create your own in a few steps.
          </p>
        </div>
        <Button asChild className="gs-gradient text-white rounded-xl shrink-0 gap-2" title="Start the create-community wizard">
          <Link href="/community/create">
            <Plus className="h-4 w-4" />
            Create community
          </Link>
        </Button>
      </div>

      {featured.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Community of the month
          </h2>
          <div className="rounded-2xl border border-[#0F7377]/20 dark:border-teal-500/30 bg-gradient-to-br from-[#0F7377]/5 to-[#00A884]/5 dark:from-teal-500/10 dark:to-teal-500/5 p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <img
                src={featured[0].logoUrl}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{featured[0].name}</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{featured[0].tagline}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {featured[0].memberCount.toLocaleString()} members
                  </span>
                  {featured[0].activeNow != null && featured[0].activeNow > 0 && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {featured[0].activeNow} online
                    </span>
                  )}
                  {(featured[0].activeMembers24h != null && featured[0].activeMembers24h > 0) && (
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      {featured[0].activeMembers24h} active in 24h
                    </span>
                  )}
                  <span>{featured[0].postCountThisWeek} posts this week</span>
                </div>
                <Button asChild size="sm" className="mt-3 gs-gradient text-white rounded-lg">
                  <Link href={`/community/${featured[0].slug}`}>View community</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto overflow-y-hidden mb-4" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="flex gap-2 pb-1 min-h-[48px] items-center sm:flex-wrap">
          {(["all", "trending", "new", "recommended", "by-category"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTopLevel(tab)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center transition-all ${
                topLevel === tab
                  ? "gs-gradient text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 active:bg-slate-200 dark:active:bg-slate-700"
              }`}
            >
              {tab === "all" ? "All" : tab === "by-category" ? "By Category" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {topLevel === "by-category" ? (
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Browse by category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {COMMUNITY_CATEGORY_LIST.map((c) => {
              const count = allCommunities.filter(
                (co) => co.privacy !== "secret" && (co.category === c.label || (co.categories && co.categories.includes(c.label)))
              ).length
              return (
                <Link
                  key={c.slug}
                  href={`/community/category/${c.slug}`}
                  className="flex flex-col p-4 rounded-xl border border-slate-200 dark:border-slate-700 gs-card-hover bg-card"
                >
                  <LayoutGrid className="h-6 w-6 text-[#0F7377] dark:text-teal-400 mb-2" />
                  <span className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2">{c.label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{count} communities</span>
                </Link>
              )
            })}
          </div>
        </section>
      ) : (
        <>
      <DirectoryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        resultCount={filtered.length}
        verifiedOnly={verifiedOnly}
        onVerifiedOnlyChange={setVerifiedOnly}
        sizeFilter={sizeFilter}
        onSizeFilterChange={setSizeFilter}
        onClearFilters={clearFilters}
      />
      {searchQuery.trim().length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
          <span className="text-slate-500 dark:text-slate-400">Categories:</span>
          {COMMUNITY_CATEGORY_LABELS.filter((label) =>
            label.toLowerCase().includes(searchQuery.toLowerCase().trim())
          ).slice(0, 5).map((label) => {
            const c = COMMUNITY_CATEGORY_LIST.find((x) => x.label === label)
            return (
              <Link
                key={label}
                href={c ? `/community/category/${c.slug}` : "/community/browse"}
                className="px-2.5 py-1 rounded-lg bg-[#0F7377]/10 dark:bg-teal-500/20 text-[#0F7377] dark:text-teal-400 hover:bg-[#0F7377]/20 dark:hover:bg-teal-500/30 transition-colors"
              >
                {label}
              </Link>
            )
          })}
          {COMMUNITY_CATEGORY_LABELS.filter((label) =>
            label.toLowerCase().includes(searchQuery.toLowerCase().trim())
          ).length === 0 && (
            <span className="text-slate-400 dark:text-slate-500">No matching category</span>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
          <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">No communities match your filters.</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Try clearing filters or create your own.</p>
          <div className="flex gap-3 justify-center mt-4">
            <Button variant="outline" onClick={clearFilters} className="rounded-xl">
              Clear filters
            </Button>
            <Button asChild className="gs-gradient text-white rounded-xl">
              <Link href="/community/create">Create community</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
              : "flex flex-col gap-4 mt-6"
          }
        >
          {filtered.map((c) => (
            <CommunityCard
              key={c.id}
              community={c}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
        </>
      )}
    </div>
  )
}
