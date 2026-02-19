"use client"

import { Project } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShareDropdown } from "./share-dropdown"
import {
  Heart,
  Bookmark,
  Play,
  MapPin,
  Star,
  Flame,
  ShieldCheck,
  ThumbsUp,
  Clock
} from "lucide-react"
import Image from "next/image"

interface ProjectCardProps {
  project: Project
  viewMode: "grid" | "list"
  isBookmarked: boolean
  isLiked: boolean
  liveFunding: boolean
  onProjectClick: (project: Project) => void
  onBookmark: (projectId: string) => void
  onLike: (projectId: string) => void
  onShare: (project: Project) => void
  onBackProject: (project: Project) => void
}

export function ProjectCard({
  project,
  viewMode,
  isBookmarked,
  isLiked,
  liveFunding,
  onProjectClick,
  onBookmark,
  onLike,
  onShare,
  onBackProject
}: ProjectCardProps) {
  const fundingPercentage = Math.round((project.raised / project.goal) * 100)
  const currentRaised = project.liveStats?.currentRaised || project.raised
  const currentBackers = project.liveStats?.currentBackers || project.backers

  return (
    <Card 
      className={`group gs-card-hover border-0 shadow-lg rounded-2xl overflow-hidden cursor-pointer bg-card ${
        viewMode === "list" ? "flex flex-col sm:flex-row" : ""
      }`} 
      onClick={() => onProjectClick(project)}
    >
      {/* Image Section */}
      <div className={`relative ${viewMode === "list" ? "sm:w-72 sm:flex-shrink-0" : ""}`}>
        <div className="relative overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            width={400}
            height={250}
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
              viewMode === "list" ? "w-full h-48 sm:w-72 sm:h-full" : "w-full h-52"
            }`}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        
        {/* Status Badges - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {project.featured && (
            <Badge className="gs-gradient text-white shadow-lg border-0">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {project.trending && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg border-0">
              <Flame className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
          {liveFunding && (
            <Badge className="bg-emerald-500 text-white shadow-lg border-0 animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-ping" />
              LIVE
            </Badge>
          )}
        </div>
        
        {/* Action Buttons - Top Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {project.verified && (
            <div className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onBookmark(project.id)
            }}
            className={`p-2 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm ${
              isBookmarked
                ? 'bg-[#0F7377] text-white'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-[#0F7377] hover:text-white'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* Video Play Button */}
        {project.video && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Handle video play
            }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200">
              <Play className="h-6 w-6 text-[#0F7377] ml-1" />
            </div>
          </button>
        )}

        {/* Funding Progress Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-white">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-bold text-lg">${currentRaised.toLocaleString()}</span>
              <span className="font-semibold">{Math.min(fundingPercentage, 999)}%</span>
            </div>
            <Progress 
              value={Math.min(fundingPercentage, 100)} 
              className="h-2 bg-white/30"
            />
            {liveFunding && project.liveStats && (
              <div className="flex justify-between text-xs mt-1.5 text-emerald-300">
                <span>+{project.liveStats.hourlyBackers} backers/hr</span>
                <span>Score: {project.liveStats.trendingScore}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className={`flex flex-col ${viewMode === "list" ? "sm:flex-1" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0F7377] transition-colors line-clamp-1">
                {project.title}
              </CardTitle>
              <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {project.shortDescription}
              </CardDescription>
            </div>
          </div>
          
          {/* Creator Info */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 border-2 border-white shadow-sm">
                <AvatarImage src={project.creator.avatar} alt={project.creator.name} />
                <AvatarFallback className="text-xs bg-[#0F7377] text-white">
                  {project.creator.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                by <span className="font-medium text-slate-800 dark:text-slate-200">{project.creator.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{project.location}</span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.slice(0, viewMode === "list" ? 4 : 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {tag}
              </Badge>
            ))}
            {project.tags.length > (viewMode === "list" ? 4 : 3) && (
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500"
              >
                +{project.tags.length - (viewMode === "list" ? 4 : 3)}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 mt-auto">
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-center py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <div className="text-lg font-bold text-[#0F7377] dark:text-[#00A884]">
                  {Math.min(fundingPercentage, 999)}%
                </div>
                <div className="text-xs text-slate-500">Funded</div>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentBackers.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">Backers</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${project.daysLeft <= 7 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                  {project.daysLeft}
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                  {project.daysLeft <= 7 && <Clock className="h-3 w-3 text-red-500" />}
                  Days Left
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                className="flex-1 gs-gradient hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-10"
                onClick={(e) => {
                  e.stopPropagation()
                  onBackProject(project)
                }}
              >
                <Heart className="h-4 w-4 mr-2" />
                Back Project
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onLike(project.id)
                }}
                className={`h-10 w-10 transition-colors ${
                  isLiked
                    ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-950 dark:border-red-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <ShareDropdown project={project} variant="button" className="h-10" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

