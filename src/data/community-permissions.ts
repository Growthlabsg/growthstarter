import type { CommunityMemberRole, CommunityPermission } from "@/types/community"

/** Default permissions per role. Owner has all; member has none of these. */
export const ROLE_PERMISSIONS: Record<CommunityMemberRole, CommunityPermission[]> = {
  owner: [
    "manage_channels",
    "manage_members",
    "manage_roles",
    "moderate",
    "post_announcements",
    "pin_posts",
    "manage_settings",
    "view_analytics",
  ],
  admin: [
    "manage_channels",
    "manage_members",
    "manage_roles",
    "moderate",
    "post_announcements",
    "pin_posts",
    "view_analytics",
  ],
  moderator: ["moderate", "post_announcements", "pin_posts"],
  member: [],
  guest: [],
}

export function can(role: CommunityMemberRole, permission: CommunityPermission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getRoleLabel(role: CommunityMemberRole): string {
  const labels: Record<CommunityMemberRole, string> = {
    owner: "Owner",
    admin: "Admin",
    moderator: "Moderator",
    member: "Member",
    guest: "Guest",
  }
  return labels[role] ?? role
}

export const ROLE_OPTIONS: { value: CommunityMemberRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "member", label: "Member" },
  { value: "guest", label: "Guest" },
]
