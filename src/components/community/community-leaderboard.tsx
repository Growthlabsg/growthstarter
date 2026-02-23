"use client"

import { useState, useEffect } from "react"
import {
  getLeaderboard,
  getCommunityGamificationSettings,
  getBadgeEmoji,
} from "@/data/community-gamification-storage"
import type { LeaderboardEntry } from "@/types/community-gamification"
import { Trophy } from "lucide-react"

interface CommunityLeaderboardProps {
  communityId: string
  limit?: number
  /** Compact: single row of top 3. Default false = list. */
  compact?: boolean
}

export function CommunityLeaderboard({
  communityId,
  limit = 10,
  compact = false,
}: CommunityLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const settings = getCommunityGamificationSettings(communityId)
    setEnabled(settings.leaderboardEnabled)
    if (settings.leaderboardEnabled) {
      setEntries(getLeaderboard(communityId, limit))
    }
  }, [communityId, limit])

  useEffect(() => {
    const handler = () => {
      if (getCommunityGamificationSettings(communityId).leaderboardEnabled) {
        setEntries(getLeaderboard(communityId, limit))
      }
    }
    window.addEventListener("community-gamification-updated", handler)
    return () => window.removeEventListener("community-gamification-updated", handler)
  }, [communityId, limit])

  if (!enabled || entries.length === 0) return null

  if (compact) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Top contributors
        </div>
        <div className="flex gap-4 flex-wrap">
          {entries.slice(0, 3).map((e) => (
            <div key={e.userId} className="flex items-center gap-2">
              <img
                src={e.userAvatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm truncate max-w-[120px]">
                  {e.userName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {e.points} pts · {e.badges.slice(0, 2).map((b) => getBadgeEmoji(b)).join(" ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
        <Trophy className="h-4 w-4 text-amber-500" />
        Leaderboard
      </div>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li
            key={e.userId}
            className="flex items-center gap-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <span className="text-slate-400 dark:text-slate-500 w-5 text-sm font-medium">
              #{e.rank}
            </span>
            <img
              src={e.userAvatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                {e.userName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {e.points} points
                {e.streak > 0 && ` · ${e.streak} day streak`}
              </p>
            </div>
            <div className="flex gap-0.5 shrink-0">
              {e.badges.slice(0, 4).map((b) => (
                <span key={b} title={b}>
                  {getBadgeEmoji(b)}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
