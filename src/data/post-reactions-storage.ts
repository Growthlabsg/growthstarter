/** Rich reactions on posts – current user's reaction persisted per post. */

const USER_REACTION_PREFIX = "community_post_user_reaction_"

export const REACTION_OPTIONS: { key: string; label: string; emoji: string }[] = [
  { key: "like", label: "Like", emoji: "👍" },
  { key: "love", label: "Love", emoji: "❤️" },
  { key: "insightful", label: "Insightful", emoji: "💡" },
  { key: "clap", label: "Clap", emoji: "👏" },
  { key: "question", label: "Question", emoji: "❓" },
  { key: "celebrate", label: "Celebrate", emoji: "🎉" },
]

export function getCurrentUserReaction(postId: string): string | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(USER_REACTION_PREFIX + postId)
    return raw || null
  } catch {
    return null
  }
}

export function setUserReaction(postId: string, reactionKey: string | null): void {
  if (typeof window === "undefined") return
  try {
    if (reactionKey) {
      localStorage.setItem(USER_REACTION_PREFIX + postId, reactionKey)
    } else {
      localStorage.removeItem(USER_REACTION_PREFIX + postId)
    }
    window.dispatchEvent(new CustomEvent("post-reactions-updated", { detail: { postId } }))
  } catch {}
}

/** Merge base (post.reactions from mock/API) with current user's reaction. */
export function getMergedReactions(
  postId: string,
  baseReactions?: Record<string, number> | null
): Record<string, number> {
  const base = baseReactions ?? {}
  const result = { ...base }
  const myReaction = getCurrentUserReaction(postId)
  if (myReaction) {
    result[myReaction] = (result[myReaction] ?? 0) + 1
  }
  return result
}
