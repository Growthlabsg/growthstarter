"use client"

import { useState, useEffect } from "react"
import { Project } from "@/types"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { SocialProof } from "./social-proof"
import { CommentsSection } from "./comments-section"
import {
  X,
  Heart,
  Share2,
  Bookmark,
  Play,
  MapPin,
  Star,
  Flame,
  ShieldCheck,
  Users,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Bell,
  CheckCircle,
  AlertTriangle,
  Gift,
  Target,
  Zap,
  Award,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Sparkles,
  DollarSign,
  BarChart3,
  Trophy
} from "lucide-react"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProjectDetailModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  isBookmarked: boolean
  isLiked: boolean
  onBookmark: (projectId: string) => void
  onLike: (projectId: string) => void
  onShare: (project: Project) => void
  onBackProject: (project: Project, rewardIndex?: number) => void
  onCreatorClick?: (creatorId: string) => void
  allProjects?: Project[]
}

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  isBookmarked,
  isLiked,
  onBookmark,
  onLike,
  onShare,
  onBackProject,
  onCreatorClick,
  allProjects = []
}: ProjectDetailModalProps) {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [pledgeAmount, setPledgeAmount] = useState("")
  const [selectedReward, setSelectedReward] = useState<number | null>(null)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [liveViewers, setLiveViewers] = useState(0)
  const [recentPledge, setRecentPledge] = useState<{name: string, amount: number} | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Simulate live activity
  useEffect(() => {
    if (!project || !isOpen) return
    
    setLiveViewers(Math.floor(Math.random() * 50) + 20)
    
    const viewerInterval = setInterval(() => {
      setLiveViewers(prev => Math.max(10, prev + Math.floor(Math.random() * 5) - 2))
    }, 5000)

    const pledgeInterval = setInterval(() => {
      const names = ["Alex M.", "Sarah T.", "Mike R.", "Emma L.", "John D."]
      const amounts = [25, 50, 75, 100, 150, 200]
      setRecentPledge({
        name: names[Math.floor(Math.random() * names.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)]
      })
      setTimeout(() => setRecentPledge(null), 4000)
    }, 15000)

    return () => {
      clearInterval(viewerInterval)
      clearInterval(pledgeInterval)
    }
  }, [project, isOpen])

  if (!project) return null

  const fundingPercentage = Math.round((project.raised / project.goal) * 100)
  const currentRaised = project.liveStats?.currentRaised || project.raised
  const currentBackers = project.liveStats?.currentBackers || project.backers
  const avgPledge = Math.round(currentRaised / Math.max(currentBackers, 1))

  // Similar projects for recommendations
  const similarProjects = allProjects
    .filter(p => p.id !== project.id && p.category === project.category)
    .slice(0, 3)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://growthstarter.com/project/${project.id}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.gallery.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!max-w-6xl !w-[95vw] h-[90vh] p-0 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden"
        showCloseButton={false}
      >
        {/* Live Activity Toast */}
        {recentPledge && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
            <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">{recentPledge.name} just backed ${recentPledge.amount}</span>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col lg:flex-row h-full w-full">
          {/* Left Panel - Media & Details */}
          <div className="lg:w-3/5 h-full overflow-y-auto scrollbar-thin">
            {/* Hero Image/Gallery */}
            <div className="relative">
              <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                <Image
                  src={project.gallery[currentImageIndex] || project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Gallery Navigation */}
                {project.gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-slate-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-slate-700" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {project.gallery.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? 'bg-white w-6'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Video Play Button */}
                {project.video && (
                  <button className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 rounded-full text-sm font-medium text-slate-700 hover:bg-white transition-colors">
                    <Play className="h-4 w-4" />
                    Watch Video
                  </button>
                )}

                {/* Badges */}
                <div className="absolute top-4 right-16 flex gap-2">
                  {project.featured && (
                    <Badge className="gs-gradient text-white border-0 shadow-lg">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {project.trending && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                      <Flame className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>

                {/* Live Viewers Badge */}
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-red-500/90 text-white border-0 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                    {liveViewers} watching
                  </Badge>
                </div>

                {/* Funding Progress Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Thumbnail Strip */}
              {project.gallery.length > 1 && (
                <div className="flex gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 overflow-x-auto">
                  {project.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                        idx === currentImageIndex
                          ? 'ring-2 ring-[#0F7377] scale-105'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats Bar */}
            <div className="flex items-center justify-around py-3 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {project.socialProof?.likes || 0}
                </span>
              </div>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {project.socialProof?.shares || 0} shares
                </span>
              </div>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {project.comments?.length || 0} comments
                </span>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="p-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="w-full justify-start bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6 overflow-x-auto">
                  <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="story" className="rounded-lg">Story</TabsTrigger>
                  <TabsTrigger value="updates" className="rounded-lg">
                    Updates
                    {project.updates.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {project.updates.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="rounded-lg">Comments</TabsTrigger>
                  <TabsTrigger value="faq" className="rounded-lg">FAQ</TabsTrigger>
                  <TabsTrigger value="risks" className="rounded-lg">Risks</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Social Proof Section */}
                  <SocialProof project={project} variant="full" />

                  {/* Key Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 rounded-xl p-4 text-center border border-teal-200 dark:border-teal-800">
                      <DollarSign className="h-5 w-5 mx-auto text-teal-600 mb-1" />
                      <div className="text-lg font-bold text-slate-900 dark:text-white">${avgPledge}</div>
                      <div className="text-xs text-slate-500">Avg. Pledge</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4 text-center border border-purple-200 dark:border-purple-800">
                      <Trophy className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{project.rewards.length}</div>
                      <div className="text-xs text-slate-500">Reward Tiers</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-4 text-center border border-amber-200 dark:border-amber-800">
                      <BarChart3 className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{fundingPercentage}%</div>
                      <div className="text-xs text-slate-500">Funded</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-800">
                      <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{project.creator.projectsCreated || 1}</div>
                      <div className="text-xs text-slate-500">Creator Projects</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      About this project
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Team */}
                  {project.team.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Meet the Team
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {project.team.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                          >
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {member.name}
                              </p>
                              <p className="text-sm text-slate-500">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  {project.timeline.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Project Timeline
                      </h3>
                      <div className="space-y-3">
                        {project.timeline.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 mt-2 rounded-full bg-[#0F7377]" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {item.month}
                              </p>
                              <p className="text-sm text-slate-500">{item.activity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stretch Goals */}
                  {project.stretchGoals.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        <Target className="h-5 w-5 inline mr-2 text-[#0F7377]" />
                        Stretch Goals
                      </h3>
                      <div className="space-y-3">
                        {project.stretchGoals.map((goal) => (
                          <div
                            key={goal.id}
                            className={`p-4 rounded-xl border ${
                              goal.unlocked
                                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {goal.title}
                              </span>
                              <Badge variant={goal.unlocked ? "default" : "secondary"}>
                                ${goal.amount.toLocaleString()}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {goal.description}
                            </p>
                            {goal.unlocked && (
                              <div className="flex items-center gap-1 mt-2 text-emerald-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Unlocked!</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                {/* Similar Projects */}
                  {similarProjects.length > 0 && (
                    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        You Might Also Like
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {similarProjects.map((p) => (
                          <div key={p.id} className="group cursor-pointer">
                            <div className="relative h-24 rounded-lg overflow-hidden mb-2">
                              <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              <div className="absolute bottom-1 left-1">
                                <Badge className="text-[10px] bg-black/50 text-white">{Math.round((p.raised / p.goal) * 100)}%</Badge>
                              </div>
                            </div>
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-teal-600">{p.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="story" className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {project.story}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="updates" className="space-y-4">
                  {project.updates.length > 0 ? (
                    project.updates.map((update) => (
                      <div
                        key={update.id}
                        className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
                      >
                        {update.pinned && (
                          <Badge className="mb-2 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                            📌 Pinned
                          </Badge>
                        )}
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {update.title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">{update.date}</p>
                        <p className="text-slate-600 dark:text-slate-400 mt-3">
                          {update.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" /> {update.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" /> {update.comments}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No updates yet. Stay tuned!</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="comments" className="space-y-4">
                  <CommentsSection project={project} />
                </TabsContent>

                <TabsContent value="faq" className="space-y-4">
                  {project.faq.length > 0 ? (
                    project.faq.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
                      >
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {item.question}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                          {item.answer}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No FAQs available yet.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="risks" className="space-y-4">
                  <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                          Risks & Challenges
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          Every crowdfunding project comes with risks. Here&apos;s what the creator has identified:
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {project.risks.map((risk, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <span className="text-amber-500">•</span>
                        <span className="text-slate-600 dark:text-slate-400">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Panel - Pledge Section */}
          <div className="lg:w-2/5 border-l border-slate-200 dark:border-slate-700 h-full overflow-y-auto scrollbar-thin bg-slate-50 dark:bg-slate-800/50">
            <div className="p-6 space-y-6">
              {/* Title & Creator */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {project.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {project.shortDescription}
                </p>
                
                {/* Creator */}
                <div 
                  className="flex items-center gap-3 mt-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-100 dark:border-slate-700"
                  onClick={() => onCreatorClick?.(project.creator.id)}
                >
                  <Avatar className="h-12 w-12 ring-2 ring-teal-500/20">
                    <AvatarImage src={project.creator.avatar} alt={project.creator.name} />
                    <AvatarFallback className="bg-teal-500 text-white">{project.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {project.creator.name}
                      </span>
                      {project.creator.verified && (
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span>{project.creator.projectsCreated || 1} projects</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs border-teal-200 text-teal-600 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-950">
                    Follow
                  </Button>
                </div>
              </div>

              {/* Funding Stats */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                        ${currentRaised.toLocaleString()}
                      </span>
                      <span className="text-slate-500 ml-2">
                        of ${project.goal.toLocaleString()} goal
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {fundingPercentage}%
                      </span>
                      {fundingPercentage >= 100 && (
                        <Badge className="ml-2 bg-emerald-500 text-white">Funded!</Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={Math.min(fundingPercentage, 100)} className="h-3 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 rounded-xl border border-teal-100 dark:border-teal-900">
                    <Users className="h-6 w-6 mx-auto text-teal-600 mb-1" />
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {currentBackers.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">Backers</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl border border-orange-100 dark:border-orange-900">
                    <Clock className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                    <div className={`text-2xl font-bold ${project.daysLeft <= 7 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                      {project.daysLeft}
                    </div>
                    <div className="text-xs text-slate-500">Days Left</div>
                  </div>
                </div>

                {/* Live Stats */}
                {project.liveStats && (
                  <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="font-medium">Live Stats</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div>
                        <span className="text-slate-500">Views today:</span>
                        <span className="ml-1 font-medium text-slate-700 dark:text-slate-300">
                          {project.liveStats.viewsToday?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Conversion:</span>
                        <span className="ml-1 font-medium text-slate-700 dark:text-slate-300">
                          {project.liveStats.conversionRate?.toFixed(1) || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => onLike(project.id)}
                        variant="outline"
                        size="icon"
                        className={isLiked ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-950/30 dark:border-red-800' : ''}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Like</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  onClick={() => onBookmark(project.id)}
                  variant="outline"
                  className={`flex-1 ${isBookmarked ? 'bg-teal-50 border-teal-200 text-teal-600 dark:bg-teal-950/30 dark:border-teal-800' : ''}`}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>
                
                <div className="relative">
                  <Button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  
                  {/* Share Menu Dropdown */}
                  {showShareMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                      <button 
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        {copiedLink ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        {copiedLink ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <Twitter className="h-4 w-4 text-sky-500" />
                        Twitter
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        Facebook
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <Linkedin className="h-4 w-4 text-blue-700" />
                        LinkedIn
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <Mail className="h-4 w-4 text-slate-500" />
                        Email
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Rewards */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-[#0F7377]" />
                  Select a Reward
                </h3>
                
                {/* Custom Pledge */}
                <div className="mb-4 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Pledge without a reward
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={pledgeAmount}
                        onChange={(e) => setPledgeAmount(e.target.value)}
                        className="pl-7"
                        min={project.minimumPledge}
                      />
                    </div>
                    <Button
                      className="gs-gradient text-white"
                      onClick={() => onBackProject(project)}
                      disabled={!pledgeAmount || parseInt(pledgeAmount) < project.minimumPledge}
                    >
                      Pledge
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Minimum ${project.minimumPledge}
                  </p>
                </div>

                {/* Reward Tiers */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                  {project.rewards.map((reward, idx) => {
                    const isPopular = reward.claimedCount && reward.claimedCount > 50
                    const isLimitedEdition = reward.limited && reward.limitCount && (reward.limitCount - (reward.claimedCount || 0)) < 10
                    
                    return (
                      <div
                        key={reward.id}
                        onClick={() => setSelectedReward(idx)}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                          selectedReward === idx
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30 shadow-lg'
                            : 'border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {/* Popular/Limited badges */}
                        <div className="absolute -top-2 -right-2 flex gap-1">
                          {isPopular && (
                            <Badge className="bg-orange-500 text-white text-[10px] shadow-lg">
                              🔥 Popular
                            </Badge>
                          )}
                          {isLimitedEdition && (
                            <Badge className="bg-red-500 text-white text-[10px] shadow-lg">
                              Almost gone!
                            </Badge>
                          )}
                        </div>

                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                            ${reward.amount}
                          </span>
                          {reward.limited && (
                            <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700">
                              {reward.limitCount! - (reward.claimedCount || 0)} of {reward.limitCount} left
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {reward.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {reward.description}
                        </p>
                        
                        {/* Reward includes */}
                        {reward.includes && reward.includes.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {reward.includes.slice(0, 3).map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                <CheckCircle className="h-3 w-3 text-emerald-500" />
                                {item}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                          {reward.estimatedDelivery && (
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Est. {reward.estimatedDelivery}
                            </p>
                          )}
                          <p className="text-xs text-slate-500">
                            {reward.claimedCount || 0} backers
                          </p>
                        </div>
                        
                        {selectedReward === idx && (
                          <Button
                            className="w-full mt-3 gs-gradient text-white shadow-lg"
                            onClick={() => onBackProject(project, idx)}
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Select This Reward
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Trust Signals */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-around text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Money-back</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-emerald-500" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

