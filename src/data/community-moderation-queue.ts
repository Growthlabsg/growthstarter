/**
 * Moderation queue: reported posts and approve/reject decisions (persisted).
 */

export type ReportReason = "Spam" | "Harassment" | "Off-topic" | "Other"

export interface ReportedPost {
  id: string
  communityId: string
  postId: string
  reportReason: ReportReason
  reportedAt: string
  /** Snapshot for display in queue. */
  authorName: string
  contentSnippet: string
}

export type ModerationDecision = "approved" | "rejected"

const REPORTS_KEY = "community_moderation_reports"
const DECISIONS_KEY = "community_moderation_decisions"

function loadReports(): ReportedPost[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(REPORTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveReports(list: ReportedPost[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(list))
  } catch {}
}

interface DecisionEntry {
  communityId: string
  postId: string
  decision: ModerationDecision
}

function loadDecisions(): DecisionEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(DECISIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveDecisions(list: DecisionEntry[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(DECISIONS_KEY, JSON.stringify(list))
  } catch {}
}

export function addReport(
  communityId: string,
  postId: string,
  reportReason: ReportReason,
  snapshot: { authorName: string; content: string }
): void {
  const list = loadReports()
  if (list.some((r) => r.communityId === communityId && r.postId === postId)) return
  const report: ReportedPost = {
    id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    communityId,
    postId,
    reportReason,
    reportedAt: new Date().toISOString(),
    authorName: snapshot.authorName,
    contentSnippet: snapshot.content.slice(0, 200).trim() + (snapshot.content.length > 200 ? "…" : ""),
  }
  saveReports([...list, report])
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("community-moderation-queue-updated"))
  }
}

/** Pending reports (no decision yet) for the queue. */
export function getPendingReports(communityId: string): ReportedPost[] {
  const reports = loadReports().filter((r) => r.communityId === communityId)
  const decisions = loadDecisions().filter((d) => d.communityId === communityId)
  const decidedPostIds = new Set(decisions.map((d) => d.postId))
  return reports.filter((r) => !decidedPostIds.has(r.postId)).sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
}

/** Persist approve/reject; removes from pending queue. */
export function setModerationDecision(
  communityId: string,
  postId: string,
  decision: ModerationDecision
): void {
  const list = loadDecisions()
  const existing = list.findIndex((d) => d.communityId === communityId && d.postId === postId)
  const entry: DecisionEntry = { communityId, postId, decision }
  const next = existing === -1 ? [...list, entry] : list.map((d, i) => (i === existing ? entry : d))
  saveDecisions(next)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("community-moderation-queue-updated"))
  }
}

/** Post IDs that were rejected (hide from feed). */
export function getRejectedPostIds(communityId: string): string[] {
  return loadDecisions()
    .filter((d) => d.communityId === communityId && d.decision === "rejected")
    .map((d) => d.postId)
}
