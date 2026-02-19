"use client"

import { Project } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  X,
  Scale,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  MapPin,
  Award,
  ShieldCheck,
  ExternalLink,
  Check
} from "lucide-react"
import Image from "next/image"

interface ProjectComparisonProps {
  projects: Project[]
  isOpen: boolean
  onClose: () => void
  onRemoveProject: (projectId: string) => void
  onBackProject: (project: Project) => void
}

interface ComparisonMetric {
  label: string
  key: string
  icon: React.ElementType
  format: (value: number) => string
  highlight: 'higher' | 'lower' | 'none'
}

const metrics: ComparisonMetric[] = [
  { label: 'Funding Goal', key: 'goal', icon: DollarSign, format: (v) => `$${v.toLocaleString()}`, highlight: 'none' },
  { label: 'Amount Raised', key: 'raised', icon: TrendingUp, format: (v) => `$${v.toLocaleString()}`, highlight: 'higher' },
  { label: 'Funding %', key: 'fundingPercentage', icon: TrendingUp, format: (v) => `${v}%`, highlight: 'higher' },
  { label: 'Backers', key: 'backers', icon: Users, format: (v) => v.toLocaleString(), highlight: 'higher' },
  { label: 'Days Left', key: 'daysLeft', icon: Clock, format: (v) => `${v} days`, highlight: 'none' },
  { label: 'Avg. Pledge', key: 'avgPledge', icon: DollarSign, format: (v) => `$${v.toFixed(0)}`, highlight: 'none' },
]

export function ProjectComparison({ projects, isOpen, onClose, onRemoveProject, onBackProject }: ProjectComparisonProps) {
  const getMetricValue = (project: Project, key: string): number => {
    if (key === 'fundingPercentage') return Math.round((project.raised / project.goal) * 100)
    if (key === 'avgPledge') return project.backers > 0 ? project.raised / project.backers : 0
    return (project as unknown as Record<string, number>)[key] || 0
  }

  const getHighestValue = (metric: ComparisonMetric) => {
    const values = projects.map(p => getMetricValue(p, metric.key))
    return metric.highlight === 'higher' ? Math.max(...values) : Math.min(...values)
  }

  if (projects.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-teal-500" />
            Compare Projects ({projects.length})
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Project Headers */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `160px repeat(${projects.length}, 1fr)` }}>
              <div />
              {projects.map((project) => (
                <div key={project.id} className="relative group">
                  <button onClick={() => onRemoveProject(project.id)} className="absolute -top-2 -right-2 z-10 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                    <div className="relative h-24 rounded-lg overflow-hidden mb-3">
                      <Image src={project.image} alt={project.title} fill className="object-cover" />
                      {project.trending && <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-[10px]">Trending</Badge>}
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 mb-1">{project.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><MapPin className="h-3 w-3" />{project.location}</p>
                    <div className="mt-3"><Progress value={Math.min(Math.round((project.raised / project.goal) * 100), 100)} className="h-2" /></div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.verified && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-300 text-emerald-600"><ShieldCheck className="h-2.5 w-2.5 mr-0.5" /> Verified</Badge>}
                      {project.featured && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-teal-300 text-teal-600"><Award className="h-2.5 w-2.5 mr-0.5" /> Featured</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Metrics */}
            <div className="space-y-2">
              {metrics.map((metric) => {
                const highestValue = getHighestValue(metric)
                return (
                  <div key={metric.key} className="grid gap-4 items-center" style={{ gridTemplateColumns: `160px repeat(${projects.length}, 1fr)` }}>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <metric.icon className="h-4 w-4" />{metric.label}
                    </div>
                    {projects.map((project) => {
                      const value = getMetricValue(project, metric.key)
                      const isHighest = metric.highlight !== 'none' && value === highestValue
                      return (
                        <div key={project.id} className={`text-center py-2 rounded-lg ${isHighest ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                          <span className="text-sm">{metric.format(value)}</span>
                          {isHighest && <Check className="h-3 w-3 inline ml-1 text-teal-500" />}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            <Separator className="my-4" />

            {/* Action Buttons */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `160px repeat(${projects.length}, 1fr)` }}>
              <div />
              {projects.map((project) => (
                <div key={project.id} className="flex gap-2 justify-center">
                  <Button size="sm" className="gs-gradient text-white" onClick={() => onBackProject(project)}>Back Project</Button>
                  <Button size="sm" variant="outline" onClick={() => window.open(`/campaign/${project.id}`, '_blank')}><ExternalLink className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ComparisonBarProps {
  selectedProjects: Project[]
  onOpenComparison: () => void
  onClearSelection: () => void
  maxProjects?: number
}

export function ComparisonBar({ selectedProjects, onOpenComparison, onClearSelection, maxProjects = 4 }: ComparisonBarProps) {
  if (selectedProjects.length === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-black/30 border border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex -space-x-2">
          {selectedProjects.slice(0, 4).map((project) => (
            <div key={project.id} className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white dark:border-slate-900">
              <Image src={project.image} alt={project.title} fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="text-sm">
          <span className="font-semibold text-slate-900 dark:text-white">{selectedProjects.length}</span>
          <span className="text-slate-500 dark:text-slate-400">/{maxProjects} selected</span>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Button onClick={onOpenComparison} size="sm" className="gs-gradient text-white" disabled={selectedProjects.length < 2}>
            <Scale className="h-4 w-4 mr-1" />Compare
          </Button>
          <Button onClick={onClearSelection} variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

