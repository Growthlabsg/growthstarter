// Community section – data models (GrowthLab)
// See docs/COMMUNITY_PLATFORM_BLUEPRINT.md for full feature spec.

export type CommunityPrivacy = "public" | "approval" | "invite-only" | "secret";
export type CommunityMemberRole = "owner" | "admin" | "moderator" | "member" | "guest";
export type MemberStatus = "active" | "muted" | "banned" | "suspended" | "pending";

/** Permissions for community builders and moderators. */
export type CommunityPermission =
  | "manage_channels"   // Create, edit, delete channels
  | "manage_members"    // Invite, remove, assign roles
  | "manage_roles"      // Change member roles (admin, moderator, etc.)
  | "moderate"          // Approve/remove posts, mute/ban users
  | "post_announcements"// Post in announcement channel
  | "pin_posts"
  | "manage_settings"  // Community settings, privacy, guidelines
  | "view_analytics"

export interface Community {
  id: string;
  slug: string; // Custom URL slug (e.g. growthlab.com/c/ai-founders)
  name: string;
  tagline: string;
  description: string;
  /** Primary category (legacy / display). Prefer categories[] for multi-category. */
  category: string;
  /** Up to 3 categories (labels). Enables "AI + Fintech" etc. */
  categories?: string[];
  tags: string[];
  logoUrl: string;
  bannerUrl: string;
  privacy: CommunityPrivacy; // secret = hidden from directory
  welcomeMessage?: string;
  guidelines?: string;
  onboardingChecklist?: string[]; // e.g. ["Complete profile", "Join a sub-group"]
  customTheme?: string; // Primary color override; fallback to brand teal
  subGroupsAllowed: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  postCountThisWeek: number;
  /** Members active in the last 24 hours. */
  activeMembers24h?: number;
  /** Members currently online (e.g. active in last 15 min). Shown as "X online". */
  activeNow?: number;
  verified: boolean;
  featured?: boolean;
  location?: string;
  templateId?: string; // If created from default template
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  role: CommunityMemberRole;
  joinedAt: string;
  status: MemberStatus;
  userName?: string;
  userAvatar?: string;
  suspendedUntil?: string; // ISO date; for temporary ban
  banReason?: string;
  invitedBy?: string;
  invitedAt?: string;
}

/** Channel within a community: Announcements (admin-only), General feed, or topic-specific. */
export type ChannelKind = "announcement" | "general" | "channel";

export interface SubGroup {
  id: string;
  communityId: string;
  slug: string;
  name: string;
  description: string;
  /** announcement = admin announcements; general = main feed; channel = topic channel */
  kind?: ChannelKind;
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
}

export interface SubGroupMember {
  id: string;
  subGroupId: string;
  userId: string;
  joinedAt: string;
}

export type PostType = "discussion" | "question" | "announcement" | "poll" | "event" | "resource";

/** Attachment type for feed posts (images, video, documents). */
export type AttachmentType = "image" | "video" | "document";

export interface PostAttachment {
  url: string;
  type: AttachmentType;
  name?: string;
  thumbnailUrl?: string; // For video preview
}

export interface CommunityPost {
  id: string;
  communityId: string;
  subGroupId?: string;
  subGroupName?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  postType?: PostType;
  flairId?: string;
  flairLabel?: string;
  parentId?: string; // For threaded replies (nested up to 5)
  pinned: boolean;
  featured?: boolean; // For home carousel
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  reactions?: Record<string, number>; // e.g. { like: 5, love: 2 }
  /** Rich media: images, video, docs (LinkedIn-style feed). */
  attachments?: PostAttachment[];
  /** @deprecated Prefer attachments with type. */
  embedUrl?: string;
  /** Pre-loaded comments (from others and/or API). Threaded via parentId. */
  commentList?: CommunityPostComment[];
  /** For postType === "poll": options and vote counts. */
  pollOptions?: { id: string; label: string; votes: number }[];
  /** For postType === "question": optional accepted answer comment id. */
  acceptedAnswerId?: string;
}

/** Comment on a community post (threaded via parentId). */
export interface CommunityPostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  parentId?: string;
}

/** Resource in community library (files, links, docs). */
export interface CommunityResource {
  id: string;
  communityId: string;
  title: string;
  description?: string;
  type: "file" | "link" | "document";
  url: string;
  addedBy: string;
  addedByName?: string;
  addedAt: string;
  category?: string;
}

/** Event scoped to a community (or channel). */
export interface CommunityEvent {
  id: string;
  communityId: string;
  subGroupId?: string;
  title: string;
  description?: string;
  type: "webinar" | "meetup" | "workshop" | "ama" | "mixer" | "hackathon";
  startAt: string;
  endAt?: string;
  location?: string;
  meetingUrl?: string;
  createdBy: string;
  createdAt: string;
}

export interface CommunityFormData {
  name: string;
  tagline: string;
  description: string;
  category: string;
  /** 1–3 categories (labels). Max 3. */
  categories?: string[];
  tags: string[];
  /** User-suggested category (moderated; GrowthLab team reviews). */
  suggestedCategory?: string;
  slug?: string; // Custom URL slug; default derived from name
  logoUrl: string;
  bannerUrl: string;
  privacy: CommunityPrivacy;
  welcomeMessage?: string;
  guidelines?: string;
  customTheme?: string;
  subGroupsAllowed: boolean;
  templateId?: string;
}
