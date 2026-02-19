"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Rocket,
  ArrowLeft,
  Plus,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  BarChart3,
  MessageCircle,
  Bell,
  Settings,
  Eye,
  Heart,
  Share2,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  Mail,
  Activity
} from "lucide-react"
import Image from "next/image"
import { mockProjects } from "@/data/mock-projects"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [campaignFilter, setCampaignFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Simulated user campaigns (in real app, this comes from API)
  const userCampaigns = mockProjects.slice(0, 3).map(p => ({
    ...p,
    isOwner: true,
    pendingMessages: Math.floor(Math.random() * 10),
    pendingComments: Math.floor(Math.random() * 20),
    recentActivity: [
      { type: "backer", message: "New backer pledged $149", time: "2 hours ago" },
      { type: "comment", message: "New comment on your project", time: "4 hours ago" },
      { type: "milestone", message: "50% funding reached!", time: "1 day ago" }
    ]
  }))

  // Dashboard stats
  const dashboardStats = useMemo(() => {
    const totalRaised = userCampaigns.reduce((sum, c) => sum + (c.liveStats?.currentRaised || c.raised), 0)
    const totalBackers = userCampaigns.reduce((sum, c) => sum + (c.liveStats?.currentBackers || c.backers), 0)
    const avgConversion = 4.5
    return {
      totalRaised,
      totalBackers,
      activeCampaigns: userCampaigns.filter(c => c.status === "active").length,
      avgConversion
    }
  }, [userCampaigns])

  // Notifications
  const notifications = [
    { id: 1, type: "backer", title: "New Backer!", message: "John D. backed EcoTech with $149", time: "2h ago", read: false, urgent: false },
    { id: 2, type: "milestone", title: "Milestone Reached!", message: "EcoTech reached 50% funding goal", time: "5h ago", read: false, urgent: true },
    { id: 3, type: "comment", title: "New Comment", message: "Sarah left a comment on your project", time: "1d ago", read: true, urgent: false },
    { id: 4, type: "update", title: "Campaign Update", message: "Your update was published successfully", time: "2d ago", read: true, urgent: false }
  ]

  // Filter campaigns
  const filteredCampaigns = userCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = campaignFilter === "all" || campaign.status === campaignFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
      case "funded": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      case "ended": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      default: return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="gs-glass border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-[#0F7377] transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Discovery</span>
              </Link>
              <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gs-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Campaign Dashboard</h1>
                  <p className="text-xs text-slate-500 hidden sm:block">Manage your crowdfunding campaigns</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              </Button>
              <Link href="/">
                <Button size="sm" className="gs-gradient text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm">
            <TabsTrigger value="overview" className="rounded-lg">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="rounded-lg">
              <Target className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-[#0F7377] to-[#00A884] text-white border-0">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white/80">Total Raised</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">${(dashboardStats.totalRaised / 1000).toFixed(1)}K</span>
                    <DollarSign className="h-8 w-8 opacity-80" />
                  </div>
                  <p className="text-sm text-white/70 mt-2">+12% from last week</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white/80">Active Campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{dashboardStats.activeCampaigns}</span>
                    <Target className="h-8 w-8 opacity-80" />
                  </div>
                  <p className="text-sm text-white/70 mt-2">Running smoothly</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white/80">Total Backers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{dashboardStats.totalBackers}</span>
                    <Users className="h-8 w-8 opacity-80" />
                  </div>
                  <p className="text-sm text-white/70 mt-2">+28 this week</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white/80">Avg Conversion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{dashboardStats.avgConversion}%</span>
                    <TrendingUp className="h-8 w-8 opacity-80" />
                  </div>
                  <p className="text-sm text-white/70 mt-2">Above industry avg</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Campaigns & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Campaigns */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Campaigns</CardTitle>
                    <Link href="#" onClick={() => setActiveTab("campaigns")}>
                      <Button variant="ghost" size="sm">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userCampaigns.slice(0, 3).map(campaign => {
                    const fundingPercent = Math.round((campaign.raised / campaign.goal) * 100)
                    return (
                      <div key={campaign.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                              {campaign.title}
                            </h4>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                            <span>${campaign.raised.toLocaleString()} raised</span>
                            <span>{campaign.backers} backers</span>
                            <span>{campaign.daysLeft} days left</span>
                          </div>
                          <Progress value={Math.min(fundingPercent, 100)} className="h-2" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-3" />
                      Create Campaign
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-3" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-3" />
                    Respond to Comments
                    <Badge className="ml-auto bg-red-500 text-white">3</Badge>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-3" />
                    Share Campaign
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#0F7377]" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: Users, color: "text-emerald-500", title: "New backer", message: "John D. backed EcoTech with $149", time: "2 hours ago" },
                    { icon: MessageCircle, color: "text-blue-500", title: "New comment", message: "Sarah commented on your project update", time: "4 hours ago" },
                    { icon: Target, color: "text-amber-500", title: "Milestone reached", message: "EcoTech reached 65% funding", time: "8 hours ago" },
                    { icon: Heart, color: "text-red-500", title: "Project liked", message: "Your project was saved by 12 users today", time: "1 day ago" }
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">{activity.title}</p>
                        <p className="text-sm text-slate-500">{activity.message}</p>
                      </div>
                      <span className="text-xs text-slate-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="funded">Funded</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campaign Cards */}
            <div className="grid gap-6">
              {filteredCampaigns.map(campaign => {
                const fundingPercent = Math.round((campaign.raised / campaign.goal) * 100)
                return (
                  <Card key={campaign.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                        <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
                        {campaign.featured && (
                          <Badge className="absolute top-3 left-3 gs-gradient text-white">Featured</Badge>
                        )}
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {campaign.title}
                              </h3>
                              <Badge className={getStatusColor(campaign.status)}>
                                {campaign.status}
                              </Badge>
                            </div>
                            <p className="text-slate-500">{campaign.shortDescription}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-[#0F7377]">{fundingPercent}%</div>
                            <div className="text-xs text-slate-500">Funded</div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                              ${(campaign.raised / 1000).toFixed(1)}K
                            </div>
                            <div className="text-xs text-slate-500">Raised</div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                              {campaign.backers}
                            </div>
                            <div className="text-xs text-slate-500">Backers</div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                            <div className={`text-2xl font-bold ${campaign.daysLeft <= 7 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                              {campaign.daysLeft}
                            </div>
                            <div className="text-xs text-slate-500">Days Left</div>
                          </div>
                        </div>

                        <Progress value={Math.min(fundingPercent, 100)} className="h-2 mb-4" />

                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/campaign/${campaign.id}`}>
                            <Button size="sm" className="gs-gradient text-white">
                              <Eye className="h-4 w-4 mr-2" />
                              View Campaign
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Comments
                            <Badge className="ml-2 bg-red-500 text-white text-xs">
                              {campaign.pendingComments}
                            </Badge>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-2" />
                            Messages
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Campaign Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Compare your campaigns side by side</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userCampaigns.map(campaign => {
                      const fundingPercent = Math.round((campaign.raised / campaign.goal) * 100)
                      return (
                        <div key={campaign.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{campaign.title}</span>
                            <span className="text-sm text-[#0F7377] font-bold">{fundingPercent}%</span>
                          </div>
                          <Progress value={Math.min(fundingPercent, 100)} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your backers come from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { source: "Direct", visits: 1250, percentage: 35, color: "bg-[#0F7377]" },
                      { source: "Social Media", visits: 890, percentage: 25, color: "bg-blue-500" },
                      { source: "Search", visits: 710, percentage: 20, color: "bg-purple-500" },
                      { source: "Referral", visits: 530, percentage: 15, color: "bg-amber-500" },
                      { source: "Email", visits: 180, percentage: 5, color: "bg-slate-500" }
                    ].map(source => (
                      <div key={source.source} className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${source.color}`} />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{source.source}</span>
                            <span className="text-slate-500">{source.visits} visits</span>
                          </div>
                          <Progress value={source.percentage} className="h-1.5" />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{source.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed KPIs */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Detailed KPIs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[
                      { label: "Total Views", value: "12.5K", change: "+15%" },
                      { label: "Unique Visitors", value: "8.2K", change: "+12%" },
                      { label: "Avg. Time on Page", value: "3:42", change: "+8%" },
                      { label: "Bounce Rate", value: "32%", change: "-5%" },
                      { label: "Comments", value: "156", change: "+22%" },
                      { label: "Shares", value: "89", change: "+18%" }
                    ].map(kpi => (
                      <div key={kpi.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</div>
                        <div className="text-xs text-slate-500 mt-1">{kpi.label}</div>
                        <div className={`text-xs font-medium mt-1 ${kpi.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                          {kpi.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Notifications</CardTitle>
                  <Button variant="ghost" size="sm">Mark all as read</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                      notification.read ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'backer' ? 'bg-emerald-100 text-emerald-600' :
                      notification.type === 'milestone' ? 'bg-amber-100 text-amber-600' :
                      notification.type === 'comment' ? 'bg-blue-100 text-blue-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {notification.type === 'backer' && <Users className="h-4 w-4" />}
                      {notification.type === 'milestone' && <Target className="h-4 w-4" />}
                      {notification.type === 'comment' && <MessageCircle className="h-4 w-4" />}
                      {notification.type === 'update' && <Bell className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{notification.title}</h4>
                        {notification.urgent && (
                          <Badge className="bg-red-500 text-white text-xs">Urgent</Badge>
                        )}
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{notification.message}</p>
                      <span className="text-xs text-slate-400 mt-1">{notification.time}</span>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "New backers", description: "Get notified when someone backs your project", enabled: true },
                  { label: "Comments & replies", description: "Receive notifications for new comments", enabled: true },
                  { label: "Funding milestones", description: "Celebrate when you hit funding goals", enabled: true },
                  { label: "Campaign reminders", description: "Get reminders about your campaign timeline", enabled: false },
                  { label: "Weekly digest", description: "Receive a weekly summary of your campaigns", enabled: true }
                ].map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">{setting.label}</h4>
                      <p className="text-sm text-slate-500">{setting.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={setting.enabled}
                      className="h-5 w-5 rounded text-[#0F7377] focus:ring-[#0F7377]"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Display Name
                    </label>
                    <Input defaultValue="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Email
                    </label>
                    <Input defaultValue="john@example.com" type="email" />
                  </div>
                </div>
                <Button className="gs-gradient text-white">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

