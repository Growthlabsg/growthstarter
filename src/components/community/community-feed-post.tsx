"use client"

import { useState, useId, useMemo } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import type { CommunityPost, CommunityPostComment } from "@/types/community"
import { Pin, MessageSquare, FileText, Video, MoreHorizontal, Share2, Flag, Bookmark, SmilePlus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  getCurrentUserReaction,
  setUserReaction,
  getMergedReactions,
  REACTION_OPTIONS,
} from "@/data/post-reactions-storage"
import { awardPoints, getMemberStats, getContributorTitle, getBadgeEmoji } from "@/data/community-gamification-storage"
import { getPollVote, setPollVote } from "@/data/poll-votes-storage"

interface CommunityFeedPostProps {
  post: CommunityPost
  postLink?: string
  isSaved?: boolean
  onToggleSave?: () => void
  isBuilder?: boolean
  onPinPost?: () => void
  /** When user reports this post: (post, reason) => void. */
  onReport?: (post: CommunityPost, reason: "Spam" | "Harassment" | "Off-topic" | "Other") => void
}

const POST_TYPE_LABELS: Record<string, string> = {
  discussion: "Discussion",
  question: "Question",
  announcement: "Announcement",
  poll: "Poll",
  event: "Event",
  resource: "Resource",
}

const MAX_REPLY_DEPTH = 5

type SimpleComment = CommunityPostComment

function MemberBadgesAndTitle({ communityId, userId }: { communityId: string; userId: string }) {
  const title = getContributorTitle(communityId, userId)
  const stats = getMemberStats(communityId, userId)
  if (!title && (!stats || stats.badges.length === 0)) return null
  return (
    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
      {title && title.id !== "new_member" && (
        <span className="font-medium text-[#0F7377] dark:text-teal-400">{title.label}</span>
      )}
      {stats?.badges.slice(0, 4).map((b) => (
        <span key={b} title={b.replace(/_/g, " ")}>
          {getBadgeEmoji(b)}
        </span>
      ))}
    </div>
  )
}

