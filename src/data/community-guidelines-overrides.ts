/**
 * Guidelines overrides for communities (e.g. mock communities that can't be mutated).
 * Created communities store guidelines on the community object; this is for overrides only.
 */

const STORAGE_KEY = "community_guidelines_overrides"

function load(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function save(record: Record<string, string>) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {}
}

export function getGuidelinesOverride(communityId: string): string | undefined {
  const record = load()
  const v = record[communityId]
  return v === "" ? "" : v ?? undefined
}

export function setGuidelinesOverride(communityId: string, guidelines: string): void {
  const record = load()
  record[communityId] = guidelines
  save(record)
}
