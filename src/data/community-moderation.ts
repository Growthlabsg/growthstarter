/**
 * Auto-moderation: admins can enable rules; the system auto-rejects posts that violate them.
 */

export type ModerationPreset = "off" | "low" | "medium" | "strict"

export interface ModerationSettings {
  enabled: boolean
  preset: ModerationPreset
  /** Newline-separated blocked words/phrases (case-insensitive match). */
  blocklist: string
}

const STORAGE_PREFIX = "community_moderation_"

const DEFAULT_SETTINGS: ModerationSettings = {
  enabled: false,
  preset: "off",
  blocklist: "",
}

export function getModerationSettings(communityId: string): ModerationSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + communityId)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<ModerationSettings>
    return {
      enabled: parsed.enabled ?? false,
      preset: parsed.preset ?? "off",
      blocklist: parsed.blocklist ?? "",
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveModerationSettings(
  communityId: string,
  settings: ModerationSettings
): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + communityId, JSON.stringify(settings))
  } catch {}
}

export const PRESET_LABELS: Record<ModerationPreset, string> = {
  off: "Off – no auto-moderation",
  low: "Low – blocklist only",
  medium: "Medium – blocklist + max 3 links",
  strict: "Strict – blocklist + max 2 links + min 20 characters",
}

/** Returns { allowed: false, reason } if content should be rejected. */
export function checkContent(
  content: string,
  settings: ModerationSettings
): { allowed: true } | { allowed: false; reason: string } {
  if (!settings.enabled || settings.preset === "off") return { allowed: true }

  const text = content.trim()
  const lower = text.toLowerCase()

  // Blocklist: phrases (one per line), case-insensitive
  const phrases = settings.blocklist
    .split("\n")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  for (const phrase of phrases) {
    if (lower.includes(phrase)) {
      return { allowed: false, reason: "Your post contains a word or phrase that isn't allowed in this community." }
    }
  }

  // Link count (rough: http/https or www.)
  const linkCount = (text.match(/https?:\/\//gi) || []).length + (text.match(/\bwww\./gi) || []).length
  if (settings.preset === "medium" && linkCount > 3) {
    return { allowed: false, reason: "Maximum 3 links per post. Please shorten your message." }
  }
  if (settings.preset === "strict" && linkCount > 2) {
    return { allowed: false, reason: "Maximum 2 links per post. Please shorten your message." }
  }

  if (settings.preset === "strict" && text.length < 20) {
    return { allowed: false, reason: "Posts must be at least 20 characters." }
  }

  return { allowed: true }
}
