import type { Community } from "@/types/community"

const STORAGE_KEY = "community_created_list"

export function getCreatedCommunities(): Community[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCreatedCommunity(community: Community): void {
  const list = getCreatedCommunities()
  const exists = list.some((c) => c.id === community.id)
  const next = exists ? list.map((c) => (c.id === community.id ? community : c)) : [...list, community]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {}
}

export function appendCreatedCommunity(community: Community): void {
  const list = getCreatedCommunities()
  if (list.some((c) => c.id === community.id)) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, community]))
  } catch {}
}
