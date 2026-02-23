import type { CommunityResource } from "@/types/community"

const STORAGE_KEY = "community_created_resources"

function load(): CommunityResource[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(list: CommunityResource[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

export function getCreatedResources(communityId: string): CommunityResource[] {
  return load()
    .filter((r) => r.communityId === communityId)
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
}

export function addCreatedResource(resource: CommunityResource): void {
  const list = load()
  if (list.some((r) => r.id === resource.id)) return
  save([...list, resource])
}
