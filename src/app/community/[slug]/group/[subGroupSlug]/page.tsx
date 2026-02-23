"use client"

import { useParams } from "next/navigation"
import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { mockCommunities, mockSubGroups, mockCommunityPosts } from "@/data/mock-communities"
import { getCreatedCommunities } from "@/data/community-created-storage"
import { useCommunityBuilder } from "@/hooks/use-community-builder"
import { CommunityFeedPost } from "@/components/community/community-feed-post"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Users, MessageSquare, FolderOpen } from "lucide-react"

export default function ChannelPage() {
  const params = useParams()
  const slug = params?.slug as string
  const subGroupSlug = params?.subGroupSlug as string
  const [createdList, setCreatedList] = useState(getCreatedCommunities())

  useEffect(() => {
    setCreatedList(getCreatedCommunities())
  }, [])

  const allCommunities = useMemo(() => {
    const created = createdList.filter((c) => !mockCommunities.some((m) => m.id === c.id))
    return [...mockCommunities, ...created]
  }, [createdList])

  const community = allCommunities.find((c) => c.slug === slug)
  const { customChannels } = useCommunityBuilder(community?.id ?? "")
  const allSubGroups = useMemo(
    () => [
      ...mockSubGroups.filter((sg) => sg.communityId === community?.id),
      ...(community ? customChannels.filter((c) => c.communityId === community.id) : []),
    ],
    [community?.id, customChannels]
  )
  const subGroup = allSubGroups.find((sg) => sg.slug === subGroupSlug)

  if (!community || !subGroup) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Channel not found</h1>
        <Link href={`/community/${slug}`} className="inline-block mt-4 text-[#0F7377] dark:text-teal-400 font-medium">
          Back to {community?.name ?? "community"}
        </Link>
      </div>
    )
  }

  const posts = mockCommunityPosts.filter(
    (p) => p.communityId === community.id && p.subGroupId === subGroup.id
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href={`/community/${community.slug}`}
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to {community.name}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
          <FolderOpen className="h-8 w-8 text-slate-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{subGroup.name}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{subGroup.description}</p>
          <div className="flex gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {subGroup.memberCount} members
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {posts.length} posts
            </span>
          </div>
        </div>
        <Button className="gs-gradient text-white rounded-xl shrink-0 sm:ml-auto">
          Join channel
        </Button>
      </div>

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((p) => <CommunityFeedPost key={p.id} post={p} />)
        ) : (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 dark:text-slate-400">No posts in this channel yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
