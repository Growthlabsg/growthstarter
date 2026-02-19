"use client"

import { useState } from "react"
import { Project, Comment } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Flag,
  Trash2,
  Edit,
  Check,
  ShieldCheck,
  Send,
  X
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CommentsSectionProps {
  project: Project
  currentUser?: {
    id: string
    name: string
    avatar: string
  }
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: "1",
    author: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face"
    },
    content: "This is exactly what I've been looking for! The design looks amazing and I can't wait to receive mine. Quick question - will there be different color options available?",
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes: 12,
    isCreator: false,
    isBacker: true,
    replies: [
      {
        id: "1-1",
        author: {
          id: "creator",
          name: "Project Creator",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
        },
        content: "Thank you so much for your support! Yes, we're planning to offer 5 color options: Space Gray, Silver, Rose Gold, Ocean Blue, and Forest Green.",
        date: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        likes: 8,
        isCreator: true,
        isBacker: false
      }
    ]
  },
  {
    id: "2",
    author: {
      id: "user2",
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    content: "Just backed! The stretch goals look exciting. Really hoping we hit the wireless charging add-on!",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 5,
    isCreator: false,
    isBacker: true
  },
  {
    id: "3",
    author: {
      id: "user3",
      name: "Emma Thompson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    content: "When is the estimated shipping date? I want to make sure I can get this as a gift.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes: 3,
    isCreator: false,
    isBacker: false
  }
]

export function CommentsSection({ project, currentUser }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest')
  const [likedComments, setLikedComments] = useState<string[]>([])

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `new-${Date.now()}`,
      author: currentUser || {
        id: "guest",
        name: "Guest User",
        avatar: ""
      },
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
      isCreator: false,
      isBacker: true
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `reply-${Date.now()}`,
      author: currentUser || {
        id: "guest",
        name: "Guest User",
        avatar: ""
      },
      content: replyContent,
      date: new Date().toISOString(),
      likes: 0,
      isCreator: false,
      isBacker: true
    }

    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...(c.replies || []), reply]
        }
      }
      return c
    }))

    setReplyingTo(null)
    setReplyContent("")
  }

  const handleLike = (commentId: string) => {
    if (likedComments.includes(commentId)) {
      setLikedComments(likedComments.filter(id => id !== commentId))
      setComments(comments.map(c => {
        if (c.id === commentId) return { ...c, likes: c.likes - 1 }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => 
              r.id === commentId ? { ...r, likes: r.likes - 1 } : r
            )
          }
        }
        return c
      }))
    } else {
      setLikedComments([...likedComments, commentId])
      setComments(comments.map(c => {
        if (c.id === commentId) return { ...c, likes: c.likes + 1 }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => 
              r.id === commentId ? { ...r, likes: r.likes + 1 } : r
            )
          }
        }
        return c
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-teal-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Comments ({comments.length})
          </h3>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* New Comment Input */}
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUser?.avatar} />
          <AvatarFallback>{currentUser?.name?.[0] || "G"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Share your thoughts or ask a question..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end mt-2">
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="gs-gradient text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isLiked={likedComments.includes(comment.id)}
            onLike={() => handleLike(comment.id)}
            onReply={() => setReplyingTo(comment.id)}
            replyingTo={replyingTo}
            replyContent={replyContent}
            onReplyContentChange={setReplyContent}
            onSubmitReply={() => handleSubmitReply(comment.id)}
            onCancelReply={() => {
              setReplyingTo(null)
              setReplyContent("")
            }}
            likedComments={likedComments}
            onLikeReply={handleLike}
          />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  isLiked: boolean
  onLike: () => void
  onReply: () => void
  replyingTo: string | null
  replyContent: string
  onReplyContentChange: (value: string) => void
  onSubmitReply: () => void
  onCancelReply: () => void
  likedComments: string[]
  onLikeReply: (id: string) => void
}

function CommentItem({
  comment,
  isLiked,
  onLike,
  onReply,
  replyingTo,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  onCancelReply,
  likedComments,
  onLikeReply
}: CommentItemProps) {
  return (
    <div className="group">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-slate-900 dark:text-white">
                {comment.author.name}
              </span>
              {comment.isCreator && (
                <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 text-[10px] h-5">
                  <ShieldCheck className="h-3 w-3 mr-0.5" />
                  Creator
                </Badge>
              )}
              {comment.isBacker && !comment.isCreator && (
                <Badge variant="secondary" className="text-[10px] h-5">
                  Backer
                </Badge>
              )}
              <span className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2 ml-3">
            <button
              onClick={onLike}
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked 
                  ? 'text-teal-600' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
              {comment.likes > 0 && comment.likes}
            </button>
            <button
              onClick={onReply}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <Reply className="h-3.5 w-3.5" />
              Reply
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem className="text-red-600">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-3 ml-3 flex gap-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => onReplyContentChange(e.target.value)}
                className="min-h-[60px] resize-none text-sm"
              />
              <div className="flex flex-col gap-1">
                <Button size="sm" onClick={onSubmitReply} disabled={!replyContent.trim()}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onCancelReply}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 ml-6 space-y-3">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-3 group/reply">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                    <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">
                          {reply.author.name}
                        </span>
                        {reply.isCreator && (
                          <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 text-[10px] h-4">
                            Creator
                          </Badge>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {formatDistanceToNow(new Date(reply.date), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {reply.content}
                      </p>
                    </div>
                    <button
                      onClick={() => onLikeReply(reply.id)}
                      className={`flex items-center gap-1 text-[10px] mt-1 ml-2 transition-colors ${
                        likedComments.includes(reply.id) 
                          ? 'text-teal-600' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <ThumbsUp className={`h-3 w-3 ${likedComments.includes(reply.id) ? 'fill-current' : ''}`} />
                      {reply.likes > 0 && reply.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

