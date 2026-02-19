"use client"

import { useState, useEffect, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, DollarSign, Users, Trophy, Zap, PartyPopper, TrendingUp, Target } from "lucide-react"

interface FloatingNotification {
  id: string
  type: 'pledge' | 'milestone' | 'trending' | 'goal' | 'backer_count'
  user?: {
    name: string
    avatar: string
    location?: string
  }
  amount?: number
  project?: string
  message?: string
  timestamp: number
}

const mockNotifications: Omit<FloatingNotification, 'id' | 'timestamp'>[] = [
  {
    type: 'pledge',
    user: { name: 'Sarah M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face', location: 'New York, NY' },
    amount: 149,
    project: 'EcoTech Smart Home Hub'
  },
  {
    type: 'pledge',
    user: { name: 'John D.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', location: 'Los Angeles, CA' },
    amount: 79,
    project: 'MindfulMe App'
  },
  {
    type: 'milestone',
    project: 'Guardian AI Security',
    message: 'reached 75% funding!'
  },
  {
    type: 'pledge',
    user: { name: 'Emma T.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', location: 'Austin, TX' },
    amount: 250,
    project: 'Pixel Quest RPG'
  },
  {
    type: 'backer_count',
    project: 'SoundWave Earbuds',
    message: 'just reached 2,000 backers!'
  },
  {
    type: 'goal',
    project: 'ChefBox Scale',
    message: 'is now 100% funded! 🎉'
  },
  {
    type: 'trending',
    project: 'Verse Poetry Journal',
    message: 'is trending on GrowthStarter!'
  },
  {
    type: 'pledge',
    user: { name: 'Mike R.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', location: 'Seattle, WA' },
    amount: 499,
    project: 'EcoTech Smart Home Hub'
  }
]

const getNotificationIcon = (type: FloatingNotification['type']) => {
  switch (type) {
    case 'pledge':
      return <DollarSign className="h-4 w-4" />
    case 'milestone':
      return <Target className="h-4 w-4" />
    case 'trending':
      return <TrendingUp className="h-4 w-4" />
    case 'goal':
      return <PartyPopper className="h-4 w-4" />
    case 'backer_count':
      return <Users className="h-4 w-4" />
    default:
      return <Zap className="h-4 w-4" />
  }
}

const getNotificationColor = (type: FloatingNotification['type']) => {
  switch (type) {
    case 'pledge':
      return 'bg-emerald-500'
    case 'milestone':
      return 'bg-purple-500'
    case 'trending':
      return 'bg-orange-500'
    case 'goal':
      return 'bg-amber-500'
    case 'backer_count':
      return 'bg-blue-500'
    default:
      return 'bg-teal-500'
  }
}

interface FloatingNotificationsProps {
  enabled?: boolean
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  maxVisible?: number
  interval?: number
}

export function FloatingNotifications({
  enabled = true,
  position = 'bottom-left',
  maxVisible = 3,
  interval = 6000
}: FloatingNotificationsProps) {
  const [notifications, setNotifications] = useState<FloatingNotification[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const addNotification = useCallback(() => {
    const randomNotif = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
    const newNotif: FloatingNotification = {
      ...randomNotif,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    }
    
    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, maxVisible + 2)
      return updated
    })

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setDismissed(prev => new Set([...prev, newNotif.id]))
    }, 5000)
  }, [maxVisible])

  useEffect(() => {
    if (!enabled) return

    // Initial notification
    const initialTimeout = setTimeout(addNotification, 2000)
    
    // Periodic notifications
    const notifInterval = setInterval(addNotification, interval)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(notifInterval)
    }
  }, [enabled, interval, addNotification])

  // Clean up dismissed notifications
  useEffect(() => {
    const cleanup = setInterval(() => {
      setNotifications(prev => prev.filter(n => !dismissed.has(n.id)))
    }, 1000)
    return () => clearInterval(cleanup)
  }, [dismissed])

  const dismissNotification = (id: string) => {
    setDismissed(prev => new Set([...prev, id]))
  }

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-20 left-4',
    'top-right': 'top-20 right-4'
  }

  if (!enabled) return null

  const visibleNotifications = notifications
    .filter(n => !dismissed.has(n.id))
    .slice(0, maxVisible)

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 pointer-events-none`}>
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto animate-in slide-in-from-left-5 fade-in duration-500"
          style={{
            animationDelay: `${index * 100}ms`,
            opacity: 1 - (index * 0.15)
          }}
        >
          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 pr-8 max-w-sm hover:shadow-3xl transition-all hover:scale-102 group">
            {/* Dismiss Button */}
            <button
              onClick={() => dismissNotification(notification.id)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="flex items-start gap-3">
              {/* Icon or Avatar */}
              {notification.type === 'pledge' && notification.user ? (
                <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-700 shadow">
                  <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                  <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                </Avatar>
              ) : (
                <div className={`w-10 h-10 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center text-white shadow-lg`}>
                  {getNotificationIcon(notification.type)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                {notification.type === 'pledge' ? (
                  <>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {notification.user?.name}
                      <span className="font-normal text-slate-500"> just backed</span>
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {notification.project}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 text-xs">
                        ${notification.amount}
                      </Badge>
                      {notification.user?.location && (
                        <span className="text-xs text-slate-400">
                          {notification.user.location}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {notification.project}
                    </p>
                    <p className="text-xs text-slate-500">
                      {notification.message}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Animated border */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-teal-500/30 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  )
}

