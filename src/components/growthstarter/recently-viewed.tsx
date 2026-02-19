"use client"

import { Project } from "@/types"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  X,
  ArrowRight,
  Trash2
} from "lucide-react"
import Image from "next/image"

interface RecentlyViewedProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
  onRemoveProject: (projectId: string) => void
  onClearAll: () => void
}

export function RecentlyViewed({
  projects,
  onProjectClick,
  onRemoveProject,
  onClearAll
}: RecentlyViewedProps) {
  if (projects.length === 0) return null

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Recently Viewed</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {projects.map((project) => {
          const fundingPercentage = Math.round((project.raised / project.goal) * 100)
          
          return (
            <div
              key={project.id}
              className="relative group flex-shrink-0 w-64 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg dark:hover:shadow-black/30 transition-all cursor-pointer"
              onClick={() => onProjectClick(project)}
            >
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveProject(project.id)
                }}
                className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <X className="h-3 w-3" />
              </button>

              {/* Image */}
              <div className="relative h-28 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <Progress value={Math.min(fundingPercentage, 100)} className="h-1.5" />
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {project.title}
                </h4>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-teal-600 dark:text-teal-400 font-medium">
                    {fundingPercentage}% funded
                  </span>
                  <span className={`${project.daysLeft <= 7 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    {project.daysLeft} days left
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <img 
                    src={project.creator.avatar} 
                    alt={project.creator.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {project.creator.name}
                  </span>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/5 transition-colors pointer-events-none" />
            </div>
          )
        })}

        {/* View more indicator */}
        {projects.length > 4 && (
          <div className="flex-shrink-0 w-32 flex items-center justify-center">
            <Button variant="ghost" size="sm" className="text-teal-600 dark:text-teal-400">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

