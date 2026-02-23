"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, MessageSquare } from "lucide-react"
import {
  getRulesAccepted,
  setRulesAccepted,
  getWelcomeInterests,
  setWelcomeInterests,
} from "@/data/community-welcome-onboarding-storage"
import type { Community } from "@/types/community"

interface CommunityWelcomeOnboardingProps {
  community: Community
  /** Call when user clicks "Introduce yourself" to focus composer. */
  onIntroduceYourself?: () => void
  onDismiss?: () => void
}

export function CommunityWelcomeOnboarding({
  community,
  onIntroduceYourself,
  onDismiss,
}: CommunityWelcomeOnboardingProps) {
  const [rulesAccepted, setRulesAcceptedState] = useState(false)
  const [agreeChecked, setAgreeChecked] = useState(false)
  const [interests, setInterests] = useState<string[]>([])
  const [showInterests, setShowInterests] = useState(false)

  const interestOptions = [
    ...(community.categories ?? [community.category]),
    ...community.tags,
  ].filter(Boolean) as string[]

  useEffect(() => {
    setRulesAcceptedState(getRulesAccepted(community.id))
    setInterests(getWelcomeInterests(community.id))
  }, [community.id])

  const handleGetStarted = () => {
    if (community.guidelines && !agreeChecked) return
    if (community.guidelines) setRulesAccepted(community.id)
    setWelcomeInterests(community.id, interests)
    setRulesAcceptedState(true)
    onDismiss?.()
  }

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    )
  }

  if (rulesAccepted) return null

  return (
    <div className="mb-6 rounded-xl bg-[#0F7377]/10 dark:bg-teal-500/20 border border-[#0F7377]/20 dark:border-teal-500/30 p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
            Welcome to {community.name}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
            Complete a quick setup to get the most out of the community.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRulesAccepted(community.id)
            onDismiss?.()
          }}
          className="shrink-0 p-1 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          aria-label="Skip"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {community.guidelines && (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 text-sm">
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap line-clamp-3">
            {community.guidelines}
          </p>
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeChecked}
              onChange={(e) => setAgreeChecked(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-600 text-[#0F7377] focus:ring-[#0F7377]"
            />
            <span className="text-slate-600 dark:text-slate-400 text-sm">
              I&apos;ve read and agree to the community guidelines
            </span>
          </label>
        </div>
      )}

      {interestOptions.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowInterests((v) => !v)}
            className="text-sm font-medium text-[#0F7377] dark:text-teal-400 hover:underline"
          >
            {showInterests ? "Hide" : "Pick"} topics you&apos;re interested in (optional)
          </button>
          {showInterests && (
            <div className="flex flex-wrap gap-2 mt-2">
              {interestOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    interests.includes(item)
                      ? "gs-gradient text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          className="gs-gradient text-white rounded-lg gap-2"
          onClick={handleGetStarted}
          disabled={!!community.guidelines && !agreeChecked}
        >
          <Check className="h-4 w-4" />
          Get started
        </Button>
        {onIntroduceYourself && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg gap-2 border-[#0F7377]/30 dark:border-teal-500/40 text-[#0F7377] dark:text-teal-400"
            onClick={() => {
              setRulesAccepted(community.id)
              setWelcomeInterests(community.id, interests)
              onDismiss?.()
              onIntroduceYourself()
            }}
          >
            <MessageSquare className="h-4 w-4" />
            Introduce yourself
          </Button>
        )}
      </div>
    </div>
  )
}
