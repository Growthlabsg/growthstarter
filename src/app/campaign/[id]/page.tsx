"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Share2,
  Heart,
  Bookmark,
  Play,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Star,
  Flame,
  ShieldCheck,
  MessageCircle,
  Bell,
  Gift,
  Target,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Send,
  ExternalLink,
  Mail,
  Search,
  Filter,
  MoreVertical,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"
import { mockProjects } from "@/data/mock-projects"
import { Backer } from "@/types"

// Mock backers data
const mockBackers: Backer[] = [
  {
    id: "b1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    location: "New York, USA",
    pledgeAmount: 149,
    rewardTitle: "Standard Pack",
    pledgeDate: "2024-01-15",
    status: "active",
    fulfillmentStatus: "pending",
    isFirstTime: true
  },
  {
    id: "b2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    location: "London, UK",
    pledgeAmount: 499,
    rewardTitle: "Ultimate Bundle",
    pledgeDate: "2024-01-14",
    status: "active",
    fulfillmentStatus: "shipped",
    trackingNumber: "TRK123456789"
  },
  {
    id: "b3",
    name: "Mike Chen",
    email: "mike@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    location: "Singapore",
    pledgeAmount: 79,
    rewardTitle: "Standard Pack",
    pledgeDate: "2024-01-13",
    status: "active",
    fulfillmentStatus: "delivered"
  },
  {
    id: "b4",
    name: "Anonymous",
    email: "anon@example.com",
    avatar: "",
    pledgeAmount: 29,
    rewardTitle: "Early Bird",
    pledgeDate: "2024-01-12",
    status: "active",
    fulfillmentStatus: "pending",
    isAnonymous: true
  },
  {
    id: "b5",
    name: "Emma Thompson",
    email: "emma@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    location: "Sydney, Australia",
    pledgeAmount: 149,
    rewardTitle: "Home Kit",
    pledgeDate: "2024-01-11",
    status: "active",
    fulfillmentStatus: "processing"
  }
]

// Mock comments
const mockComments = [
  {
    id: "c1",
    author: "John Doe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "This project looks amazing! Can't wait to receive my reward. Quick question - will there be any additional color options available?",
    date: "2024-01-15",
    likes: 12,
    isBacker: true,
    pledgeAmount: 149,
    replies: [
      {
        id: "r1",
        author: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        content: "Thanks for backing! Yes, we're planning to add 3 new colors if we hit our stretch goal!",
        date: "2024-01-15",
        likes: 8,
        isCreator: true
      }
    ]
  },
  {
    id: "c2",
    author: "Tech Enthusiast",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    content: "Backed! Really impressed with the team's transparency and the detailed FAQ section. Keep up the great work! 🚀",
    date: "2024-01-14",
    likes: 23,
    isBacker: true,
    pledgeAmount: 499
  }
]

// Mock updates
const mockUpdates = [
  {
    id: "u1",
    title: "🎉 We hit 65% of our funding goal!",
    content: "Thank you so much to all our incredible backers! We've just crossed 65% of our funding goal, and we couldn't be more grateful. We have some exciting news to share about our first stretch goal...",
    date: "January 15, 2024",
    likes: 45,
    comments: 12,
    pinned: true
  },
  {
    id: "u2",
    title: "Manufacturing update & timeline",
    content: "We've finalized our manufacturing partnership and are on track for our estimated delivery date. Here's a behind-the-scenes look at our production facility...",
    date: "January 10, 2024",
    likes: 32,
    comments: 8
  }
]

