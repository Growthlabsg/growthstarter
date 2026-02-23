"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Grid3X3,
  List,
  Flame,
  Star,
  Clock,
  TrendingUp,
  X
} from "lucide-react"
import { ProjectCategory, SortOption, FilterOption } from "@/types"
import { categories, sortOptions, filterOptions } from "@/data/mock-projects"

interface SearchFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
  filterBy: FilterOption
  onFilterChange: (value: FilterOption) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  activeFiltersCount: number
  onClearFilters: () => void
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  viewMode,
  onViewModeChange,
  priceRange,
  onPriceRangeChange,
  activeFiltersCount,
  onClearFilters
}: SearchFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [quickFilters, setQuickFilters] = useState({
    trending: false,
    featured: false,
    endingSoon: false
  })

  const toggleQuickFilter = (filter: keyof typeof quickFilters) => {
    const newFilters = { ...quickFilters, [filter]: !quickFilters[filter] }
    setQuickFilters(newFilters)
    
    // Update filter based on active quick filters
    if (newFilters.trending) onFilterChange("trending")
    else if (newFilters.featured) onFilterChange("featured")
    else if (newFilters.endingSoon) onFilterChange("ending-soon")
    else onFilterChange("all")
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search projects, creators, or tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 pr-4 h-11 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#0F7377]/20 focus:border-[#0F7377] bg-white dark:bg-slate-900"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#0F7377]/20">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#0F7377]/20">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* View Mode & Filters Toggle */}
        <div className="flex items-center gap-2 justify-between sm:justify-start">
          <Button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            variant="outline"
            className={`rounded-xl h-11 px-4 transition-colors ${
              showAdvancedFilters || activeFiltersCount > 0
                ? 'bg-[#0F7377]/10 border-[#0F7377]/30 text-[#0F7377]'
                : ''
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 gs-gradient text-white text-xs px-1.5 py-0">
                {activeFiltersCount}
              </Badge>
            )}
            {showAdvancedFilters ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
          
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={`rounded-lg h-9 w-9 p-0 ${
                viewMode === "grid" 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-[#0F7377]" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("list")}
              className={`rounded-lg h-9 w-9 p-0 ${
                viewMode === "list" 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-[#0F7377]" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Filter By Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Project Status
              </label>
              <Select value={filterBy} onValueChange={(value) => onFilterChange(value as FilterOption)}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Goal Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Funding Goal Range
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0] || ""}
                    onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="pl-7 rounded-xl"
                  />
                </div>
                <span className="text-slate-400">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1] === 1000000 ? "" : priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 1000000])}
                    className="pl-7 rounded-xl"
                  />
                </div>
              </div>
            </div>
            
            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Quick Filters
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={quickFilters.trending ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleQuickFilter("trending")}
                  className={`rounded-xl text-xs ${
                    quickFilters.trending ? "gs-gradient text-white border-0" : ""
                  }`}
                >
                  <Flame className="h-3 w-3 mr-1" />
                  Trending
                </Button>
                <Button
                  variant={quickFilters.featured ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleQuickFilter("featured")}
                  className={`rounded-xl text-xs ${
                    quickFilters.featured ? "gs-gradient text-white border-0" : ""
                  }`}
                >
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Button>
                <Button
                  variant={quickFilters.endingSoon ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleQuickFilter("endingSoon")}
                  className={`rounded-xl text-xs ${
                    quickFilters.endingSoon ? "bg-red-500 text-white border-0 hover:bg-red-600" : ""
                  }`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Ending Soon
                </Button>
              </div>
            </div>
            
            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                onClick={() => {
                  onClearFilters()
                  setQuickFilters({ trending: false, featured: false, endingSoon: false })
                }}
                variant="outline"
                className="rounded-xl w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-slate-500">Active filters:</span>
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {categories.find(c => c.value === selectedCategory)?.label}
                    <button
                      onClick={() => onCategoryChange("all")}
                      className="ml-1.5 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filterBy !== "all" && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {filterOptions.find(f => f.value === filterBy)?.label}
                    <button
                      onClick={() => onFilterChange("all")}
                      className="ml-1.5 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    Search: &quot;{searchTerm}&quot;
                    <button
                      onClick={() => onSearchChange("")}
                      className="ml-1.5 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

