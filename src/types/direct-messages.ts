/** Direct messages: 1:1 and small group conversations. */

export interface DMParticipant {
  userId: string
  userName?: string
  userAvatar?: string
  joinedAt: string
}

export interface DMConversation {
  id: string
  participantIds: string[]
  participants: DMParticipant[]
  name?: string
  createdAt: string
  updatedAt: string
  lastMessageAt: string
  lastMessagePreview?: string
  lastMessageAuthorId?: string
  unreadCount?: number
}

export interface DMMessage {
  id: string
  conversationId: string
  authorId: string
  authorName?: string
  authorAvatar?: string
  content: string
  createdAt: string
  readBy?: string[]
}
