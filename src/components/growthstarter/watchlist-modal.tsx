"use client"

import { useState } from "react"
import { Project } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Bookmark,
  X,
  Search,
  Clock,
  TrendingUp,
  Bell,
  BellOff,
  Trash2,
  ExternalLink,
  SortAsc,
  Filter
} from "lucide-react"
import Image from "next/image"

interface WatchlistModalProps {
  isOpen: boolean
  onClose: () => void
  bookmarkedProjects: Project[]
  onRemoveBookmark: (projectId: string) => void
  onProjectClick: (project: Project) => void
  onBackProject: (project: Project) => void
}

type SortOption = 'recent' | 'ending-soon' | 'most-funded' | 'name'

export function WatchlistModal({
  isOpen,
  onClose,
  bookmarkedProjects,
  onRemoveBookmark,
  onProjectClick,
  onBackProject
}: WatchlistModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [notifyAll, setNotifyAll] = useState(true)

  const filteredProjects = bookmarkedProjects
    .filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'ending-soon':
          return a.daysLeft - b.daysLeft
        case 'most-funded':
          return (b.raised / b.goal) - (a.raised / a.goal)
        case 'name':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const endingSoonCount = bookmarkedProjects.filter(p => p.daysLeft <= 7).length
  const fullyFundedCount = bookmarkedProjects.filter(p => p.raised >= p.goal).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden" showCloseButton={false}>
        <DialogHeader className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                <Bookmark className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  Your Watchlist
                </DialogTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {bookmarkedProjects.length} saved project{bookmarkedProjects.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Stats */}
          {bookmarkedProjects.length > 0 && (
            <div className="flex gap-4 mt-4">
              {endingSoonCount > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {endingSoonCount} ending soon
                </Badge>
              )}
              {fullyFundedCount > 0 && (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {fullyFundedCount} fully funded
                </Badge>
              )}
            </div>
          )}

          {/* Search & Controls */}
          {bookmarkedProjects.length > 0 && (
            <div className="flex gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search watchlist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              >
                <option value="recent">Recently Added</option>
                <option value="ending-soon">Ending Soon</option>
                <option value="most-funded">Most Funded</option>
                <option value="name">Name A-Z</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNotifyAll(!notifyAll)}
                className={notifyAll ? 'text-teal-600' : ''}
              >
                {notifyAll ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </DialogHeader>

        <div className="overflow-y-auto max-h-[50vh] p-4">
          {bookmarkedProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">No saved projects yet</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Click the bookmark icon on any project to save it here for quick access.
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">No projects match your search</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project) => {
                const fundingPercent = Math.round((project.raised / project.goal) * 100)
                const isEndingSoon = project.daysLeft <= 7
                
                return (
                  <div
                    key={project.id}
                    className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div 
                      className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => onProjectClick(project)}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                      {isEndingSoon && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                          <Badge variant="destructive" className="text-[10px]">
                            {project.daysLeft}d
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div 
                          className="cursor-pointer"
                          onClick={() => onProjectClick(project)}
                        >
                          <h4 className="font-semibold text-slate-900 dark:text-white truncate hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                            {project.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            by {project.creator.name}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveBookmark(project.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-teal-600 dark:text-teal-400 font-medium">
                            {fundingPercent}% funded
                          </span>
                          <span className={isEndingSoon ? 'text-red-500 font-medium' : 'text-slate-500'}>
                            {project.daysLeft} days left
                          </span>
                        </div>
                        <Progress value={Math.min(fundingPercent, 100)} className="h-1.5" />
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          className="h-7 text-xs gs-gradient text-white"
                          onClick={() => onBackProject(project)}
                        >
                          Back Project
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => onProjectClick(project)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {bookmarkedProjects.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Total potential backing: ${bookmarkedProjects.reduce((sum, p) => sum + (p.rewards[0]?.amount || 25), 0).toLocaleString()}
              </span>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                Clear All
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

