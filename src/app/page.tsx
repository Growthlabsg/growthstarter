"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Toaster, toast } from "sonner"
import { useTheme } from "next-themes"
import { Project, SortOption, FilterOption, ProjectFormData, Notification, Reward } from "@/types"
import { mockProjects } from "@/data/mock-projects"
import { Header } from "@/components/growthstarter/header"
import { SearchFilters } from "@/components/growthstarter/search-filters"
import { ProjectCard } from "@/components/growthstarter/project-card"
import { ProjectDetailModal } from "@/components/growthstarter/project-detail-modal"
import { CreateProjectModal } from "@/components/growthstarter/create-project-modal"
import { PledgeModal } from "@/components/growthstarter/pledge-modal"
import { generateMockNotifications } from "@/components/growthstarter/notification-center"
import { SearchAutocomplete } from "@/components/growthstarter/search-autocomplete"
import { QuickFilters } from "@/components/growthstarter/quick-filters"
import { RecentlyViewed } from "@/components/growthstarter/recently-viewed"
import { ScrollProgress } from "@/components/growthstarter/scroll-progress"
import { KeyboardShortcutsDialog, useKeyboardShortcuts } from "@/components/growthstarter/keyboard-shortcuts"
import { ProjectComparison, ComparisonBar } from "@/components/growthstarter/project-comparison"
import { MilestoneCelebration, useMilestoneTracker } from "@/components/growthstarter/milestone-celebration"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  RefreshCw,
  Search,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Calculator,
  Star,
  Zap,
  Award,
  Clock,
  ArrowUpRight,
  Sparkles,
  Heart,
  Scale
} from "lucide-react"

