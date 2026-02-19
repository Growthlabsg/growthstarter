"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Flame,
  Award,
  ChevronRight
} from "lucide-react"

interface TopBacker {
  id: string
  name: string
  avatar: string
  totalBacked: number
  projectsCount: number
  joinDate: string
  badge?: 'gold' | 'silver' | 'bronze' | 'platinum'
  isAnonymous?: boolean
  recentProject?: string
}

const mockTopBackers: TopBacker[] = [
  {
    id: "1",
    name: "Alexander Chen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    totalBacked: 125000,
    projectsCount: 89,
    joinDate: "2020",
    badge: 'platinum',
    recentProject: "EcoTech Smart Home Hub"
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
    totalBacked: 87500,
    projectsCount: 67,
    joinDate: "2021",
    badge: 'gold',
    recentProject: "MindfulMe App"
  },
  {
    id: "3",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    totalBacked: 65000,
    projectsCount: 52,
    joinDate: "2021",
    badge: 'gold',
    recentProject: "Pixel Quest RPG"
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    totalBacked: 48000,
    projectsCount: 45,
    joinDate: "2022",
    badge: 'silver',
    recentProject: "ChefBox Scale"
  },
  {
    id: "5",
    name: "Michael Brown",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
    totalBacked: 35000,
    projectsCount: 38,
    joinDate: "2022",
    badge: 'silver',
    recentProject: "SoundWave Earbuds"
  },
  {
    id: "6",
    name: "Anonymous Backer",
    avatar: "",
    totalBacked: 32000,
    projectsCount: 30,
    joinDate: "2023",
    badge: 'bronze',
    isAnonymous: true
  },
  {
    id: "7",
    name: "Lisa Johnson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
    totalBacked: 28000,
    projectsCount: 25,
    joinDate: "2023",
    badge: 'bronze',
    recentProject: "Verse Poetry Journal"
  }
]

const getBadgeIcon = (badge?: string, rank?: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-amber-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />
  
  switch (badge) {
    case 'platinum':
      return <Award className="h-4 w-4 text-purple-500" />
    case 'gold':
      return <Star className="h-4 w-4 text-amber-500" />
    case 'silver':
      return <Star className="h-4 w-4 text-slate-400" />
    case 'bronze':
      return <Star className="h-4 w-4 text-amber-700" />
    default:
      return null
  }
}

const getBadgeColor = (badge?: string) => {
  switch (badge) {
    case 'platinum':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    case 'gold':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    case 'silver':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
    case 'bronze':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
    default:
      return ''
  }
}

interface BackerLeaderboardProps {
  projectId?: string
  variant?: 'full' | 'compact'
}

