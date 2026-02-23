/** Lite social graph: current user's "following" list (member IDs). */

const KEY = "community_member_following"

function load(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []
  } catch {
    return []
  }
}

function save(ids: string[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(KEY, JSON.stringify(ids))
    window.dispatchEvent(new CustomEvent("member-follow-updated"))
  } catch {}
}

export function getFollowing(): string[] {
  return load()
}

export function isFollowing(userId: string): boolean {
  return load().includes(userId)
}

export function toggleFollow(userId: string): boolean {
  const list = load()
  const idx = list.indexOf(userId)
  if (idx >= 0) {
    list.splice(idx, 1)
    save(list)
    return false
  }
  list.push(userId)
  save(list)
  return true
}
