import type { CommunityEvent } from "@/types/community"

const STORAGE_KEY = "community_created_events"

function load(): CommunityEvent[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(list: CommunityEvent[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

export function getCreatedEvents(communityId: string): CommunityEvent[] {
  return load()
    .filter((e) => e.communityId === communityId)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
}

export function addCreatedEvent(event: CommunityEvent): void {
  const list = load()
  if (list.some((e) => e.id === event.id)) return
  save([...list, event])
}
