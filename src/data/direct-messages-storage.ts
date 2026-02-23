/** Direct messages – conversations and messages persisted in localStorage. */

import type { DMConversation, DMMessage, DMParticipant } from "@/types/direct-messages"

const CONVERSATIONS_KEY = "community_dm_conversations"
const MESSAGES_KEY_PREFIX = "community_dm_messages_"
const READ_UP_TO_KEY_PREFIX = "community_dm_read_"

const CURRENT_USER_ID = "current-user"

function loadConversations(): DMConversation[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as DMConversation[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function saveConversations(list: DMConversation[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent("community-dm-updated"))
  } catch {}
}

function loadMessages(conversationId: string): DMMessage[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(MESSAGES_KEY_PREFIX + conversationId)
    if (!raw) return []
    const list = JSON.parse(raw) as DMMessage[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function saveMessages(conversationId: string, list: DMMessage[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(MESSAGES_KEY_PREFIX + conversationId, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent("community-dm-updated"))
  } catch {}
}

function getReadUpTo(conversationId: string): number {
  if (typeof window === "undefined") return 0
  try {
    const raw = localStorage.getItem(READ_UP_TO_KEY_PREFIX + conversationId)
    if (!raw) return 0
    const n = parseInt(raw, 10)
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}

function setReadUpTo(conversationId: string, count: number) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(READ_UP_TO_KEY_PREFIX + conversationId, String(count))
    window.dispatchEvent(new CustomEvent("community-dm-updated"))
  } catch {}
}

export function getDMConversations(): DMConversation[] {
  const list = loadConversations()
  return list
    .map((c) => {
      const messages = loadMessages(c.id)
      const last = messages[messages.length - 1]
      const readUpTo = getReadUpTo(c.id)
      const unread = Math.max(0, messages.length - readUpTo)
      return {
        ...c,
        lastMessageAt: last?.createdAt ?? c.lastMessageAt,
        lastMessagePreview: last ? (last.content.slice(0, 60) + (last.content.length > 60 ? "…" : "")) : c.lastMessagePreview,
        lastMessageAuthorId: last?.authorId,
        unreadCount: last?.authorId !== CURRENT_USER_ID ? unread : 0,
      }
    })
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
}

export function getOrCreate1To1Conversation(
  otherUserId: string,
  otherUserName?: string,
  otherUserAvatar?: string
): DMConversation {
  const list = loadConversations()
  const ids = [CURRENT_USER_ID, otherUserId].sort()
  let conv = list.find(
    (c) =>
      c.participantIds.length === 2 &&
      c.participantIds.slice().sort().join(",") === ids.join(",")
  )
  if (conv) return conv
  const now = new Date().toISOString()
  conv = {
    id: `dm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    participantIds: [CURRENT_USER_ID, otherUserId],
    participants: [
      { userId: CURRENT_USER_ID, userName: "You", userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", joinedAt: now },
      { userId: otherUserId, userName: otherUserName ?? "Member", userAvatar: otherUserAvatar, joinedAt: now },
    ],
    createdAt: now,
    updatedAt: now,
    lastMessageAt: now,
  }
  list.unshift(conv)
  saveConversations(list)
  return conv
}

export function getDMMessages(conversationId: string): DMMessage[] {
  return loadMessages(conversationId).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
}

export function sendDMMessage(
  conversationId: string,
  content: string,
  authorName?: string,
  authorAvatar?: string
): DMMessage {
  const messages = loadMessages(conversationId)
  const msg: DMMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    conversationId,
    authorId: CURRENT_USER_ID,
    authorName: authorName ?? "You",
    authorAvatar: authorAvatar ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: content.trim(),
    createdAt: new Date().toISOString(),
  }
  messages.push(msg)
  saveMessages(conversationId, messages)
  const convos = loadConversations()
  const conv = convos.find((c) => c.id === conversationId)
  if (conv) {
    conv.updatedAt = msg.createdAt
    conv.lastMessageAt = msg.createdAt
    conv.lastMessagePreview = msg.content.slice(0, 60) + (msg.content.length > 60 ? "…" : "")
    conv.lastMessageAuthorId = msg.authorId
    saveConversations(convos)
  }
  return msg
}

export function markDMConversationRead(conversationId: string) {
  const messages = loadMessages(conversationId)
  setReadUpTo(conversationId, messages.length)
}

export function getTotalUnreadDMCount(): number {
  return getDMConversations().reduce((sum, c) => sum + (c.unreadCount ?? 0), 0)
}
