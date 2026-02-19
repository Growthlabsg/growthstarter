"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Heart,
  MessageCircle,
  Share2,
  DollarSign,
  Users,
  Trophy,
  Zap,
  Clock,
  ArrowRight,
  Bookmark,
  Star,
  Target,
  TrendingUp,
  PartyPopper
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  type: 'pledge' | 'comment' | 'milestone' | 'update' | 'share' | 'like' | 'goal_reached'
  user: {
    name: string
    avatar: string
    isAnonymous?: boolean
  }
  project?: {
    id: string
    title: string
    image: string
  }
  amount?: number
  message?: string
  timestamp: Date
  milestone?: string
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: 'pledge',
    user: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face" },
    project: { id: "1", title: "EcoTech Smart Home Hub", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=60&fit=crop" },
    amount: 149,
    timestamp: new Date(Date.now() - 1000 * 60 * 2)
  },
  {
    id: "2",
    type: 'milestone',
    user: { name: "Guardian AI", avatar: "" },
    project: { id: "2", title: "Guardian AI Security System", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=60&h=60&fit=crop" },
    milestone: "75% funded",
    timestamp: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: "3",
    type: 'comment',
    user: { name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
    project: { id: "3", title: "Pixel Quest RPG", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=60&h=60&fit=crop" },
    message: "This looks amazing! Can't wait to play",
    timestamp: new Date(Date.now() - 1000 * 60 * 8)
  },
  {
    id: "4",
    type: 'pledge',
    user: { name: "Anonymous", avatar: "", isAnonymous: true },
    project: { id: "4", title: "MindfulMe Mental Health App", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=60&h=60&fit=crop" },
    amount: 500,
    timestamp: new Date(Date.now() - 1000 * 60 * 12)
  },
  {
    id: "5",
    type: 'goal_reached',
    user: { name: "SoundWave", avatar: "" },
    project: { id: "5", title: "SoundWave Wireless Earbuds", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=60&h=60&fit=crop" },
    milestone: "100% funded",
    timestamp: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: "6",
    type: 'update',
    user: { name: "Kevin Park", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
    project: { id: "6", title: "ChefBox Smart Kitchen Scale", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=60&h=60&fit=crop" },
    message: "New stretch goal unlocked!",
    timestamp: new Date(Date.now() - 1000 * 60 * 20)
  },
  {
    id: "7",
    type: 'share',
    user: { name: "Emily Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
    project: { id: "1", title: "EcoTech Smart Home Hub", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=60&fit=crop" },
    timestamp: new Date(Date.now() - 1000 * 60 * 25)
  }
]

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'pledge':
      return <DollarSign className="h-4 w-4" />
    case 'comment':
      return <MessageCircle className="h-4 w-4" />
    case 'milestone':
      return <Target className="h-4 w-4" />
    case 'update':
      return <TrendingUp className="h-4 w-4" />
    case 'share':
      return <Share2 className="h-4 w-4" />
    case 'like':
      return <Heart className="h-4 w-4" />
    case 'goal_reached':
      return <PartyPopper className="h-4 w-4" />
    default:
      return <Zap className="h-4 w-4" />
  }
}

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'pledge':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'comment':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    case 'milestone':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    case 'update':
      return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    case 'share':
      return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400'
    case 'like':
      return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    case 'goal_reached':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
  }
}

const getActivityText = (activity: ActivityItem) => {
  switch (activity.type) {
    case 'pledge':
      return (
        <>
          <span className="font-semibold">{activity.user.isAnonymous ? 'Anonymous' : activity.user.name}</span>
          {' backed '}
          <span className="font-semibold text-teal-600 dark:text-teal-400">${activity.amount}</span>
        </>
      )
    case 'comment':
      return (
        <>
          <span className="font-semibold">{activity.user.name}</span>
          {' commented'}
        </>
      )
    case 'milestone':
      return (
        <>
          <span className="font-semibold">{activity.project?.title}</span>
          {' reached '}
          <span className="font-semibold text-purple-600 dark:text-purple-400">{activity.milestone}</span>
        </>
      )
    case 'update':
      return (
        <>
          <span className="font-semibold">{activity.user.name}</span>
          {' posted an update'}
        </>
      )
    case 'share':
      return (
        <>
          <span className="font-semibold">{activity.user.name}</span>
          {' shared'}
        </>
      )
    case 'like':
      return (
        <>
          <span className="font-semibold">{activity.user.name}</span>
          {' liked'}
        </>
      )
    case 'goal_reached':
      return (
        <>
          <span className="font-semibold">{activity.project?.title}</span>
          {' is now '}
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">fully funded! 🎉</span>
        </>
      )
    default:
      return 'Activity'
  }
}

interface ActivityFeedProps {
  variant?: 'full' | 'compact' | 'sidebar'
  limit?: number
  projectId?: string
}

export function ActivityFeed({ variant = 'full', limit = 10, projectId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities.slice(0, limit))
  const [isLive, setIsLive] = useState(true)

  // Simulate live activity
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: `new-${Date.now()}`,
        type: ['pledge', 'comment', 'share', 'like'][Math.floor(Math.random() * 4)] as ActivityItem['type'],
        user: {
          name: ['Alex M.', 'Sarah T.', 'Mike R.', 'Emma L.'][Math.floor(Math.random() * 4)],
          avatar: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1494790108377-be9c29b29330' : '1472099645785-5658abf4ff4e'}?w=40&h=40&fit=crop&crop=face`,
          isAnonymous: Math.random() > 0.8
        },
        project: mockActivities[Math.floor(Math.random() * mockActivities.length)].project,
        amount: [25, 50, 75, 100, 149, 250][Math.floor(Math.random() * 6)],
        timestamp: new Date()
      }

      setActivities(prev => [newActivity, ...prev.slice(0, limit - 1)])
    }, 8000)

    return () => clearInterval(interval)
  }, [isLive, limit])

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        {activities.slice(0, 5).map((activity) => (
          <div 
            key={activity.id}
            className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0 text-sm text-slate-700 dark:text-slate-300 truncate">
              {getActivityText(activity)}
            </div>
            <span className="text-xs text-slate-400 flex-shrink-0">
              {formatDistanceToNow(activity.timestamp, { addSuffix: false })}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Live Activity</h3>
                <p className="text-xs text-slate-500">Real-time updates</p>
              </div>
            </div>
            <Badge className={`text-xs ${isLive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-slate-100 text-slate-600'}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {isLive ? 'Live' : 'Paused'}
            </Badge>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
          {activities.map((activity, index) => (
            <div 
              key={activity.id}
              className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                index === 0 ? 'animate-in fade-in slide-in-from-top-2 duration-500' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {getActivityText(activity)}
                  </p>
                  {activity.project && activity.type !== 'milestone' && activity.type !== 'goal_reached' && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {activity.project.title}
                    </p>
                  )}
                  {activity.message && (
                    <p className="text-xs text-slate-500 mt-1 italic">
                      "{activity.message}"
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs text-teal-600 hover:text-teal-700"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Pause Live Feed' : 'Resume Live Feed'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/30 dark:via-emerald-950/30 dark:to-cyan-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Activity Feed</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">See what's happening in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${isLive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-slate-100 text-slate-600'}`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {isLive ? 'Live' : 'Paused'}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setIsLive(!isLive)}>
              {isLive ? 'Pause' : 'Resume'}
            </Button>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
              index === 0 ? 'animate-in fade-in slide-in-from-top-3 duration-500' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {getActivityText(activity)}
                    </p>
                    {activity.project && activity.type !== 'milestone' && activity.type !== 'goal_reached' && (
                      <div className="flex items-center gap-2 mt-2">
                        <img 
                          src={activity.project.image} 
                          alt={activity.project.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 cursor-pointer">
                          {activity.project.title}
                        </span>
                      </div>
                    )}
                    {activity.message && (
                      <p className="text-sm text-slate-500 mt-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg italic">
                        "{activity.message}"
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <Button variant="ghost" className="w-full text-teal-600 hover:text-teal-700">
          Load More Activity
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

