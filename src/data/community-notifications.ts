/** Community notifications (mentions, replies, join requests, etc.) – persisted in localStorage. */

export type CommunityNotificationType =
  | "mention"   // Someone mentioned you in a post/comment
  | "reply"    // Reply to your post/comment
  | "post"     // New post in a channel you follow
  | "join_request"
  | "event"
  | "other"

export interface CommunityNotification {
  id: string
  type: CommunityNotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  communityId?: string
  communityName?: string
  communitySlug?: string
  postId?: string
  /** For mention: who mentioned you (author name). */
  authorName?: string
}

const STORAGE_KEY = "community_notifications"

function load(): CommunityNotification[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CommunityNotification[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save(list: CommunityNotification[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // ignore
  }
}

export function getCommunityNotifications(): CommunityNotification[] {
  return load().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addCommunityNotification(
  payload: Omit<CommunityNotification, "id" | "read" | "createdAt">
): CommunityNotification {
  const list = load()
  const item: CommunityNotification = {
    ...payload,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    read: false,
    createdAt: new Date().toISOString(),
  }
  list.unshift(item)
  save(list)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("community-notifications-updated"))
  }
  return item
}

export function markCommunityNotificationRead(id: string): void {
  const list = load()
  const idx = list.findIndex((n) => n.id === id)
  if (idx !== -1) {
    list[idx] = { ...list[idx], read: true }
    save(list)
  }
}

export function markAllCommunityNotificationsRead(): void {
  const list = load().map((n) => ({ ...n, read: true }))
  save(list)
}
