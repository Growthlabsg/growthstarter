/** Gamification types for community badges, points, streaks, leaderboard. */

export type BadgeId =
  | "first_post"
  | "top_poster"
  | "event_host"
  | "helpful"
  | "streak_7"
  | "streak_30"
  | "early_member"
  | "reaction_master"

export const BADGE_DEFINITIONS: Record<
  BadgeId,
  { label: string; description: string; emoji: string }
> = {
  first_post: { label: "First post", description: "Posted for the first time", emoji: "✨" },
  top_poster: { label: "Top Poster", description: "Among top contributors by posts", emoji: "📝" },
  event_host: { label: "Event Host", description: "Created a community event", emoji: "📅" },
  helpful: { label: "Helpful", description: "Received 10+ reactions on posts", emoji: "💡" },
  streak_7: { label: "7-day streak", description: "Active 7 days in a row", emoji: "🔥" },
  streak_30: { label: "30-day streak", description: "Active 30 days in a row", emoji: "⭐" },
  early_member: { label: "Early member", description: "Joined in the first 100 members", emoji: "🌱" },
  reaction_master: { label: "Reaction master", description: "Gave 50+ reactions", emoji: "👍" },
}

/** Contributor title shown next to name (can be derived from badges or rank). */
export type ContributorTitleId =
  | "top_poster"
  | "event_host"
  | "new_member"
  | "regular"
  | "champion"

export const CONTRIBUTOR_TITLE_LABELS: Record<ContributorTitleId, string> = {
  top_poster: "Top Poster",
  event_host: "Event Host",
  new_member: "New Member",
  regular: "Regular",
  champion: "Champion",
}

export interface MemberGamificationStats {
  userId: string
  communityId: string
  points: number
  /** Current streak (consecutive days with activity). */
  streak: number
  /** Last calendar date (YYYY-MM-DD) with activity. */
  lastActivityDate: string | null
  badges: BadgeId[]
  /** Post count in this community (for "Top Poster" etc.). */
  postCount: number
  /** Reactions given in this community. */
  reactionsGiven: number
  /** Events created in this community. */
  eventsCreated: number
}

export type GamificationAction = "post" | "reaction" | "event_created" | "event_attended"

export interface CommunityGamificationSettings {
  leaderboardEnabled: boolean
  pointsForPost: number
  pointsForReaction: number
  pointsForEventCreated: number
  pointsForEventAttended: number
}

export const DEFAULT_GAMIFICATION_SETTINGS: CommunityGamificationSettings = {
  leaderboardEnabled: true,
  pointsForPost: 10,
  pointsForReaction: 1,
  pointsForEventCreated: 25,
  pointsForEventAttended: 5,
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  userAvatar: string
  points: number
  streak: number
  badges: BadgeId[]
  rank: number
}
