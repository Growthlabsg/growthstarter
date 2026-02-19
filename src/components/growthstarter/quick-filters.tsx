"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Flame,
  Star,
  Clock,
  TrendingUp,
  Sparkles,
  Zap,
  Award,
  Target,
  Rocket,
  Heart,
  X
} from "lucide-react"
import { FilterOption } from "@/types"

interface QuickFiltersProps {
  activeFilter: FilterOption
  onFilterChange: (filter: FilterOption) => void
  projectCounts: {
    trending: number
    featured: number
    endingSoon: number
    new: number
    highlyFunded: number
  }
}

const quickFilters = [
  { id: 'trending' as FilterOption, label: 'Trending', icon: Flame, color: 'orange' },
  { id: 'featured' as FilterOption, label: 'Featured', icon: Star, color: 'teal' },
  { id: 'ending-soon' as FilterOption, label: 'Ending Soon', icon: Clock, color: 'red' },
  { id: 'new' as FilterOption, label: 'New', icon: Sparkles, color: 'blue' },
  { id: 'highly-funded' as FilterOption, label: '80%+ Funded', icon: Target, color: 'green' },
]

export function QuickFilters({ activeFilter, onFilterChange, projectCounts }: QuickFiltersProps) {
  const getCount = (id: FilterOption) => {
    switch (id) {
      case 'trending': return projectCounts.trending
      case 'featured': return projectCounts.featured
      case 'ending-soon': return projectCounts.endingSoon
      case 'new': return projectCounts.new
      case 'highly-funded': return projectCounts.highlyFunded
      default: return 0
    }
  }

  const getColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      switch (color) {
        case 'orange': return 'bg-orange-500 text-white border-orange-500'
        case 'teal': return 'bg-teal-500 text-white border-teal-500'
        case 'red': return 'bg-red-500 text-white border-red-500'
        case 'blue': return 'bg-blue-500 text-white border-blue-500'
        case 'green': return 'bg-emerald-500 text-white border-emerald-500'
        default: return 'bg-slate-500 text-white border-slate-500'
      }
    }
    switch (color) {
      case 'orange': return 'text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/50'
      case 'teal': return 'text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/50'
      case 'red': return 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/50'
      case 'blue': return 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50'
      case 'green': return 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
      default: return 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
    }
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
      <span className="text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">Quick filters:</span>
      
      {quickFilters.map((filter) => {
        const Icon = filter.icon
        const isActive = activeFilter === filter.id
        const count = getCount(filter.id)
        
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(isActive ? 'all' : filter.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all flex-shrink-0 ${
              getColorClasses(filter.color, isActive)
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {filter.label}
            {count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive 
                  ? 'bg-white/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {count}
              </span>
            )}
            {isActive && (
              <X className="h-3 w-3 ml-0.5" />
            )}
          </button>
        )
      })}
    </div>
  )
}

