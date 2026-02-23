"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CommunityCard } from "@/components/community/community-card"
import { mockCommunities } from "@/data/mock-communities"
import {
  COMMUNITY_CATEGORY_LABELS,
  MAX_USER_INTEREST_CATEGORIES,
} from "@/data/community-categories"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight } from "lucide-react"
import type { Community } from "@/types/community"

const ONBOARDING_DONE_KEY = "community_onboarding_done"
const INTERESTS_KEY = "community_interests"

export default function CommunityOnboardingPage() {
  const router = useRouter()
  const [interests, setInterests] = useState<string[]>([])
  const [step, setStep] = useState<"interests" | "recommended">("interests")
  const [selectedToJoin, setSelectedToJoin] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(INTERESTS_KEY)
      if (stored) setInterests(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  const toggleInterest = (label: string) => {
    setInterests((prev) => {
      if (prev.includes(label)) return prev.filter((x) => x !== label)
      if (prev.length >= MAX_USER_INTEREST_CATEGORIES) return prev
      return [...prev, label]
    })
  }

  const saveAndContinue = () => {
    try {
      localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests))
    } catch {
      // ignore
    }
    setStep("recommended")
  }

  const skip = () => {
    try {
      localStorage.setItem(ONBOARDING_DONE_KEY, "true")
    } catch {
      // ignore
    }
    router.push("/community/browse")
  }

  const finishOnboarding = () => {
    try {
      localStorage.setItem(ONBOARDING_DONE_KEY, "true")
      // In a real app, would call API to join selectedToJoin communities
    } catch {
      // ignore
    }
    router.push("/community/my")
  }

  const recommended: Community[] = mockCommunities
    .filter(
      (c) =>
        c.privacy === "public" &&
        (interests.length === 0 || (c.categories ?? [c.category]).some((cat) => interests.includes(cat)))
    )
    .sort((a, b) => b.postCountThisWeek - a.postCountThisWeek)
    .slice(0, 10)

  const toggleJoin = (id: string) => {
    setSelectedToJoin((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {step === "interests" ? (
        <>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gs-gradient flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold gs-gradient-text">What are you interested in?</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Select up to {MAX_USER_INTEREST_CATEGORIES} categories. We’ll recommend communities you might like.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {COMMUNITY_CATEGORY_LABELS.map((label) => {
              const selected = interests.includes(label)
              const atMax = interests.length >= MAX_USER_INTEREST_CATEGORIES && !selected
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleInterest(label)}
                  disabled={atMax}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    selected
                      ? "gs-gradient text-white border-transparent shadow-md"
                      : atMax
                        ? "opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="ghost" onClick={skip} className="rounded-xl">
              Skip for now
            </Button>
            <Button onClick={saveAndContinue} className="gs-gradient text-white rounded-xl">
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold gs-gradient-text mb-2">Communities you might like</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Join a few to get started. You can always discover more from the directory.
          </p>
          {recommended.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">No recommendations right now. Browse the directory.</p>
              <Button asChild className="mt-4 gs-gradient text-white rounded-xl">
                <Link href="/community/browse">Browse directory</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommended.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-card"
                >
                  <input
                    type="checkbox"
                    checked={selectedToJoin.has(c.id)}
                    onChange={() => toggleJoin(c.id)}
                    className="rounded border-slate-300 text-[#0F7377] focus:ring-[#0F7377]"
                  />
                  <div className="flex-1 min-w-0">
                    <Link href={`/community/${c.slug}`} className="font-semibold text-slate-900 dark:text-white hover:text-[#0F7377] dark:hover:text-teal-400">
                      {c.name}
                    </Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{c.tagline}</p>
                  </div>
                  <Button
                    size="sm"
                    className="gs-gradient text-white rounded-lg"
                    onClick={() => toggleJoin(c.id)}
                  >
                    {selectedToJoin.has(c.id) ? "Joined" : "Join"}
                  </Button>
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("interests")} className="rounded-xl">
                  Back
                </Button>
                <Button onClick={finishOnboarding} className="gs-gradient text-white rounded-xl flex-1">
                  {selectedToJoin.size > 0 ? `Join ${selectedToJoin.size} & go to My Communities` : "Go to My Communities"}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