export default function GrowthStarterPage() {
  const { theme, setTheme } = useTheme()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // State management
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("trending")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [displayedCount, setDisplayedCount] = useState(9)
  
  // UI State
  const [liveFunding, setLiveFunding] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showPledgeModal, setShowPledgeModal] = useState(false)
  const [bookmarkedProjects, setBookmarkedProjects] = useState<string[]>([])
  const [likedProjects, setLikedProjects] = useState<string[]>([])
  const [fundingUpdates, setFundingUpdates] = useState<{ id: number; project: string; amount: number; backer: string }[]>([])
  const [notifications, setNotifications] = useState<Notification[]>(generateMockNotifications())
  const [pledgeProject, setPledgeProject] = useState<Project | null>(null)

  // New feature states
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [recentlyViewedProjects, setRecentlyViewedProjects] = useState<Project[]>([])
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false)
  const [comparisonProjects, setComparisonProjects] = useState<Project[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Calculator state
  const [calcGoal, setCalcGoal] = useState("")
  const [calcDuration, setCalcDuration] = useState("")

  // Milestone tracker
  const { currentCelebration, closeCelebration } = useMilestoneTracker(projects)

  // Live funding simulation
  useEffect(() => {
    if (liveFunding) {
      const interval = setInterval(() => {
        const randomProject = projects[Math.floor(Math.random() * projects.length)]
        const amount = Math.floor(Math.random() * 500) + 25
        const backer = `Backer #${Math.floor(Math.random() * 10000)}`
        
        const update = {
          id: Date.now(),
          project: randomProject.title,
          amount,
          backer
        }
        setFundingUpdates(prev => [update, ...prev.slice(0, 4)])
        
        // Update project stats
        setProjects(prev => prev.map(p => {
          if (p.id === randomProject.id) {
            const newRaised = (p.liveStats?.currentRaised || p.raised) + amount
            return {
              ...p,
              raised: newRaised,
              backers: p.backers + 1,
              liveStats: p.liveStats ? {
                ...p.liveStats,
                currentRaised: newRaised,
                currentBackers: p.liveStats.currentBackers + 1
              } : undefined
            }
          }
          return p
        }))

        toast.success(`New Backer!`, {
          description: `${backer} pledged $${amount} to ${randomProject.title}`,
          icon: <Heart className="h-4 w-4 text-red-500" />
        })
      }, 8000)
      
      return () => clearInterval(interval)
    }
  }, [liveFunding, projects])

  // Filtering and sorting logic
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.shortDescription.toLowerCase().includes(term) ||
        p.tags.some(tag => tag.toLowerCase().includes(term)) ||
        p.creator.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      )
    }

    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory)
    }

    if (filterBy !== "all") {
      switch (filterBy) {
        case "trending":
          result = result.filter(p => p.trending)
          break
        case "featured":
          result = result.filter(p => p.featured)
          break
        case "ending-soon":
          result = result.filter(p => p.daysLeft <= 7)
          break
        case "highly-funded":
          result = result.filter(p => (p.raised / p.goal) >= 0.8)
          break
        case "new":
          result = result.filter(p => p.daysLeft >= 25)
          break
      }
    }

    result = result.filter(p => p.goal >= priceRange[0] && p.goal <= priceRange[1])

    result.sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return (b.liveStats?.trendingScore || b.backers) - (a.liveStats?.trendingScore || a.backers)
        case "newest":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case "ending-soon":
          return a.daysLeft - b.daysLeft
        case "most-funded":
          return b.raised - a.raised
        case "most-backers":
          return b.backers - a.backers
        case "goal-low":
          return a.goal - b.goal
        case "goal-high":
          return b.goal - a.goal
        default:
          return 0
      }
    })

    return result
  }, [projects, searchTerm, selectedCategory, sortBy, filterBy, priceRange])

  const displayedProjects = filteredAndSortedProjects.slice(0, displayedCount)
  const trendingProjects = projects.filter(p => p.trending).slice(0, 3)
  const featuredProjects = projects.filter(p => p.featured && !p.trending).slice(0, 3)
  const endingSoonProjects = projects.filter(p => p.daysLeft <= 7).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 3)

  const activeFiltersCount = [
    selectedCategory !== "all",
    filterBy !== "all",
    searchTerm !== "",
    priceRange[0] !== 0 || priceRange[1] !== 1000000
  ].filter(Boolean).length

  // Handlers
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }

  const handleBookmark = (projectId: string) => {
    const isBookmarked = bookmarkedProjects.includes(projectId)
    setBookmarkedProjects(prev =>
      isBookmarked ? prev.filter(id => id !== projectId) : [...prev, projectId]
    )
    const project = projects.find(p => p.id === projectId)
    if (project) {
      toast(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks", {
        description: project.title,
        icon: isBookmarked ? "🗑️" : "🔖"
      })
    }
  }

  const handleLike = (projectId: string) => {
    const isLiked = likedProjects.includes(projectId)
    setLikedProjects(prev =>
      isLiked ? prev.filter(id => id !== projectId) : [...prev, projectId]
    )
    if (!isLiked) toast("You liked this project! ❤️")
  }

  const handleShare = async (project: Project) => {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/project/${project.id}`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: project.title, text: project.shortDescription, url: shareUrl })
        toast.success("Shared successfully!")
      } catch { /* User cancelled */ }
    } else if (typeof navigator !== 'undefined') {
      await navigator.clipboard.writeText(`${project.title} - ${shareUrl}`)
      toast.success("Link copied to clipboard!")
    }
  }

  const handleBackProject = (project: Project) => {
    setPledgeProject(project)
    setShowPledgeModal(true)
    setShowProjectModal(false)
  }

  const handlePledge = (amount: number, reward?: Reward) => {
    if (!pledgeProject) return
    setProjects(prev => prev.map(p => {
      if (p.id === pledgeProject.id) {
        return { ...p, raised: p.raised + amount, backers: p.backers + 1 }
      }
      return p
    }))
    const newNotification: Notification = {
      id: `n_${Date.now()}`,
      type: "backer",
      title: "Pledge confirmed!",
      message: `Your $${amount} pledge to ${pledgeProject.title} was successful`,
      date: new Date().toISOString(),
      read: false,
      urgent: false,
      projectId: pledgeProject.id,
      projectTitle: pledgeProject.title
    }
    setNotifications(prev => [newNotification, ...prev])
    toast.success("Thank you for your support! 🎉", {
      description: `You pledged $${amount} to ${pledgeProject.title}`
    })
  }

  const handleCreateProject = (data: ProjectFormData) => {
    toast.success("Project submitted for review!", {
      description: "We'll review your project and get back to you within 24 hours."
    })
    setShowCreateModal(false)
  }

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast("All notifications marked as read")
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setFilterBy("all")
    setPriceRange([0, 1000000])
    toast("Filters cleared")
  }

  // New feature handlers
  const addRecentSearch = (term: string) => {
    if (term && !recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev.slice(0, 4)])
    }
  }

  const handleProjectView = (project: Project) => {
    setSelectedProject(project)
    setShowProjectModal(true)
    // Add to recently viewed
    setRecentlyViewedProjects(prev => {
      const filtered = prev.filter(p => p.id !== project.id)
      return [project, ...filtered].slice(0, 10)
    })
  }

  const removeFromRecentlyViewed = (projectId: string) => {
    setRecentlyViewedProjects(prev => prev.filter(p => p.id !== projectId))
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewedProjects([])
    toast("Recently viewed cleared")
  }

  const toggleProjectComparison = (project: Project) => {
    setComparisonProjects(prev => {
      const exists = prev.find(p => p.id === project.id)
      if (exists) {
        return prev.filter(p => p.id !== project.id)
      }
      if (prev.length >= 4) {
        toast.error("Maximum 4 projects for comparison")
        return prev
      }
      return [...prev, project]
    })
  }

  const removeFromComparison = (projectId: string) => {
    setComparisonProjects(prev => prev.filter(p => p.id !== projectId))
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => searchInputRef.current?.focus(),
    onGoHome: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    onGoTrending: () => scrollToSection('trending'),
    onToggleDarkMode: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    onCreateProject: () => setShowCreateModal(true),
    onOpenNotifications: () => setShowNotifications(prev => !prev),
    onOpenAnalytics: () => setShowAnalytics(true),
    onShowShortcuts: () => setShowShortcutsDialog(true)
  })

  // Project counts for quick filters
  const projectCounts = useMemo(() => ({
    trending: projects.filter(p => p.trending).length,
    featured: projects.filter(p => p.featured).length,
    endingSoon: projects.filter(p => p.daysLeft <= 7).length,
    new: projects.filter(p => {
      const startDate = new Date(p.startDate)
      const now = new Date()
      const diffDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    }).length,
    highlyFunded: projects.filter(p => (p.raised / p.goal) >= 0.8).length
  }), [projects])

  const calculateProjections = () => {
    const goal = parseFloat(calcGoal) || 0
    const duration = parseFloat(calcDuration) || 30
    return {
      dailyTarget: Math.round(goal / duration),
      weeklyTarget: Math.round((goal / duration) * 7),
      backersNeeded: Math.round(goal / 75),
      successProbability: Math.min(95, Math.max(20, 80 - (goal / 10000)))
    }
  }

  const projections = calculateProjections()

  const platformStats = useMemo(() => ({
    totalRaised: projects.reduce((sum, p) => sum + p.raised, 0),
    totalBackers: projects.reduce((sum, p) => sum + p.backers, 0),
    activeProjects: projects.filter(p => p.status === "active").length,
    successRate: 89,
    avgFunding: Math.round(projects.reduce((sum, p) => sum + (p.raised / p.goal), 0) / projects.length * 100)
  }), [projects])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <ScrollProgress />
      <Toaster position="top-right" richColors closeButton />

      <Header
        liveFunding={liveFunding}
        onToggleLiveFunding={() => {
          setLiveFunding(!liveFunding)
          toast(liveFunding ? "Live updates paused" : "Live updates enabled", {
            icon: liveFunding ? "⏸️" : "🔴"
          })
        }}
        onShowAnalytics={() => setShowAnalytics(true)}
        onShowCalculator={() => setShowCalculator(true)}
        onCreateProject={() => setShowCreateModal(true)}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onDeleteNotification={handleDeleteNotification}
      />

      {liveFunding && fundingUpdates.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 px-4 animate-in slide-in-from-top">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" /> Live Activity
              </span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">{fundingUpdates[0]?.backer}</span> just backed{" "}
              <span className="font-semibold">{fundingUpdates[0]?.project.slice(0, 25)}...</span> with{" "}
              <span className="font-semibold text-emerald-100">${fundingUpdates[0]?.amount}</span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search with Autocomplete */}
        <div className="mb-4">
          <SearchAutocomplete
            projects={projects}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onProjectSelect={handleProjectView}
            recentSearches={recentSearches}
            onAddRecentSearch={addRecentSearch}
          />
        </div>

        {/* Quick Filters */}
        <div className="mb-6">
          <QuickFilters
            activeFilter={filterBy}
            onFilterChange={setFilterBy}
            projectCounts={projectCounts}
          />
        </div>

        {/* Recently Viewed */}
        {recentlyViewedProjects.length > 0 && (
          <RecentlyViewed
            projects={recentlyViewedProjects}
            onProjectClick={handleProjectView}
            onRemoveProject={removeFromRecentlyViewed}
            onClearAll={clearRecentlyViewed}
          />
        )}

        {/* Search & Filters */}
        <div className="mb-8">
          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Ending Soon Alert */}
        {endingSoonProjects.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 rounded-xl p-4 mb-8 border border-orange-200/50 dark:border-orange-800/30">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="font-semibold text-orange-800 dark:text-orange-300">Ending Soon!</span>
              <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700">
                {endingSoonProjects.length} projects
              </Badge>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {endingSoonProjects.map(project => (
                <button
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-3 min-w-[280px] hover:shadow-md dark:hover:shadow-black/30 transition-shadow text-left border border-transparent dark:border-slate-700"
                >
                  <img src={project.image} alt={project.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{project.title}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-600 dark:text-red-400 font-semibold">{project.daysLeft} days left</span>
                      <span className="text-slate-400 dark:text-slate-500">•</span>
                      <span className="text-slate-500 dark:text-slate-400">{Math.round((project.raised / project.goal) * 100)}% funded</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Section */}
        <section id="trending" className="mb-12 scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trending Now</h2>
                <p className="text-sm text-slate-500">Hot projects gaining momentum</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-teal-600" onClick={() => setFilterBy("trending")}>
              View all <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode="grid"
                isBookmarked={bookmarkedProjects.includes(project.id)}
                isLiked={likedProjects.includes(project.id)}
                liveFunding={liveFunding}
                onProjectClick={handleProjectView}
                onBookmark={handleBookmark}
                onLike={handleLike}
                onShare={handleShare}
                onBackProject={handleBackProject}
              />
            ))}
          </div>
        </section>

        {/* Featured Section */}
        <section id="featured" className="mb-12 scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gs-gradient rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Hand-picked by our team</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-teal-600" onClick={() => setFilterBy("featured")}>
              View all <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode="grid"
                isBookmarked={bookmarkedProjects.includes(project.id)}
                isLiked={likedProjects.includes(project.id)}
                liveFunding={liveFunding}
                onProjectClick={handleProjectView}
                onBookmark={handleBookmark}
                onLike={handleLike}
                onShare={handleShare}
                onBackProject={handleBackProject}
              />
            ))}
          </div>
        </section>

        {/* All Projects Section */}
        <section id="all-projects" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Projects</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {displayedProjects.length} of {filteredAndSortedProjects.length} projects
                </p>
              </div>
            </div>
          </div>

          {displayedProjects.length > 0 ? (
            <>
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {displayedProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    viewMode={viewMode}
                    isBookmarked={bookmarkedProjects.includes(project.id)}
                    isLiked={likedProjects.includes(project.id)}
                    liveFunding={liveFunding}
                    onProjectClick={handleProjectView}
                    onBookmark={handleBookmark}
                    onLike={handleLike}
                    onShare={handleShare}
                    onBackProject={handleBackProject}
                  />
                ))}
              </div>

              {displayedCount < filteredAndSortedProjects.length && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setDisplayedCount(prev => prev + 6)}
                    className="px-8 py-6 rounded-xl border-teal-600 text-teal-600 hover:bg-teal-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Load More ({filteredAndSortedProjects.length - displayedCount} remaining)
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 gs-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No projects found</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Try adjusting your search criteria or browse all categories
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={clearFilters} className="gs-gradient text-white">
                  <RefreshCw className="h-4 w-4 mr-2" /> Reset Filters
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Create Your Project
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        isBookmarked={selectedProject ? bookmarkedProjects.includes(selectedProject.id) : false}
        isLiked={selectedProject ? likedProjects.includes(selectedProject.id) : false}
        onBookmark={handleBookmark}
        onLike={handleLike}
        onShare={handleShare}
        onBackProject={handleBackProject}
      />

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={handleCreateProject}
      />

      <PledgeModal
        project={pledgeProject}
        isOpen={showPledgeModal}
        onClose={() => { setShowPledgeModal(false); setPledgeProject(null) }}
        onPledge={handlePledge}
      />


      {/* Analytics Modal */}
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold gs-gradient-text flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Platform Analytics
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Raised", value: `$${(platformStats.totalRaised / 1000000).toFixed(2)}M`, icon: DollarSign, gradient: "from-teal-500 to-emerald-500" },
                { label: "Total Backers", value: platformStats.totalBackers.toLocaleString(), icon: Users, gradient: "from-blue-500 to-blue-600" },
                { label: "Active Projects", value: platformStats.activeProjects, icon: Target, gradient: "from-purple-500 to-purple-600" },
                { label: "Avg. Funding", value: `${platformStats.avgFunding}%`, icon: Award, gradient: "from-amber-500 to-orange-500" }
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-4 text-white`}>
                  <stat.icon className="h-6 w-6 mb-2 opacity-80" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Projects by Category</h4>
              <div className="space-y-3">
                {[
                  { name: "Technology", count: projects.filter(p => p.category === "technology").length },
                  { name: "Games", count: projects.filter(p => p.category === "games").length },
                  { name: "Health", count: projects.filter(p => p.category === "health").length }
                ].filter(c => c.count > 0).map(category => (
                  <div key={category.name} className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 w-24">{category.name}</span>
                    <div className="flex-1"><Progress value={(category.count / projects.length) * 100} className="h-2" /></div>
                    <span className="text-sm font-medium text-slate-900 w-12 text-right">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calculator Modal */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Calculator className="h-5 w-5 text-teal-600" /> Funding Calculator
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Funding Goal</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <Input type="number" value={calcGoal} onChange={(e) => setCalcGoal(e.target.value)} placeholder="50000" className="pl-7" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Campaign Duration (days)</label>
              <Input type="number" value={calcDuration} onChange={(e) => setCalcDuration(e.target.value)} placeholder="30" />
            </div>
            {calcGoal && calcDuration && (
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-slate-900">Projections</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500">Daily target:</span><div className="font-semibold text-slate-900">${projections.dailyTarget.toLocaleString()}</div></div>
                  <div><span className="text-slate-500">Weekly target:</span><div className="font-semibold text-slate-900">${projections.weeklyTarget.toLocaleString()}</div></div>
                  <div><span className="text-slate-500">Backers needed:</span><div className="font-semibold text-slate-900">~{projections.backersNeeded.toLocaleString()}</div></div>
                  <div><span className="text-slate-500">Success probability:</span><div className={`font-semibold ${projections.successProbability >= 60 ? 'text-emerald-600' : 'text-amber-600'}`}>{projections.successProbability.toFixed(0)}%</div></div>
                </div>
              </div>
            )}
            <Button onClick={() => { setShowCalculator(false); setShowCreateModal(true) }} className="w-full gs-gradient text-white">
              Start Your Campaign
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog 
        isOpen={showShortcutsDialog} 
        onClose={() => setShowShortcutsDialog(false)} 
      />

      {/* Project Comparison */}
      <ProjectComparison
        projects={comparisonProjects}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        onRemoveProject={removeFromComparison}
        onBackProject={(project) => {
          setShowComparison(false)
          handleBackProject(project)
        }}
      />

      {/* Comparison Bar */}
      <ComparisonBar
        selectedProjects={comparisonProjects}
        onOpenComparison={() => setShowComparison(true)}
        onClearSelection={() => setComparisonProjects([])}
      />

      {/* Milestone Celebration */}
      {currentCelebration && (
        <MilestoneCelebration
          project={currentCelebration.project}
          milestone={currentCelebration.milestone}
          isVisible={true}
          onClose={closeCelebration}
          onShare={handleShare}
        />
      )}

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-4 right-4 z-30 hidden lg:block">
        <button
          onClick={() => setShowShortcutsDialog(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-mono">?</kbd>
          <span>Shortcuts</span>
        </button>
      </div>
    </div>
  )
}
