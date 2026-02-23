"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getSpaceById } from "@/data/spaces-storage"

export default function HostEditSpacePage() {
  const params = useParams()
  const id = (params?.id as string) ?? ""
  const space = getSpaceById(id)

  if (!space) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-600 dark:text-slate-400">Space not found.</p>
        <Link href="/spaces/host/dashboard" className="text-[#0F7377] dark:text-teal-400 text-sm mt-2 inline-block">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <Link
        href="/spaces/host/dashboard"
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Edit listing: {space.name}
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm">
        Full edit form (photos, pricing, availability, startup offer) can be added here. For MVP, redirect to list flow or duplicate list steps with pre-filled data.
      </p>
    </div>
  )
}
