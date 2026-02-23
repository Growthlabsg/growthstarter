/**
 * Gamification storage: points, streaks, badges, leaderboard per community.
 * Persisted in localStorage; keyed by communityId.
 */

import type {
  MemberGamificationStats,
  CommunityGamificationSettings,
  LeaderboardEntry,
  BadgeId,
  GamificationAction,
} from "@/types/community-gamification"
import {
  DEFAULT_GAMIFICATION_SETTINGS,
  BADGE_DEFINITIONS,
  CONTRIBUTOR_TITLE_LABELS,
  type ContributorTitleId,
} from "@/types/community-gamification"
import { mockCommunityMembers } from "@/data/mock-communities"

const MEMBERS_PREFIX = "community_gamification_members_"
const SETTINGS_PREFIX = "community_gamification_settings_"
const CURRENT_USER_ID = "current-user"

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function loadMemberStats(communityId: string, userId: string): MemberGamificationStats | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(MEMBERS_PREFIX + communityId)
    if (!raw) return null
    const map: Record<string, MemberGamificationStats> = JSON.parse(raw)
    return map[userId] ?? null
  } catch {
    return null
  }
}

function saveMemberStats(communityId: string, stats: MemberGamificationStats): void {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(MEMBERS_PREFIX + communityId)
    const map: Record<string, MemberGamificationStats> = raw ? JSON.parse(raw) : {}
    map[stats.userId] = stats
    localStorage.setItem(MEMBERS_PREFIX + communityId, JSON.stringify(map))
    window.dispatchEvent(
      new CustomEvent("community-gamification-updated", { detail: { communityId } })
    )
  } catch {}
}

function getOrCreateStats(communityId: string, userId: string): MemberGamificationStats {
  const existing = loadMemberStats(communityId, userId)
  if (existing) return existing
  return {
    userId,
    communityId,
    points: 0,
    streak: 0,
    lastActivityDate: null,
    badges: [],
    postCount: 0,
    reactionsGiven: 0,
    eventsCreated: 0,
  }
}

function ensureBadges(stats: MemberGamificationStats): MemberGamificationStats {
  const badges = new Set(stats.badges)
  if (stats.postCount >= 1 && !badges.has("first_post")) badges.add("first_post")
  if (stats.postCount >= 5 && !badges.has("top_poster")) badges.add("top_poster")
  if (stats.eventsCreated >= 1 && !badges.has("event_host")) badges.add("event_host")
  if (stats.streak >= 7 && !badges.has("streak_7")) badges.add("streak_7")
  if (stats.streak >= 30 && !badges.has("streak_30")) badges.add("streak_30")
  if (stats.reactionsGiven >= 50 && !badges.has("reaction_master")) badges.add("reaction_master")
  return { ...stats, badges: Array.from(badges) }
}

function updateStreak(stats: MemberGamificationStats): MemberGamificationStats {
  const today = todayStr()
  if (stats.lastActivityDate === today) return stats
  const prev = stats.lastActivityDate
  let streak = stats.streak
  if (!prev) {
    streak = 1
  } else {
    const prevDate = new Date(prev)
    const todayDate = new Date(today)
    const diffDays = Math.round((todayDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000))
    if (diffDays === 1) streak += 1
    else if (diffDays > 1) streak = 1
  }
  return { ...stats, lastActivityDate: today, streak }
}

