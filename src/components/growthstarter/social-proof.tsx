"use client"

import { useState, useEffect } from "react"
import { Project } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  TrendingUp,
  Eye,
  Clock,
  Zap,
  Heart,
  Share2,
  Star
} from "lucide-react"

interface SocialProofProps {
  project: Project
  variant?: 'compact' | 'full'
}

// Mock recent backers
const mockRecentBackers = [
  { name: "John D.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face", amount: 75, time: "2 min ago" },
  { name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face", amount: 150, time: "5 min ago" },
  { name: "Alex K.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face", amount: 50, time: "8 min ago" },
  { name: "Emma T.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face", amount: 250, time: "12 min ago" },
  { name: "Mike R.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face", amount: 100, time: "15 min ago" },
]

export function SocialProof({ project, variant = 'compact' }: SocialProofProps) {
  const [viewCount, setViewCount] = useState(project.liveStats?.viewsToday || Math.floor(Math.random() * 500) + 100)
  const [recentBackers, setRecentBackers] = useState(mockRecentBackers.slice(0, 3))
  const [showActivity, setShowActivity] = useState(false)

  // Simulate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => prev + Math.floor(Math.random() * 5))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Calculate social metrics
  const hourlyBackers = project.liveStats?.hourlyBackers || Math.floor(project.backers / 24)
  const trendingScore = project.liveStats?.trendingScore || Math.floor(Math.random() * 30) + 70
  const shareCount = Math.floor(project.backers * 0.3)
  const watchCount = Math.floor(project.backers * 0.5)

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {/* Live viewers */}
        <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          {viewCount} viewing
        </Badge>

        {/* Recent backers */}
        <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900">
          <Zap className="h-3 w-3" />
          {hourlyBackers}+ backed today
        </Badge>

        {/* Trending */}
        {trendingScore >= 80 && (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900">
            <TrendingUp className="h-3 w-3" />
            Hot
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <Eye className="h-4 w-4" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{viewCount}</div>
          <div className="text-xs text-slate-500">Viewing now</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center text-emerald-500 mb-1">
            <Zap className="h-4 w-4" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{hourlyBackers}</div>
          <div className="text-xs text-slate-500">Backed today</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center text-pink-500 mb-1">
            <Heart className="h-4 w-4" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{watchCount}</div>
          <div className="text-xs text-slate-500">Watching</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center text-blue-500 mb-1">
            <Share2 className="h-4 w-4" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{shareCount}</div>
          <div className="text-xs text-slate-500">Shares</div>
        </div>
      </div>

      {/* Recent Backers */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-600" />
            Recent Backers
          </h4>
          <button 
            onClick={() => setShowActivity(!showActivity)}
            className="text-xs text-teal-600 hover:underline"
          >
            {showActivity ? 'Hide' : 'Show all'}
          </button>
        </div>

        <div className="space-y-2">
          {(showActivity ? mockRecentBackers : recentBackers).map((backer, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-lg"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={backer.avatar} alt={backer.name} />
                <AvatarFallback>{backer.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {backer.name} backed this project
                </p>
                <p className="text-xs text-slate-500">{backer.time}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                ${backer.amount}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Score */}
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl border border-orange-200 dark:border-orange-900">
        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
          <Star className="h-5 w-5 text-orange-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">Trending Score</span>
            <Badge className={`text-xs ${
              trendingScore >= 90 ? 'bg-orange-500' : 
              trendingScore >= 70 ? 'bg-amber-500' : 'bg-slate-500'
            } text-white`}>
              {trendingScore >= 90 ? '🔥 Hot' : trendingScore >= 70 ? '📈 Rising' : 'Normal'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${trendingScore}%` }}
              />
            </div>
            <span className="text-sm font-bold text-orange-600">{trendingScore}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Floating notification for real-time activity
export function LiveActivityNotification({ project }: { project: Project }) {
  const [notification, setNotification] = useState<typeof mockRecentBackers[0] | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show random backer notification periodically
    const interval = setInterval(() => {
      const randomBacker = mockRecentBackers[Math.floor(Math.random() * mockRecentBackers.length)]
      setNotification(randomBacker)
      setShow(true)
      setTimeout(() => setShow(false), 4000)
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  if (!notification || !show) return null

  return (
    <div className="fixed bottom-20 left-4 z-40 animate-in slide-in-from-left-5 duration-300">
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 max-w-xs">
        <Avatar className="h-10 w-10">
          <AvatarImage src={notification.avatar} alt={notification.name} />
          <AvatarFallback>{notification.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {notification.name} just backed
          </p>
          <p className="text-xs text-teal-600">${notification.amount} • {notification.time}</p>
        </div>
      </div>
    </div>
  )
}

