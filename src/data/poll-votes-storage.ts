/** User's poll votes – persisted per post in localStorage. */

const PREFIX = "community_poll_vote_"

export function getPollVote(postId: string): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(PREFIX + postId)
  } catch {
    return null
  }
}

export function setPollVote(postId: string, optionId: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(PREFIX + postId, optionId)
    window.dispatchEvent(new CustomEvent("poll-vote-updated", { detail: { postId } }))
  } catch {}
}