export function getCommunityGamificationSettings(
  communityId: string
): CommunityGamificationSettings {
  if (typeof window === "undefined") return DEFAULT_GAMIFICATION_SETTINGS
  try {
    const raw = localStorage.getItem(SETTINGS_PREFIX + communityId)
    if (!raw) return DEFAULT_GAMIFICATION_SETTINGS
    return { ...DEFAULT_GAMIFICATION_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_GAMIFICATION_SETTINGS
  }
}

export function setLeaderboardEnabled(communityId: string, enabled: boolean): void {
  if (typeof window === "undefined") return
  try {
    const current = getCommunityGamificationSettings(communityId)
    const next = { ...current, leaderboardEnabled: enabled }
    localStorage.setItem(SETTINGS_PREFIX + communityId, JSON.stringify(next))
    window.dispatchEvent(
      new CustomEvent("community-gamification-updated", { detail: { communityId } })
    )
  } catch {}
}

export function getMemberStats(
  communityId: string,
  userId: string
): MemberGamificationStats | null {
  const stats = loadMemberStats(communityId, userId)
  if (!stats) return null
  return ensureBadges(stats)
}

export function getMemberStatsOrDefault(
  communityId: string,
  userId: string
): MemberGamificationStats {
  return ensureBadges(getOrCreateStats(communityId, userId))
}

/** Award points for an action and update streak; returns updated stats. */
export function awardPoints(
  communityId: string,
  userId: string,
  action: GamificationAction
): MemberGamificationStats | null {
  if (typeof window === "undefined") return null
  const settings = getCommunityGamificationSettings(communityId)
  let points = 0
  let stats = getOrCreateStats(communityId, userId)
  stats = updateStreak(stats)

  switch (action) {
    case "post":
      points = settings.pointsForPost
      stats = { ...stats, postCount: stats.postCount + 1 }
      break
    case "reaction":
      points = settings.pointsForReaction
      stats = { ...stats, reactionsGiven: stats.reactionsGiven + 1 }
      break
    case "event_created":
      points = settings.pointsForEventCreated
      stats = { ...stats, eventsCreated: stats.eventsCreated + 1 }
      break
    case "event_attended":
      points = settings.pointsForEventAttended
      break
    default:
      return null
  }

  stats = { ...stats, points: stats.points + points }
  stats = ensureBadges(stats)
  saveMemberStats(communityId, stats)
  return stats
}

/** Get contributor title for display (from badges or rank). */
export function getContributorTitle(
  communityId: string,
  userId: string
): { id: ContributorTitleId; label: string } | null {
  const stats = getMemberStats(communityId, userId)
  if (!stats) return null
  if (stats.badges.includes("top_poster")) return { id: "top_poster", label: CONTRIBUTOR_TITLE_LABELS.top_poster }
  if (stats.badges.includes("event_host")) return { id: "event_host", label: CONTRIBUTOR_TITLE_LABELS.event_host }
  if (stats.postCount === 0 && stats.points < 20) return { id: "new_member", label: CONTRIBUTOR_TITLE_LABELS.new_member }
  if (stats.points >= 100) return { id: "champion", label: CONTRIBUTOR_TITLE_LABELS.champion }
  return { id: "regular", label: CONTRIBUTOR_TITLE_LABELS.regular }
}

function getUserDisplay(communityId: string, userId: string): { name: string; avatar: string } {
  const m = mockCommunityMembers.find(
    (x) => x.communityId === communityId && x.userId === userId
  )
  if (m) return { name: m.userName ?? "Member", avatar: m.userAvatar ?? "" }
  if (userId === CURRENT_USER_ID) return { name: "You", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" }
  return { name: "Member", avatar: "" }
}

/** Leaderboard for a community (top N by points). Requires leaderboard enabled. */
export function getLeaderboard(
  communityId: string,
  limit: number = 10
): LeaderboardEntry[] {
  if (typeof window === "undefined") return []
  const settings = getCommunityGamificationSettings(communityId)
  if (!settings.leaderboardEnabled) return []
  try {
    const raw = localStorage.getItem(MEMBERS_PREFIX + communityId)
    if (!raw) return []
    const map: Record<string, MemberGamificationStats> = JSON.parse(raw)
    const list = Object.values(map)
      .map((s) => ensureBadges(s))
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
    return list.map((s, i) => {
      const { name, avatar } = getUserDisplay(communityId, s.userId)
      return {
        userId: s.userId,
        userName: name,
        userAvatar: avatar,
        points: s.points,
        streak: s.streak,
        badges: s.badges,
        rank: i + 1,
      }
    })
  } catch {
    return []
  }
}

export function getBadgeLabel(badgeId: BadgeId): string {
  return BADGE_DEFINITIONS[badgeId]?.label ?? badgeId
}

export function getBadgeEmoji(badgeId: BadgeId): string {
  return BADGE_DEFINITIONS[badgeId]?.emoji ?? "•"
}