export function BackerLeaderboard({ projectId, variant = 'full' }: BackerLeaderboardProps) {
  const [activeTab, setActiveTab] = useState('all-time')

  if (variant === 'compact') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
              <Trophy className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Top Backers</h3>
              <p className="text-xs text-slate-500">This month</p>
            </div>
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {mockTopBackers.slice(0, 5).map((backer, index) => (
            <div key={backer.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="w-6 text-center font-bold text-slate-400 text-sm">
                {index + 1}
              </div>
              <Avatar className="h-8 w-8">
                {!backer.isAnonymous && <AvatarImage src={backer.avatar} alt={backer.name} />}
                <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-xs">
                  {backer.isAnonymous ? '?' : backer.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {backer.name}
                </p>
              </div>
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                ${(backer.totalBacked / 1000).toFixed(0)}k
              </span>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
          <Button variant="ghost" className="w-full text-sm text-teal-600 hover:text-teal-700">
            View Full Leaderboard
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-yellow-950/30 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Backer Leaderboard</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Top supporters in our community</p>
            </div>
          </div>
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 border-amber-200 dark:border-amber-800">
            <Flame className="h-3 w-3 mr-1" />
            Live Rankings
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="grid grid-cols-3 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
          <TabsTrigger value="all-time" className="rounded-lg text-sm">All Time</TabsTrigger>
          <TabsTrigger value="this-month" className="rounded-lg text-sm">This Month</TabsTrigger>
          <TabsTrigger value="this-week" className="rounded-lg text-sm">This Week</TabsTrigger>
        </TabsList>

        <TabsContent value="all-time" className="mt-4 space-y-3">
          {/* Top 3 Podium */}
          <div className="flex items-end justify-center gap-4 py-6">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <Avatar className="h-14 w-14 ring-4 ring-slate-300 dark:ring-slate-600 mb-2">
                <AvatarImage src={mockTopBackers[1].avatar} alt={mockTopBackers[1].name} />
                <AvatarFallback>{mockTopBackers[1].name[0]}</AvatarFallback>
              </Avatar>
              <div className="w-20 h-16 bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-500 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-600 dark:text-slate-300">2</span>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-2 truncate w-20 text-center">
                {mockTopBackers[1].name.split(' ')[0]}
              </p>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-4">
              <Crown className="h-6 w-6 text-amber-500 mb-1 animate-pulse" />
              <Avatar className="h-16 w-16 ring-4 ring-amber-400 dark:ring-amber-500 mb-2">
                <AvatarImage src={mockTopBackers[0].avatar} alt={mockTopBackers[0].name} />
                <AvatarFallback>{mockTopBackers[0].name[0]}</AvatarFallback>
              </Avatar>
              <div className="w-24 h-20 bg-gradient-to-t from-amber-400 to-amber-300 dark:from-amber-600 dark:to-amber-500 rounded-t-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-amber-800 dark:text-amber-100">1</span>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-2 truncate w-24 text-center">
                {mockTopBackers[0].name.split(' ')[0]}
              </p>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <Avatar className="h-14 w-14 ring-4 ring-amber-600 dark:ring-amber-700 mb-2">
                <AvatarImage src={mockTopBackers[2].avatar} alt={mockTopBackers[2].name} />
                <AvatarFallback>{mockTopBackers[2].name[0]}</AvatarFallback>
              </Avatar>
              <div className="w-20 h-14 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-amber-200">3</span>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-2 truncate w-20 text-center">
                {mockTopBackers[2].name.split(' ')[0]}
              </p>
            </div>
          </div>

          {/* Full List */}
          <div className="space-y-2">
            {mockTopBackers.map((backer, index) => (
              <div
                key={backer.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md ${
                  index < 3 
                    ? 'bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-950/20' 
                    : 'bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
              >
                {/* Rank */}
                <div className="w-8 flex items-center justify-center">
                  {index < 3 ? (
                    getBadgeIcon(undefined, index + 1)
                  ) : (
                    <span className="text-lg font-bold text-slate-400">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Avatar & Info */}
                <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-slate-700 shadow">
                  {!backer.isAnonymous && <AvatarImage src={backer.avatar} alt={backer.name} />}
                  <AvatarFallback className="bg-slate-200 dark:bg-slate-700">
                    {backer.isAnonymous ? '?' : backer.name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {backer.name}
                    </span>
                    {backer.badge && (
                      <Badge className={`text-[10px] ${getBadgeColor(backer.badge)}`}>
                        {getBadgeIcon(backer.badge)}
                        <span className="ml-1 capitalize">{backer.badge}</span>
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {backer.projectsCount} projects
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Since {backer.joinDate}
                    </span>
                  </div>
                </div>

                {/* Total Backed */}
                <div className="text-right">
                  <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
                    ${backer.totalBacked.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">Total Backed</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="this-month" className="mt-4">
          <div className="text-center py-8 text-slate-500">
            Monthly leaderboard coming soon!
          </div>
        </TabsContent>

        <TabsContent value="this-week" className="mt-4">
          <div className="text-center py-8 text-slate-500">
            Weekly leaderboard coming soon!
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center justify-around text-center">
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">$2.5M+</div>
            <div className="text-xs text-slate-500">Total Backed</div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">1,200+</div>
            <div className="text-xs text-slate-500">Active Backers</div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">450+</div>
            <div className="text-xs text-slate-500">Projects Funded</div>
          </div>
        </div>
      </div>
    </div>
  )
}