export default function CampaignPage() {
  const params = useParams()
  const projectId = params.id as string

  // Find the project
  const project = mockProjects.find(p => p.id === projectId) || mockProjects[0]

  // State
  const [activeTab, setActiveTab] = useState("overview")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [backerSearch, setBackerSearch] = useState("")
  const [backerFilter, setBackerFilter] = useState("all")

  // Calculations
  const fundingPercentage = Math.round((project.raised / project.goal) * 100)

  // Filter backers
  const filteredBackers = mockBackers.filter(backer => {
    const matchesSearch = backer.name.toLowerCase().includes(backerSearch.toLowerCase()) ||
                         backer.email.toLowerCase().includes(backerSearch.toLowerCase())
    const matchesFilter = backerFilter === "all" || backer.fulfillmentStatus === backerFilter
    return matchesSearch && matchesFilter
  })

  const getFulfillmentBadge = (status: string) => {
    switch (status) {
      case "pending": return { color: "bg-amber-100 text-amber-700", icon: Clock }
      case "processing": return { color: "bg-blue-100 text-blue-700", icon: Package }
      case "shipped": return { color: "bg-purple-100 text-purple-700", icon: Truck }
      case "delivered": return { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle }
      case "cancelled": return { color: "bg-red-100 text-red-700", icon: XCircle }
      default: return { color: "bg-slate-100 text-slate-700", icon: AlertTriangle }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="gs-glass border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-[#0F7377] transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "bg-[#0F7377]/10 border-[#0F7377] text-[#0F7377]" : ""}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" className="gs-gradient text-white">
                <Heart className="h-4 w-4 mr-2" />
                Back Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-64 md:h-96 relative overflow-hidden">
          <Image
            src={project.gallery[currentImageIndex] || project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          
          {/* Gallery Navigation */}
          {project.gallery.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev => (prev - 1 + project.gallery.length) % project.gallery.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => (prev + 1) % project.gallery.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {project.featured && (
              <Badge className="gs-gradient text-white border-0">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {project.trending && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                <Flame className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>

          {/* Video Button */}
          {project.video && (
            <button className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full shadow-lg hover:bg-white">
              <Play className="h-4 w-4 text-[#0F7377]" />
              Watch Video
            </button>
          )}

          {/* Project Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h1>
              <p className="text-white/80 text-lg mb-4">{project.shortDescription}</p>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={project.creator.avatar} />
                    <AvatarFallback>{project.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{project.creator.name}</span>
                  {project.creator.verified && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                </div>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Stats Bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0F7377]">
                ${project.raised.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500">
                pledged of ${project.goal.toLocaleString()} goal
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {project.backers}
              </div>
              <div className="text-sm text-slate-500">backers</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${project.daysLeft <= 7 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                {project.daysLeft}
              </div>
              <div className="text-sm text-slate-500">days to go</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-500">
                {fundingPercentage}%
              </div>
              <div className="text-sm text-slate-500">funded</div>
            </div>
          </div>
          <Progress value={Math.min(fundingPercentage, 100)} className="h-3" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm mb-8">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="updates" className="rounded-lg">
              Updates
              <Badge className="ml-2" variant="secondary">{mockUpdates.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded-lg">
              Comments
              <Badge className="ml-2" variant="secondary">{mockComments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="backers" className="rounded-lg">
              Backers
              <Badge className="ml-2" variant="secondary">{mockBackers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-lg">Rewards</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About This Project</CardTitle>
                  </CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">Our Story</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {project.story}
                    </p>
                  </CardContent>
                </Card>

                {/* Team */}
                <Card>
                  <CardHeader>
                    <CardTitle>Meet the Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.team.map(member => (
                        <div key={member.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">{member.name}</h4>
                            <p className="text-sm text-[#0F7377]">{member.role}</p>
                            {member.bio && <p className="text-xs text-slate-500 mt-1">{member.bio}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.timeline.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="w-3 h-3 mt-1.5 rounded-full bg-[#0F7377] flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">{item.month}</h4>
                            <p className="text-sm text-slate-500">{item.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Creator Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Creator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={project.creator.avatar} />
                        <AvatarFallback>{project.creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{project.creator.name}</span>
                          {project.creator.verified && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                        </div>
                        <p className="text-sm text-slate-500">{project.creator.projectsCount} projects</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center mb-4">
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                        <div className="font-bold text-[#0F7377]">${(project.creator.totalRaised / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-slate-500">Total Raised</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                        <div className="font-bold text-slate-900 dark:text-white">{project.creator.successRate}%</div>
                        <div className="text-xs text-slate-500">Success Rate</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Creator
                    </Button>
                  </CardContent>
                </Card>

                {/* FAQ */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">FAQ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.faq.slice(0, 3).map(item => (
                      <div key={item.id}>
                        <h4 className="font-medium text-slate-900 dark:text-white text-sm">{item.question}</h4>
                        <p className="text-sm text-slate-500 mt-1">{item.answer}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Stretch Goals */}
                {project.stretchGoals.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4 text-[#0F7377]" />
                        Stretch Goals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {project.stretchGoals.map(goal => (
                        <div
                          key={goal.id}
                          className={`p-3 rounded-lg border ${
                            goal.unlocked
                              ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800'
                              : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{goal.title}</span>
                            <Badge variant={goal.unlocked ? "default" : "secondary"} className="text-xs">
                              ${goal.amount.toLocaleString()}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">{goal.description}</p>
                          {goal.unlocked && (
                            <div className="flex items-center gap-1 mt-2 text-emerald-600 text-xs">
                              <CheckCircle className="h-3 w-3" />
                              Unlocked!
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            {mockUpdates.map(update => (
              <Card key={update.id}>
                <CardHeader>
                  {update.pinned && (
                    <Badge className="w-fit mb-2 bg-amber-100 text-amber-700">📌 Pinned</Badge>
                  )}
                  <CardTitle>{update.title}</CardTitle>
                  <CardDescription>{update.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400">{update.content}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                    <button className="flex items-center gap-1 hover:text-[#0F7377]">
                      <ThumbsUp className="h-4 w-4" /> {update.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#0F7377]">
                      <MessageCircle className="h-4 w-4" /> {update.comments}
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#0F7377]">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-6">
            {/* New Comment */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts or ask a question..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-3"
                    />
                    <Button className="gs-gradient text-white">
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            {mockComments.map(comment => (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback>{comment.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comment.author}</span>
                        {comment.isBacker && (
                          <Badge variant="secondary" className="text-xs">
                            Backer · ${comment.pledgeAmount}
                          </Badge>
                        )}
                        <span className="text-sm text-slate-500">{comment.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                        <button className="flex items-center gap-1 hover:text-[#0F7377]">
                          <ThumbsUp className="h-4 w-4" /> {comment.likes}
                        </button>
                        <button className="hover:text-[#0F7377]">Reply</button>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-4">
                          {comment.replies.map((reply: { id: string; author: string; avatar: string; content: string; date: string; likes: number; isCreator?: boolean }) => (
                            <div key={reply.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={reply.avatar} />
                                <AvatarFallback>{reply.author[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">{reply.author}</span>
                                  {reply.isCreator && (
                                    <Badge className="text-xs gs-gradient text-white">Creator</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Backers Tab */}
          <TabsContent value="backers" className="space-y-6">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search backers..."
                  value={backerSearch}
                  onChange={(e) => setBackerSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={backerFilter} onValueChange={setBackerFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Backers</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{mockBackers.length}</div>
                  <div className="text-sm text-slate-500">Total Backers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-amber-500">
                    {mockBackers.filter(b => b.fulfillmentStatus === 'pending').length}
                  </div>
                  <div className="text-sm text-slate-500">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {mockBackers.filter(b => b.fulfillmentStatus === 'shipped').length}
                  </div>
                  <div className="text-sm text-slate-500">Shipped</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-emerald-500">
                    {mockBackers.filter(b => b.fulfillmentStatus === 'delivered').length}
                  </div>
                  <div className="text-sm text-slate-500">Delivered</div>
                </CardContent>
              </Card>
            </div>

            {/* Backers List */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {filteredBackers.map(backer => {
                    const badge = getFulfillmentBadge(backer.fulfillmentStatus)
                    const BadgeIcon = badge.icon
                    return (
                      <div
                        key={backer.id}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            {!backer.isAnonymous && <AvatarImage src={backer.avatar} />}
                            <AvatarFallback>
                              {backer.isAnonymous ? '?' : backer.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {backer.isAnonymous ? 'Anonymous Backer' : backer.name}
                              </span>
                              {backer.isFirstTime && (
                                <Badge variant="secondary" className="text-xs">First backer!</Badge>
                              )}
                            </div>
                            <div className="text-sm text-slate-500">
                              ${backer.pledgeAmount} · {backer.rewardTitle} · {backer.pledgeDate}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={badge.color}>
                            <BadgeIcon className="h-3 w-3 mr-1" />
                            {backer.fulfillmentStatus}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.rewards.map((reward, idx) => (
                <Card key={reward.id} className="relative overflow-hidden">
                  {reward.limited && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 text-xs font-medium">
                      Limited
                    </div>
                  )}
                  <CardHeader>
                    <div className="text-3xl font-bold text-[#0F7377]">${reward.amount}</div>
                    <CardTitle>{reward.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">{reward.description}</p>
                    
                    {reward.limited && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Claimed</span>
                          <span className="font-medium">{reward.claimedCount || 0} / {reward.limitCount}</span>
                        </div>
                        <Progress 
                          value={((reward.claimedCount || 0) / (reward.limitCount || 1)) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}

                    {reward.estimatedDelivery && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        Est. delivery: {reward.estimatedDelivery}
                      </div>
                    )}

                    <Button className="w-full gs-gradient text-white">
                      <Gift className="h-4 w-4 mr-2" />
                      Select Reward
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

