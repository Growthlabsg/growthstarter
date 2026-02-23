"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COMMUNITY_CATEGORY_LABELS } from "@/data/community-categories"
import { Search, LayoutGrid, List, X, BadgeCheck } from "lucide-react"

export type SortOption = "recent" | "members" | "activity" | "trending" | "new"
export type SizeFilter = "all" | "small" | "medium" | "large"

interface DirectoryFiltersProps {
  searchQuery: string
  onSearchChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
  sort: SortOption
  onSortChange: (v: SortOption) => void
  viewMode: "grid" | "list"
  onViewModeChange: (v: "grid" | "list") => void
  resultCount: number
  verifiedOnly?: boolean
  onVerifiedOnlyChange?: (v: boolean) => void
  sizeFilter?: SizeFilter
  onSizeFilterChange?: (v: SizeFilter) => void
  onClearFilters?: () => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "recent", label: "Most recent" },
  { value: "members", label: "Most members" },
  { value: "activity", label: "Most active" },
  { value: "new", label: "New (30 days)" },
]

export function DirectoryFilters({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultCount,
  verifiedOnly = false,
  onVerifiedOnlyChange,
  sizeFilter = "all",
  onSizeFilterChange,
  onClearFilters,
}: DirectoryFiltersProps) {
  const hasFilters = searchQuery || category !== "all" || sort !== "trending" || verifiedOnly || sizeFilter !== "all"

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-h-[44px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search communities..."
            className="pl-9 rounded-xl min-h-[44px]"
          />
        </div>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px] rounded-xl min-h-[44px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {COMMUNITY_CATEGORY_LABELS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-[160px] rounded-xl min-h-[44px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {onSizeFilterChange && (
          <Select value={sizeFilter} onValueChange={(v) => onSizeFilterChange(v as SizeFilter)}>
            <SelectTrigger className="w-full sm:w-[140px] rounded-xl min-h-[44px]">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any size</SelectItem>
              <SelectItem value="small">Small (&lt;500)</SelectItem>
              <SelectItem value="medium">Medium (500–2K)</SelectItem>
              <SelectItem value="large">Large (2K+)</SelectItem>
            </SelectContent>
          </Select>
        )}
        {onVerifiedOnlyChange && (
          <Button
            variant={verifiedOnly ? "default" : "outline"}
            size="sm"
            className={`min-h-[44px] rounded-xl ${verifiedOnly ? "gs-gradient text-white" : ""}`}
            onClick={() => onVerifiedOnlyChange(!verifiedOnly)}
          >
            <BadgeCheck className="h-4 w-4 mr-1.5" />
            Verified only
          </Button>
        )}
        <div className="flex gap-1 rounded-xl border border-slate-200 dark:border-slate-700 p-1 min-h-[44px] items-center">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className={viewMode === "grid" ? "gs-gradient text-white rounded-lg" : "rounded-lg"}
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className={viewMode === "list" ? "gs-gradient text-white rounded-lg" : "rounded-lg"}
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          {resultCount} {resultCount === 1 ? "community" : "communities"}
        </span>
        {hasFilters && onClearFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-slate-500">
            <X className="h-3.5 w-3.5 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
