/**
 * Pending join requests per community (for approval workflow).
 * Key: community_pending_requests_{communityId}
 * Value: array of { userId, userName, requestedAt }
 */

export type PendingJoinRequest = {
  userId: string
  userName: string
  requestedAt: string
}

const PREFIX = "community_pending_requests_"

export function getPendingJoinRequests(communityId: string): PendingJoinRequest[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(PREFIX + communityId)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addPendingJoinRequest(
  communityId: string,
  request: PendingJoinRequest
): void {
  const list = getPendingJoinRequests(communityId)
  if (list.some((r) => r.userId === request.userId)) return
  try {
    localStorage.setItem(
      PREFIX + communityId,
      JSON.stringify([...list, request])
    )
  } catch {}
}

export function removePendingJoinRequest(
  communityId: string,
  userId: string
): void {
  const list = getPendingJoinRequests(communityId).filter(
    (r) => r.userId !== userId
  )
  try {
    localStorage.setItem(PREFIX + communityId, JSON.stringify(list))
  } catch {}
}
