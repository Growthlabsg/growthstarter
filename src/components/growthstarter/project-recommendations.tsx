"use client"

import { useMemo } from "react"
import { Project } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  ArrowRight,
  Heart,
  Bookmark,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProjectRecommendationsProps {
  currentProject: Project | null
  allProjects: Project[]
  likedProjects: string[]
  bookmarkedProjects: string[]
  onProjectClick: (project: Project) => void
  onLike: (projectId: string) => void
  onBookmark: (projectId: string) => void
}

export function ProjectRecommendations({
  currentProject,
  allProjects,
  likedProjects,
  bookmarkedProjects,
  onProjectClick,
  onLike,
  onBookmark
}: ProjectRecommendationsProps) {
  const [scrollIndex, setScrollIndex] = useState(0)

  const recommendations = useMemo(() => {
    if (!currentProject) return []

    // Score projects based on similarity
    const scored = allProjects
      .filter(p => p.id !== currentProject.id)
      .map(project => {
        let score = 0

        // Same category = high score
        if (project.category === currentProject.category) score += 30

        // Shared tags
        const sharedTags = project.tags.filter(t => currentProject.tags.includes(t))
        score += sharedTags.length * 10

        // Similar funding range
        const goalRatio = project.goal / currentProject.goal
        if (goalRatio >= 0.5 && goalRatio <= 2) score += 15

        // Similar funding progress
        const currentProgress = currentProject.raised / currentProject.goal
        const projectProgress = project.raised / project.goal
        if (Math.abs(currentProgress - projectProgress) < 0.3) score += 10

        // Boost trending/featured
        if (project.trending) score += 5
        if (project.featured) score += 5

        // Boost if user hasn't seen it (not liked/bookmarked)
        if (!likedProjects.includes(project.id) && !bookmarkedProjects.includes(project.id)) {
          score += 5
        }

        return { project, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(s => s.project)

    return scored
  }, [currentProject, allProjects, likedProjects, bookmarkedProjects])

  if (!currentProject || recommendations.length === 0) return null

  const visibleCount = 4
  const maxScroll = Math.max(0, recommendations.length - visibleCount)

  const scrollLeft = () => setScrollIndex(prev => Math.max(0, prev - 1))
  const scrollRight = () => setScrollIndex(prev => Math.min(maxScroll, prev + 1))

  return (
    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">You Might Also Like</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Based on this project</p>
          </div>
        </div>

        {recommendations.length > visibleCount && (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={scrollLeft}
              disabled={scrollIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={scrollRight}
              disabled={scrollIndex >= maxScroll}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex gap-3 transition-transform duration-300"
          style={{ transform: `translateX(-${scrollIndex * 25}%)` }}
        >
          {recommendations.map((project) => {
            const fundingPercent = Math.round((project.raised / project.goal) * 100)
            const isLiked = likedProjects.includes(project.id)
            const isBookmarked = bookmarkedProjects.includes(project.id)

            return (
              <div
                key={project.id}
                className="w-[calc(25%-9px)] flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg dark:hover:shadow-black/20 transition-all group cursor-pointer"
                onClick={() => onProjectClick(project)}
              >
                <div className="relative h-28">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Quick actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onLike(project.id)
                      }}
                      className={`p-1.5 rounded-full backdrop-blur-sm ${
                        isLiked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onBookmark(project.id)
                      }}
                      className={`p-1.5 rounded-full backdrop-blur-sm ${
                        isBookmarked 
                          ? 'bg-teal-500 text-white' 
                          : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Bookmark className={`h-3 w-3 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Funding overlay */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <Progress value={Math.min(fundingPercent, 100)} className="h-1" />
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="font-medium text-sm text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    {project.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1.5 text-xs">
                    <span className="text-teal-600 dark:text-teal-400 font-medium">
                      {fundingPercent}%
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {project.daysLeft}d left
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {project.category}
                    </Badge>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

