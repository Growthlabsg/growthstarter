/** User preferences for community notifications: digest and per-community toggles. */

export type DigestOption = "off" | "daily" | "weekly"

export interface CommunityNotificationPreferences {
  digest: DigestOption
  /** communityId -> true = notify for this community */
  perCommunity: Record<string, boolean>
  /** Granular: only mentions (when true, other activity can be batched in digest). */
  mentionsOnly?: boolean
  repliesOnly?: boolean
  newEvents?: boolean
}

const STORAGE_KEY = "community_notification_preferences"

function load(): CommunityNotificationPreferences {
  if (typeof window === "undefined") {
    return { digest: "off", perCommunity: {}, mentionsOnly: false, repliesOnly: false, newEvents: true }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { digest: "off", perCommunity: {}, mentionsOnly: false, repliesOnly: false, newEvents: true }
    const parsed = JSON.parse(raw) as CommunityNotificationPreferences
    return {
      digest: parsed.digest === "daily" || parsed.digest === "weekly" ? parsed.digest : "off",
      perCommunity: typeof parsed.perCommunity === "object" ? parsed.perCommunity : {},
      mentionsOnly: !!parsed.mentionsOnly,
      repliesOnly: !!parsed.repliesOnly,
      newEvents: parsed.newEvents !== false,
    }
  } catch {
    return { digest: "off", perCommunity: {}, mentionsOnly: false, repliesOnly: false, newEvents: true }
  }
}

export function setGranularToggles(updates: Partial<Pick<CommunityNotificationPreferences, "mentionsOnly" | "repliesOnly" | "newEvents">>) {
  const prefs = load()
  if ("mentionsOnly" in updates) prefs.mentionsOnly = updates.mentionsOnly
  if ("repliesOnly" in updates) prefs.repliesOnly = updates.repliesOnly
  if ("newEvents" in updates) prefs.newEvents = updates.newEvents
  save(prefs)
}

function save(prefs: CommunityNotificationPreferences) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    window.dispatchEvent(new CustomEvent("community-notification-preferences-updated"))
  } catch {
    // ignore
  }
}

export function getCommunityNotificationPreferences(): CommunityNotificationPreferences {
  return load()
}

export function setCommunityNotificationPreferences(prefs: CommunityNotificationPreferences): void {
  save(prefs)
}

export function setDigest(digest: DigestOption): void {
  const prefs = load()
  prefs.digest = digest
  save(prefs)
}

export function setCommunityEnabled(communityId: string, enabled: boolean): void {
  const prefs = load()
  if (enabled) {
    prefs.perCommunity[communityId] = true
  } else {
    delete prefs.perCommunity[communityId]
  }
  save(prefs)
}

export function isCommunityNotificationsEnabled(communityId: string): boolean {
  const prefs = load()
  return prefs.perCommunity[communityId] ?? true
}