export function CommunityFeedPost({ post, postLink, isSaved, onToggleSave, isBuilder, onPinPost, onReport }: CommunityFeedPostProps) {
  const [myReaction, setMyReaction] = useState<string | null>(() => getCurrentUserReaction(post.id))
  const [reactionPopoverOpen, setReactionPopoverOpen] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [pollVote, setPollVoteState] = useState<string | null>(() => getPollVote(post.id))
  const [commentDraft, setCommentDraft] = useState("")
  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [pinnedCommentId, setPinnedCommentId] = useState<string | null>(null)
  const [localComments, setLocalComments] = useState<SimpleComment[]>([])
  const commentInputId = useId()

  const initialComments = (post.commentList ?? []) as SimpleComment[]
  const allComments: SimpleComment[] = [...initialComments, ...localComments]

  function buildCommentTree(comments: SimpleComment[], parentId: string | null): SimpleComment[] {
    return comments
      .filter((c) => (c.parentId ?? null) === parentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }
  const mergedReactions = useMemo(
    () => getMergedReactions(post.id, post.reactions ?? { like: post.likes }),
    // myReaction needed so merged counts update when user reacts
    [post.id, post.reactions, post.likes, myReaction]
  )
  const reactionEntries = Object.entries(mergedReactions).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1])
  const images = post.attachments?.filter((a) => a.type === "image") ?? []
  const videos = post.attachments?.filter((a) => a.type === "video") ?? []
  const docs = post.attachments?.filter((a) => a.type === "document") ?? []

  const handleReaction = (key: string) => {
    const next = myReaction === key ? null : key
    setUserReaction(post.id, next)
    setMyReaction(next)
    if (next) awardPoints(post.communityId, "current-user", "reaction")
    setReactionPopoverOpen(false)
  }

  const handleCopyLink = () => {
    const url = postLink ? `${postLink}#post-${post.id}` : `${typeof window !== "undefined" ? window.location.origin : ""}/community#post-${post.id}`
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => toast.success("Link copied"))
    }
  }

  const handleReport = () => {
    if (onReport) {
      onReport(post, "Other")
      toast.success("Report submitted. Moderators will review.")
    } else {
      toast.info("Report submitted. Moderators will review.")
    }
  }

  const totalComments = allComments.length
  const handleAddComment = (parentId?: string) => {
    const text = commentDraft.trim()
    if (!text) return
    const id = `c-${Date.now()}`
    setLocalComments((prev) => [
      ...prev,
      {
        id,
        authorName: "You",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        content: text,
        createdAt: new Date().toISOString(),
        parentId: parentId ?? undefined,
      },
    ])
    setCommentDraft("")
    setReplyingToId(null)
    toast.success(parentId ? "Reply added" : "Comment added")
  }

  function CommentBlock({ comment, depth, isPinned }: { comment: SimpleComment; depth: number; isPinned?: boolean }) {
    const children = buildCommentTree(allComments, comment.id)
    const canReply = depth < MAX_REPLY_DEPTH
    const canPin = depth === 0
    const isPinnedComment = pinnedCommentId === comment.id
    return (
      <div className={depth > 0 ? "ml-6 mt-2 border-l-2 border-slate-200 dark:border-slate-700 pl-3" : ""}>
        <div className="flex gap-2">
          <img src={comment.authorAvatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <div className={`rounded-lg px-3 py-2 ${isPinned ? "bg-[#0F7377]/10 dark:bg-teal-500/10 border border-[#0F7377]/20 dark:border-teal-500/20" : "bg-slate-50 dark:bg-slate-800/50"}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-slate-900 dark:text-white text-sm">{comment.authorName}</p>
                {(isPinned ?? isPinnedComment) && (
                  <span className="inline-flex items-center text-[#0F7377] dark:text-teal-400" title="Pinned">
                    <Pin className="h-3 w-3" />
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{comment.content}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {new Date(comment.createdAt).toLocaleDateString()}
                {canReply && (
                  <button
                    type="button"
                    onClick={() => setReplyingToId(comment.id)}
                    className="ml-2 text-[#0F7377] dark:text-teal-400 hover:underline"
                  >
                    Reply
                  </button>
                )}
                {canPin && (
                  <button
                    type="button"
                    onClick={() => setPinnedCommentId(isPinnedComment ? null : comment.id)}
                    className="ml-2 text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 inline-flex"
                    title={isPinnedComment ? "Unpin comment" : "Pin comment"}
                  >
                    <Pin className={`h-3.5 w-3.5 ${isPinnedComment ? "text-[#0F7377] dark:text-teal-400" : ""}`} />
                  </button>
                )}
              </p>
            </div>
            {children.map((child) => (
              <CommentBlock key={child.id} comment={child} depth={depth + 1} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id={`post-${post.id}`} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-4">
      <div className="flex gap-3">
        <img
          src={post.authorAvatar}
          alt=""
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="font-medium text-slate-900 dark:text-white">{post.authorName}</span>
                {post.pinned && (
                  <Pin className="h-3.5 w-3.5 text-[#0F7377] dark:text-teal-400 shrink-0" />
                )}
                {post.postType && POST_TYPE_LABELS[post.postType] && (
                  <Badge variant="outline" className="text-xs rounded-lg border-[#0F7377]/30 text-[#0F7377] dark:text-teal-400">
                    {POST_TYPE_LABELS[post.postType]}
                  </Badge>
                )}
                {post.subGroupName && (
                  <Badge variant="secondary" className="text-xs rounded-lg">
                    #{post.subGroupName}
                  </Badge>
                )}
              </div>
              <MemberBadgesAndTitle communityId={post.communityId} userId={post.authorId} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
                {isBuilder && onPinPost && (
                  <DropdownMenuItem onClick={onPinPost}>
                    <Pin className="h-4 w-4 mr-2" />
                    {post.pinned ? "Unpin from top" : "Pin to top"}
                  </DropdownMenuItem>
                )}
                {onToggleSave && (
                  <DropdownMenuItem onClick={onToggleSave}>
                    <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Unsave" : "Save post"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Images */}
          {images.length > 0 && (
            <div
              className={`mt-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 ${
                images.length === 1 ? "max-w-lg" : "grid grid-cols-2 gap-1 max-w-lg"
              }`}
            >
              {images.map((a, i) => (
                <a
                  key={i}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-video bg-slate-100 dark:bg-slate-800"
                >
                  <img
                    src={a.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          )}

          {/* Video */}
          {videos.length > 0 && (
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 max-w-lg">
              {videos.map((a, i) => (
                <a
                  key={i}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50"
                >
                  {a.thumbnailUrl ? (
                    <img
                      src={a.thumbnailUrl}
                      alt=""
                      className="w-24 h-14 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-14 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                      <Video className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                  <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {a.name ?? "Video"}
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Poll */}
          {post.postType === "poll" && post.pollOptions && post.pollOptions.length > 0 && (
            <div className="mt-3 space-y-2">
              {(() => {
                const userVote = pollVote
                const optionsWithCounts = post.pollOptions!.map((o) => ({
                  ...o,
                  displayVotes: o.votes + (userVote === o.id ? 1 : 0),
                }))
                const total = optionsWithCounts.reduce((s, o) => s + o.displayVotes, 0) || 1
                return optionsWithCounts.map((opt) => (
                  <div key={opt.id} className="rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
                    {userVote ? (
                      <>
                        <div className="px-3 py-2 flex items-center justify-between gap-2">
                          <span className="text-sm text-slate-700 dark:text-slate-300">{opt.label}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {Math.round((opt.displayVotes / total) * 100)}% · {opt.displayVotes}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full bg-[#0F7377] dark:bg-teal-500 rounded-b transition-all"
                            style={{ width: `${(opt.displayVotes / total) * 100}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setPollVote(post.id, opt.id)
                          setPollVoteState(opt.id)
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {opt.label}
                      </button>
                    )}
                  </div>
                ))
              })()}
              {pollVote && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {post.pollOptions!.reduce((s, o) => s + o.votes, 0) + 1} votes
                </p>
              )}
            </div>
          )}

          {/* Documents */}
          {docs.length > 0 && (
            <div className="mt-3 space-y-1">
              {docs.map((a, i) => (
                <a
                  key={i}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-sm text-[#0F7377] dark:text-teal-400 hover:underline max-w-md"
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="truncate">{a.name ?? "Document"}</span>
                </a>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
            {reactionEntries.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {reactionEntries.slice(0, 5).map(([key, count]) => {
                  const opt = REACTION_OPTIONS.find((o) => o.key === key)
                  return (
                    <span
                      key={key}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
                        myReaction === key
                          ? "bg-[#0F7377]/15 dark:bg-teal-500/20 text-[#0F7377] dark:text-teal-400"
                          : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      <span>{opt?.emoji ?? key}</span>
                      <span>{count}</span>
                    </span>
                  )
                })}
              </div>
            )}
            <DropdownMenu open={reactionPopoverOpen} onOpenChange={setReactionPopoverOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1 -ml-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="React"
                >
                  <SmilePlus className="h-3.5 w-3.5" />
                  React
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="p-2 rounded-xl">
                <div className="flex flex-wrap gap-1">
                  {REACTION_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleReaction(opt.key)}
                      className={`p-2 rounded-lg text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        myReaction === opt.key ? "bg-[#0F7377]/15 dark:bg-teal-500/20" : ""
                      }`}
                      title={opt.label}
                    >
                      {opt.emoji}
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={() => setCommentsOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 -ml-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {totalComments} comments
            </button>
            {onToggleSave && (
              <button
                type="button"
                onClick={onToggleSave}
                className={`flex items-center gap-1.5 rounded-lg px-2 py-1 -ml-1 transition-colors ${isSaved ? "text-[#0F7377] dark:text-teal-400" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                title={isSaved ? "Unsave" : "Save post"}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </button>
            )}
          </div>

          {commentsOpen && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
              {allComments.length > 0 && (
                <div className="max-h-64 overflow-y-auto rounded-lg space-y-2 pr-1">
                  {(() => {
                    const roots = buildCommentTree(allComments, null)
                    const pinnedFirst = [...roots].sort((a, b) =>
                      pinnedCommentId === a.id ? -1 : pinnedCommentId === b.id ? 1 : 0
                    )
                    return pinnedFirst.map((c) => (
                      <CommentBlock key={c.id} comment={c} depth={0} isPinned={pinnedCommentId === c.id} />
                    ))
                  })()}
                </div>
              )}
              {replyingToId && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Replying to comment ·{" "}
                  <button type="button" onClick={() => setReplyingToId(null)} className="text-[#0F7377] dark:text-teal-400 hover:underline">
                    Cancel
                  </button>
                </p>
              )}
              <div className="flex gap-2">
                <input
                  id={commentInputId}
                  type="text"
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment(replyingToId ?? undefined)}
                  placeholder={replyingToId ? "Write a reply…" : "Write a comment…"}
                  className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F7377] dark:focus:ring-teal-500"
                />
                <Button
                  size="sm"
                  className="gs-gradient text-white rounded-lg shrink-0"
                  onClick={() => handleAddComment(replyingToId ?? undefined)}
                  disabled={!commentDraft.trim()}
                >
                  {replyingToId ? "Reply" : "Comment"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
