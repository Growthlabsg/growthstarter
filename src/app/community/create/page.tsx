"use client"

import { useState } from "react"
import Link from "next/link"
import { CreateCommunityForm } from "@/components/community/create-community-form"
import { CommunityCelebration } from "@/components/community/community-celebration"
import { appendCreatedCommunity } from "@/data/community-created-storage"
import type { CommunityFormData, Community } from "@/types/community"
import { ChevronLeft } from "lucide-react"

function slugFromName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "community"
}

function formToCommunity(data: CommunityFormData): Community {
  const slug = (data.slug && data.slug.trim()) ? data.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-") : slugFromName(data.name)
  const id = `c-${Date.now()}`
  const now = new Date().toISOString()
  const categories = (data.categories && data.categories.length > 0) ? data.categories : [data.category || "Other"]
  return {
    id,
    slug: slug || id,
    name: data.name,
    tagline: data.tagline,
    description: data.description,
    category: categories[0] ?? "Other",
    categories,
    tags: data.tags,
    logoUrl: data.logoUrl,
    bannerUrl: data.bannerUrl,
    privacy: data.privacy,
    welcomeMessage: data.welcomeMessage,
    guidelines: data.guidelines,
    subGroupsAllowed: data.subGroupsAllowed,
    ownerId: "current-user",
    createdAt: now,
    updatedAt: now,
    memberCount: 1,
    postCountThisWeek: 0,
    verified: false,
  }
}

export default function CreateCommunityPage() {
  const [createdCommunity, setCreatedCommunity] = useState<Community | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const handleSubmit = (data: CommunityFormData) => {
    const community = formToCommunity(data)
    appendCreatedCommunity(community)
    setCreatedCommunity(community)
    setShowCelebration(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/community/browse"
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to directory
      </Link>
      <h1 className="text-2xl font-bold gs-gradient-text mb-2">Create a community</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-2">
        Follow the steps: choose a template (optional), add basics, categories, logo, privacy, then review and create.
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-500 mb-8">
        You can change anything later. Use the progress bar above to jump between steps.
      </p>
      <CreateCommunityForm onSubmit={handleSubmit} />
      {createdCommunity && (
        <CommunityCelebration
          community={createdCommunity}
          isVisible={showCelebration}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  )
}
