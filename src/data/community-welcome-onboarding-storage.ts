/**
 * Per-community welcome onboarding: rules acceptance, interest picker.
 */

const RULES_PREFIX = "community_welcome_rules_"
const INTERESTS_PREFIX = "community_welcome_interests_"

export function getRulesAccepted(communityId: string): boolean {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem(RULES_PREFIX + communityId) === "true"
  } catch {
    return false
  }
}

export function setRulesAccepted(communityId: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(RULES_PREFIX + communityId, "true")
  } catch {}
}

export function getWelcomeInterests(communityId: string): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(INTERESTS_PREFIX + communityId)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function setWelcomeInterests(communityId: string, interests: string[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(INTERESTS_PREFIX + communityId, JSON.stringify(interests))
  } catch {}
}
