"use client"

import { useParams } from "next/navigation"
import { useMemo } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  MapPin,
  Users,
  Tag,
  Calendar,
  MessageCircle,
  ChevronLeft,
  Wifi,
  Coffee,
  Car,
  Printer,
  Wind,
  Dumbbell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSpaceBySlug, getSpaces } from "@/data/spaces-storage"
import { mockHosts } from "@/data/mock-spaces"
import { SPACE_TYPE_LABELS, type Space } from "@/types/spaces"

function formatPrice(p: Space["pricing"]): string {
  if (p.type === "free") return "Free"
  const parts: string[] = []
  if (p.hourly != null) parts.push(`$${p.hourly}/hr`)
  if (p.daily != null) parts.push(`$${p.daily}/day`)
  if (p.monthly != null) parts.push(`$${p.monthly}/mo`)
  return parts.length ? parts.join(" · ") : "Free"
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  coffee: Coffee,
  parking: Car,
  printing: Printer,
  AC: Wind,
  sports_equipment: Dumbbell,
}

export default function SpaceDetailPage() {
  const params = useParams()
  const slug = (params?.slug as string) ?? ""
  const space = useMemo(() => getSpaceBySlug(slug), [slug])
  const host = space ? mockHosts.find((h) => h.id === space.hostId) : null
  const similar = useMemo(() => {
    if (!space) return []
    return getSpaces()
      .filter((s) => s.id !== space.id && (s.spaceType === space.spaceType || s.district === space.district))
      .slice(0, 3)
  }, [space])

  if (!space) notFound()

  const coverUrl = space.images[space.coverImageIndex] ?? space.images[0]
  const isFree = space.pricing.type === "free"
  const hasStartupOffer = space.startupOffer.enabled

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <Link
        href="/spaces/explore"
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video">
            {coverUrl ? (
              <img src={coverUrl} alt={space.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                No image
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {space.name}
              </h1>
              {hasStartupOffer && (
                <Badge className="bg-[#0F7377]/90 text-white border-0">
                  <Tag className="h-3 w-3 mr-1" />
                  Startup Deal
                </Badge>
              )}
              {isFree && (
                <Badge variant="secondary" className="bg-emerald-500/90 text-white border-0">
                  Free
                </Badge>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {space.address} · {space.district}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0" />
              Up to {space.capacity} people · {SPACE_TYPE_LABELS[space.spaceType]}
            </p>
          </div>

          <p className="text-slate-700 dark:text-slate-300">{space.description}</p>

          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {space.amenities.map((a) => {
                const Icon = amenityIcons[a] ?? null
                return (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {a}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Availability placeholder */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Availability
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select date and time on the right to book.
            </p>
          </div>

          {/* Book similar */}
          {similar.length > 0 && (
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Book similar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similar.map((s) => (
                  <Link
                    key={s.id}
                    href={`/spaces/space/${s.slug}`}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 gs-card-hover block"
                  >
                    <p className="font-medium text-slate-900 dark:text-white text-sm line-clamp-1">
                      {s.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {s.district} · {formatPrice(s.pricing)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: pricing + book */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-6 shadow-sm">
            <p className="text-2xl font-bold text-[#0F7377] dark:text-teal-400">
              {formatPrice(space.pricing)}
            </p>
            {hasStartupOffer && !isFree && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {space.startupOffer.description}
              </p>
            )}
            {host && (
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                {host.logoUrl ? (
                  <img
                    src={host.logoUrl}
                    alt={host.businessName}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
                )}
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">
                    {host.businessName}
                  </p>
                  {host.responseTime && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Responds {host.responseTime}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-6">
              <Button
                className="w-full gs-gradient text-white rounded-xl"
                asChild
              >
                <Link href={`/spaces/space/${space.slug}/book`}>
                  {space.instantBook ? "Book now" : "Request to book"}
                </Link>
              </Button>
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <a href="#">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact host
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
