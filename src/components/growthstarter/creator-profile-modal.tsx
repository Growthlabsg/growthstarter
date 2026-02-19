"use client"

import { Project, Creator } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  MapPin,
  Calendar,
  Users,
  Trophy,
  Star,
  ExternalLink,
  Mail,
  Globe,
  Twitter,
  ShieldCheck,
  TrendingUp,
  Target,
  DollarSign
} from "lucide-react"
import Image from "next/image"

interface CreatorProfileModalProps {
  creator: Creator | null
  projects: Project[]
  isOpen: boolean
  onClose: () => void
  onProjectClick: (project: Project) => void
  onFollow?: (creatorId: string) => void
  isFollowing?: boolean
}

export function CreatorProfileModal({
  creator,
  projects,
  isOpen,
  onClose,
  onProjectClick,
  onFollow,
  isFollowing = false
}: CreatorProfileModalProps) {
  if (!creator) return null

  const creatorProjects = projects.filter(p => p.creator.id === creator.id)
  const successfulProjects = creatorProjects.filter(p => p.raised >= p.goal)
  const totalRaised = creatorProjects.reduce((sum, p) => sum + p.raised, 0)
  const totalBackers = creatorProjects.reduce((sum, p) => sum + p.backers, 0)
  const successRate = creatorProjects.length > 0 
    ? Math.round((successfulProjects.length / creatorProjects.length) * 100) 
    : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden" showCloseButton={false}>
        {/* Header with cover */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-6">
            <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-900 shadow-xl">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback className="text-2xl bg-teal-500 text-white">
                {creator.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-14 px-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {creator.name}
                </h2>
                {creator.verified && (
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4" />
                {creator.location}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={isFollowing ? "secondary" : "default"}
                className={!isFollowing ? "gs-gradient text-white" : ""}
                onClick={() => onFollow?.(creator.id)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            {creator.bio || "Creative entrepreneur passionate about bringing innovative ideas to life."}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <Target className="h-5 w-5 mx-auto mb-1 text-teal-600" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {creatorProjects.length}
              </div>
              <div className="text-xs text-slate-500">Projects</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                ${(totalRaised / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-slate-500">Total Raised</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <Users className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {totalBackers.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">Backers</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-amber-600" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {successRate}%
              </div>
              <div className="text-xs text-slate-500">Success Rate</div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {creator.verified && (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Verified Creator
              </Badge>
            )}
            {successRate >= 80 && (
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Trophy className="h-3 w-3 mr-1" />
                Top Creator
              </Badge>
            )}
            {creatorProjects.length >= 3 && (
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <Star className="h-3 w-3 mr-1" />
                Experienced
              </Badge>
            )}
          </div>
        </div>

        {/* Projects Tabs */}
        <div className="px-6 pb-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="all" className="py-2 text-sm">
                All Projects ({creatorProjects.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="py-2 text-sm">
                Active ({creatorProjects.filter(p => p.status === 'active').length})
              </TabsTrigger>
              <TabsTrigger value="funded" className="py-2 text-sm">
                Funded ({successfulProjects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 max-h-60 overflow-y-auto space-y-3">
              {creatorProjects.map((project) => (
                <ProjectRow key={project.id} project={project} onClick={() => onProjectClick(project)} />
              ))}
              {creatorProjects.length === 0 && (
                <p className="text-center text-slate-500 py-8">No projects yet</p>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-4 max-h-60 overflow-y-auto space-y-3">
              {creatorProjects.filter(p => p.status === 'active').map((project) => (
                <ProjectRow key={project.id} project={project} onClick={() => onProjectClick(project)} />
              ))}
            </TabsContent>

            <TabsContent value="funded" className="mt-4 max-h-60 overflow-y-auto space-y-3">
              {successfulProjects.map((project) => (
                <ProjectRow key={project.id} project={project} onClick={() => onProjectClick(project)} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProjectRow({ project, onClick }: { project: Project; onClick: () => void }) {
  const fundingPercent = Math.round((project.raised / project.goal) * 100)
  const isFunded = project.raised >= project.goal

  return (
    <div
      onClick={onClick}
      className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">
              {project.title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-[10px] h-5">
                {project.category}
              </Badge>
              {isFunded && (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] h-5">
                  Funded
                </Badge>
              )}
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-teal-600 dark:text-teal-400 font-medium">
              ${project.raised.toLocaleString()} raised
            </span>
            <span className="text-slate-500">
              {fundingPercent}%
            </span>
          </div>
          <Progress value={Math.min(fundingPercent, 100)} className="h-1" />
        </div>
      </div>
    </div>
  )
}

