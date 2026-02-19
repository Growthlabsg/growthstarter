"use client"

import { useState, useEffect } from "react"
import { Project } from "@/types"
import { Button } from "@/components/ui/button"
import {
  PartyPopper,
  Rocket,
  Trophy,
  Star,
  Sparkles,
  X,
  Share2
} from "lucide-react"
import confetti from "canvas-confetti"

interface MilestoneCelebrationProps {
  project: Project
  milestone: number // Percentage milestone reached (25, 50, 75, 100, etc.)
  isVisible: boolean
  onClose: () => void
  onShare: (project: Project) => void
}

const milestoneConfig: Record<number, { icon: React.ElementType; title: string; message: string; color: string }> = {
  25: {
    icon: Star,
    title: "25% Funded!",
    message: "Great start! This project is gaining momentum.",
    color: "from-blue-500 to-cyan-500"
  },
  50: {
    icon: Rocket,
    title: "Halfway There!",
    message: "50% funded! This project is on fire!",
    color: "from-purple-500 to-pink-500"
  },
  75: {
    icon: Sparkles,
    title: "Almost There!",
    message: "75% funded! The finish line is in sight!",
    color: "from-orange-500 to-red-500"
  },
  100: {
    icon: Trophy,
    title: "Fully Funded!",
    message: "This project has reached its goal!",
    color: "from-yellow-400 to-amber-500"
  },
  150: {
    icon: PartyPopper,
    title: "Overfunded!",
    message: "150%! This project is breaking records!",
    color: "from-emerald-500 to-teal-500"
  },
  200: {
    icon: Trophy,
    title: "Double Funded!",
    message: "200%! Incredible support from the community!",
    color: "from-indigo-500 to-violet-500"
  }
}

export function MilestoneCelebration({
  project,
  milestone,
  isVisible,
  onClose,
  onShare
}: MilestoneCelebrationProps) {
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      // Trigger confetti animation
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#0F7377', '#00A884', '#FFD700', '#FF6B6B']
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#0F7377', '#00A884', '#FFD700', '#FF6B6B']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }

      frame()
      setHasAnimated(true)
    }
  }, [isVisible, hasAnimated])

  useEffect(() => {
    if (!isVisible) {
      setHasAnimated(false)
    }
  }, [isVisible])

  if (!isVisible) return null

  const config = milestoneConfig[milestone] || milestoneConfig[100]
  const Icon = config.icon

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Gradient header */}
        <div className={`relative bg-gradient-to-br ${config.color} px-6 py-8 text-white text-center`}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          </div>

          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <Icon className="h-10 w-10" />
            </div>
            
            <h2 className="text-3xl font-bold mb-2">{config.title}</h2>
            <p className="text-white/90">{config.message}</p>
          </div>
        </div>

        {/* Project info */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={project.image}
              alt={project.title}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {project.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                by {project.creator.name}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {milestone}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Funded</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                ${project.raised.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Raised</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {project.backers.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Backers</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => onShare(project)}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share the News
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 gs-gradient text-white"
            >
              Continue Exploring
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

// Hook to track milestone achievements
export function useMilestoneTracker(projects: Project[]) {
  const [milestones, setMilestones] = useState<Map<string, number[]>>(new Map())
  const [currentCelebration, setCurrentCelebration] = useState<{
    project: Project
    milestone: number
  } | null>(null)

  useEffect(() => {
    projects.forEach(project => {
      const fundingPercentage = Math.round((project.raised / project.goal) * 100)
      const previousMilestones = milestones.get(project.id) || []
      
      const checkpoints = [25, 50, 75, 100, 150, 200]
      const newMilestones = checkpoints.filter(
        checkpoint => 
          fundingPercentage >= checkpoint && 
          !previousMilestones.includes(checkpoint)
      )

      if (newMilestones.length > 0) {
        const highestNewMilestone = Math.max(...newMilestones)
        
        // Update milestones
        setMilestones(prev => {
          const updated = new Map(prev)
          updated.set(project.id, [...previousMilestones, ...newMilestones])
          return updated
        })

        // Trigger celebration for the highest new milestone
        setCurrentCelebration({
          project,
          milestone: highestNewMilestone
        })
      }
    })
  }, [projects, milestones])

  const closeCelebration = () => {
    setCurrentCelebration(null)
  }

  return {
    currentCelebration,
    closeCelebration
  }
}

