"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getRoleLabel } from "@/data/community-permissions"
import { getMemberProfile, setMemberProfile } from "@/data/member-profiles-storage"
import {
  getMemberStats,
  getContributorTitle,
  getBadgeEmoji,
} from "@/data/community-gamification-storage"
import { getOrCreate1To1Conversation } from "@/data/direct-messages-storage"
import { isFollowing, toggleFollow } from "@/data/member-follow-storage"
import type { CommunityMember } from "@/types/community"
import type { Community } from "@/types/community"
import { Users, Link2, ExternalLink, MessageCircle, MapPin, Briefcase, Heart, UserPlus, Trophy, Flame } from "lucide-react"

function MemberGamificationRow({ communityId, userId }: { communityId: string; userId: string }) {
  const stats = getMemberStats(communityId, userId)
  const title = getContributorTitle(communityId, userId)
  if (!stats && !title) return null
  const hasAny = (stats && (stats.points > 0 || stats.streak > 0 || stats.badges.length > 0)) || (title && title.id !== "new_member")
  if (!hasAny) return null
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap mt-2 text-xs text-slate-500 dark:text-slate-400">
      {stats && stats.points > 0 && (
        <span className="flex items-center gap-1">
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          {stats.points} pts
        </span>
      )}
      {stats && stats.streak > 0 && (
        <span className="flex items-center gap-1">
          <Flame className="h-3.5 w-3.5 text-orange-500" />
          {stats.streak} day streak
        </span>
      )}
      {title && title.id !== "new_member" && (
        <span className="font-medium text-[#0F7377] dark:text-teal-400">{title.label}</span>
      )}
      {stats?.badges.slice(0, 5).map((b) => (
        <span key={b} title={b.replace(/_/g, " ")}>
          {getBadgeEmoji(b)}
        </span>
      ))}
    </div>
  )
}

interface MemberProfileSheetProps {
  member: CommunityMember
  currentCommunity: Community
  /** Communities this member is in (name + slug). */
  communitiesForMember: { name: string; slug: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
  isCurrentUser?: boolean
}

export function MemberProfileSheet({
  member,
  currentCommunity,
  communitiesForMember,
  open,
  onOpenChange,
  isCurrentUser = false,
}: MemberProfileSheetProps) {
  const [bio, setBio] = useState("")
  const [profileLink, setProfileLink] = useState("")
  const [skills, setSkills] = useState("")
  const [location, setLocation] = useState("")
  const [twitter, setTwitter] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [interests, setInterests] = useState("")
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [following, setFollowing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!open || !member) return
    const profile = getMemberProfile(member.userId)
    setBio(profile.bio ?? "")
    setProfileLink(profile.profileLink ?? "")
    setSkills(profile.skills ?? "")
    setLocation(profile.location ?? "")
    setTwitter(profile.twitter ?? "")
    setLinkedin(profile.linkedin ?? "")
    setInterests(profile.interests ?? "")
    setEditing(false)
    setSaved(false)
    setFollowing(isFollowing(member.userId))
  }, [open, member?.userId])

  const handleSave = () => {
    setMemberProfile(member.userId, {
      bio: bio.trim() || undefined,
      profileLink: profileLink.trim() || undefined,
      skills: skills.trim() || undefined,
      location: location.trim() || undefined,
      twitter: twitter.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      interests: interests.trim() || undefined,
    })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const displayBio = bio.trim() || (editing ? "" : "No bio.")
  const displayLink = profileLink.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] max-h-[90dvh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Member profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center text-center pt-2">
          <img
            src={member.userAvatar ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
            alt=""
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
          />
          <p className="mt-3 font-semibold text-slate-900 dark:text-white text-lg">
            {member.userName ?? "Member"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {getRoleLabel(member.role ?? "member")} in {currentCommunity.name}
          </p>
          <MemberGamificationRow communityId={currentCommunity.id} userId={member.userId} />
        </div>

        {!isCurrentUser && (
          <div className="flex gap-2 w-full">
            <Button
              size="sm"
              variant={following ? "outline" : "default"}
              className={`flex-1 rounded-lg gap-2 ${!following ? "gs-gradient text-white" : ""}`}
              onClick={() => setFollowing(toggleFollow(member.userId))}
            >
              {following ? <UserPlus className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
              {following ? "Following" : "Follow"}
            </Button>
            <Button
              size="sm"
              className="flex-1 rounded-lg gs-gradient text-white gap-2"
              onClick={() => {
              const conv = getOrCreate1To1Conversation(
                member.userId,
                member.userName,
                member.userAvatar
              )
              onOpenChange(false)
              router.push(`/community/direct/${conv.id}`)
            }}
            >
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
          </div>
        )}
        {isCurrentUser && !editing && (
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-lg"
            onClick={() => setEditing(true)}
          >
            Edit profile
          </Button>
        )}

        {editing && isCurrentUser && (
          <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400">Bio</Label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short bio..."
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-3 py-2 text-sm min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-[#0F7377] dark:focus:ring-teal-500"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400">Link</Label>
              <Input
                value={profileLink}
                onChange={(e) => setProfileLink(e.target.value)}
                placeholder="https://..."
                className="mt-1 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400">Skills</Label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. React, ML" className="mt-1 rounded-lg" />
            </div>
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400">Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" className="mt-1 rounded-lg" />
            </div>
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400">Twitter / X</Label>
              <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@handle" className="mt-1 rounded-lg" />
            </div>
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400">LinkedIn</Label>
              <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="Profile URL" className="mt-1 rounded-lg" />
            </div>
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400">Interests / tags</Label>
              <Input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g. AI, startups" className="mt-1 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 rounded-lg gs-gradient text-white" onClick={handleSave}>
                {saved ? "Saved" : "Save"}
              </Button>
              <Button size="sm" variant="outline" className="rounded-lg" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!editing && (
          <>
            {displayBio && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-left">
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{displayBio}</p>
              </div>
            )}
            {(location || skills || interests) && (
              <div className="w-full space-y-1.5 text-left text-sm">
                {location && (
                  <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {location}
                  </p>
                )}
                {skills && (
                  <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    {skills}
                  </p>
                )}
                {interests && (
                  <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Heart className="h-3.5 w-3.5 shrink-0" />
                    {interests}
                  </p>
                )}
              </div>
            )}
            {(twitter || linkedin || displayLink) && (
              <div className="flex flex-wrap gap-3">
                {displayLink && (
                  <a href={displayLink.startsWith("http") ? displayLink : `https://${displayLink}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#0F7377] dark:text-teal-400 hover:underline">
                    <Link2 className="h-3.5 w-3.5" />
                    Link
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {twitter && (
                  <a href={`https://twitter.com/${twitter.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#0F7377] dark:text-teal-400 hover:underline">
                    X
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#0F7377] dark:text-teal-400 hover:underline">
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </>
        )}

        {communitiesForMember.length > 0 && (
          <div className="w-full text-left">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Users className="h-3.5 w-3.5" />
              Communities
            </h4>
            <ul className="space-y-1">
              {communitiesForMember.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/community/${c.slug}`}
                    className="text-sm text-[#0F7377] dark:text-teal-400 hover:underline"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
