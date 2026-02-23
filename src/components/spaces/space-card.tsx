"use client"

import Link from "next/link"
import { MapPin, Tag } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Space } from "@/types/spaces"
import { SPACE_TYPE_LABELS } from "@/types/spaces"

function formatPrice(p: Space["pricing"]): string {
  if (p.type === "free") return "Free"
  if (p.hourly != null) return `$${p.hourly}/hr`
  if (p.daily != null) return `$${p.daily}/day`
  if (p.monthly != null) return `$${p.monthly}/mo`
  return "Free"
}

export interface SpaceCardProps {
  space: Space
  className?: string
}

export function SpaceCard({ space, className }: SpaceCardProps) {
  const coverUrl = space.images[space.coverImageIndex] ?? space.images[0]
  const isFree = space.pricing.type === "free"
  const hasStartupOffer = space.startupOffer.enabled

  return (
    <Link href={`/spaces/space/${space.slug}`} className="block">
      <Card
        className={cn(
          "overflow-hidden gs-card-hover rounded-xl border border-slate-200 dark:border-slate-700",
          className
        )}
      >
        <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={space.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400">
              No image
            </div>
          )}
          {hasStartupOffer && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-[#0F7377]/90 text-white border-0 text-xs">
                <Tag className="h-3 w-3 mr-1" />
                Startup Deal
              </Badge>
            </div>
          )}
          {isFree && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-emerald-500/90 text-white border-0">
                Free
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
            {space.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {space.district} · {space.address.split(",")[0]}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {SPACE_TYPE_LABELS[space.spaceType]} · up to {space.capacity} pax
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {space.amenities.slice(0, 4).map((a) => (
              <span
                key={a}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {a}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="text-sm font-medium text-[#0F7377] dark:text-teal-400">
            {formatPrice(space.pricing)}
          </span>
          {hasStartupOffer && !isFree && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {space.startupOffer.description}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
