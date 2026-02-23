/** Member profile – bio, link, custom fields; persisted per userId in localStorage. */

export interface MemberProfileEntry {
  bio?: string
  profileLink?: string
  /** Skills (comma or tag-style). */
  skills?: string
  location?: string
  twitter?: string
  linkedin?: string
  /** Interests/tags (comma-separated). */
  interests?: string
}

const KEY_PREFIX = "member_profile_"

function storageKey(userId: string): string {
  return `${KEY_PREFIX}${userId}`
}

export function getMemberProfile(userId: string): MemberProfileEntry {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return {}
    const parsed = JSON.parse(raw) as MemberProfileEntry
    return {
      bio: typeof parsed.bio === "string" ? parsed.bio : undefined,
      profileLink: typeof parsed.profileLink === "string" ? parsed.profileLink : undefined,
      skills: typeof parsed.skills === "string" ? parsed.skills : undefined,
      location: typeof parsed.location === "string" ? parsed.location : undefined,
      twitter: typeof parsed.twitter === "string" ? parsed.twitter : undefined,
      linkedin: typeof parsed.linkedin === "string" ? parsed.linkedin : undefined,
      interests: typeof parsed.interests === "string" ? parsed.interests : undefined,
    }
  } catch {
    return {}
  }
}

export function setMemberProfile(userId: string, entry: MemberProfileEntry): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(entry))
    window.dispatchEvent(new CustomEvent("member-profile-updated", { detail: { userId } }))
  } catch {
    // ignore
  }
}
