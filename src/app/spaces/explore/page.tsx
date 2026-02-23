"use client"

import { useState, useMemo } from "react"
import { Search, MapPin, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SpaceCard } from "@/components/spaces/space-card"
import { getSpaces } from "@/data/spaces-storage"
import { SPACE_TYPE_LABELS, SG_DISTRICTS, type SpaceType } from "@/types/spaces"

const PRICE_OPTIONS = [
  { value: "all", label: "Any price" },
  { value: "free", label: "Free only" },
  { value: "0-50", label: "$0 – $50" },
  { value: "50-100", label: "$50 – $100" },
  { value: "100+", label: "$100+" },
]

export default function ExploreSpacesPage() {
  const spaces = getSpaces()
  const [search, setSearch] = useState("")
  const [district, setDistrict] = useState<string>("all")
  const [spaceType, setSpaceType] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [mapVisible, setMapVisible] = useState(false)

  const filtered = useMemo(() => {
    return spaces.filter((s) => {
      if (search) {
        const q = search.toLowerCase()
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.description.toLowerCase().includes(q) &&
          !s.district.toLowerCase().includes(q) &&
          !s.address.toLowerCase().includes(q)
        )
          return false
      }
      if (district !== "all" && s.district !== district) return false
      if (spaceType !== "all" && s.spaceType !== spaceType) return false
      if (priceRange === "free" && s.pricing.type !== "free") return false
      if (priceRange === "0-50") {
        const max = s.pricing.hourly ?? s.pricing.daily ?? 999
        if (max > 50) return false
      }
      if (priceRange === "50-100") {
        const max = s.pricing.hourly ?? s.pricing.daily ?? 0
        if (max < 50 || max > 100) return false
      }
      if (priceRange === "100+") {
        const max = s.pricing.hourly ?? s.pricing.daily ?? 0
        if (max < 100) return false
      }
      return true
    })
  }, [spaces, search, district, spaceType, priceRange])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Explore Spaces
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Find hot desks, meeting rooms, event spaces, and more for your startup.
        </p>
      </div>

      {/* Search + filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, location, district…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full border-slate-200 dark:border-slate-700 focus:ring-[#0F7377]/20 focus:border-[#0F7377]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className="w-[140px] rounded-full">
              <MapPin className="h-4 w-4 mr-1 text-slate-500" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All areas</SelectItem>
              {SG_DISTRICTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={spaceType} onValueChange={setSpaceType}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue placeholder="Space type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {(Object.keys(SPACE_TYPE_LABELS) as SpaceType[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {SPACE_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-[130px] rounded-full">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setMapVisible(!mapVisible)}
          >
            <MapPin className="h-4 w-4 mr-1" />
            {mapVisible ? "Hide map" : "Show map"}
          </Button>
        </div>
      </div>

      {/* Map placeholder */}
      {mapVisible && (
        <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video flex items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Map view (Google Maps / Mapbox integration)
          </p>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {filtered.length} space{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            No spaces match your filters. Try widening your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  )
}
