"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Notification } from "@/types"
import {
  Rocket,
  Activity,
  BarChart3,
  Calculator,
  Plus,
  Menu,
  X,
  LayoutDashboard,
  Bell,
  Compass,
  Briefcase,
  ChevronUp,
  Flame,
  Star,
  DollarSign,
  MessageCircle,
  Target,
  FileText,
  Info,
  Check,
  CheckCheck,
  Trash2,
  Sun,
  Moon
} from "lucide-react"

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  isSection?: boolean
}

const navItems: NavItem[] = [
  { id: 'discover', label: 'Discover', icon: Compass, href: '/' },
  { id: 'trending', label: 'Trending', icon: Flame, isSection: true },
  { id: 'featured', label: 'Featured', icon: Star, isSection: true },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'campaigns', label: 'Campaigns', icon: Briefcase, href: '/dashboard?tab=campaigns' },
]

const notificationIcons: Record<Notification['type'], React.ElementType> = {
  backer: DollarSign,
  comment: MessageCircle,
  milestone: Target,
  update: FileText,
  system: Info
}

const notificationColors: Record<Notification['type'], string> = {
  backer: 'bg-green-100 text-green-600',
  comment: 'bg-blue-100 text-blue-600',
  milestone: 'bg-purple-100 text-purple-600',
  update: 'bg-orange-100 text-orange-600',
  system: 'bg-slate-100 text-slate-600'
}

interface HeaderProps {
  liveFunding: boolean
  onToggleLiveFunding: () => void
  onShowAnalytics: () => void
  onShowCalculator: () => void
  onCreateProject: () => void
  notifications?: Notification[]
  onMarkNotificationAsRead?: (id: string) => void
  onMarkAllNotificationsAsRead?: () => void
  onDeleteNotification?: (id: string) => void
}

export function Header({
  liveFunding,
  onToggleLiveFunding,
  onShowAnalytics,
  onShowCalculator,
  onCreateProject,
  notifications = [],
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onDeleteNotification
}: HeaderProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('discover')
  const [showNotifications, setShowNotifications] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Dark mode effect
  useEffect(() => {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100)

      const sections = ['trending', 'featured', 'all-projects']
      const viewportMiddle = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element && element.offsetTop <= viewportMiddle) {
          setActiveSection(sections[i] === 'all-projects' ? 'discover' : sections[i])
          return
        }
      }
      setActiveSection('discover')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsMobileMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = (item: NavItem) => {
    if (item.isSection) {
      scrollToSection(item.id)
    }
    setIsMobileMenuOpen(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Notification Dropdown Component
  const NotificationDropdown = ({ className = "" }: { className?: string }) => (
    <div 
      ref={notificationRef}
      className={`absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl dark:shadow-black/30 border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Notifications</span>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white text-xs px-1.5 py-0">{unreadCount}</Badge>
          )}
        </div>
        {unreadCount > 0 && onMarkAllNotificationsAsRead && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMarkAllNotificationsAsRead()
            }}
            className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium flex items-center gap-1"
          >
            <CheckCheck className="h-3 w-3" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No notifications</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => {
            const Icon = notificationIcons[notification.type]
            const colorClass = notificationColors[notification.type]
            
            return (
              <div
                key={notification.id}
                className={`p-3 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                  !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm ${!notification.read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        {notification.projectTitle && (
                          <p className="text-xs text-teal-600 mt-1 font-medium">
                            {notification.projectTitle}
                          </p>
                        )}
                      </div>
                      {notification.urgent && (
                        <Badge variant="destructive" className="text-[10px] px-1 py-0">!</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-400">
                        {formatDate(notification.date)}
                      </span>
                      <div className="flex items-center gap-1">
                        {!notification.read && onMarkNotificationAsRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onMarkNotificationAsRead(notification.id)
                            }}
                            className="p-1 text-slate-400 hover:text-teal-600 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                        {onDeleteNotification && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteNotification(notification.id)
                            }}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="p-2 border-t border-slate-100 bg-slate-50">
          <button className="w-full py-2 text-sm text-teal-600 hover:text-teal-700 font-medium text-center">
            View all {notifications.length} notifications
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Initial Header - Static, scrolls with page */}
      <header className="relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 gs-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gs-gradient-text">
                  GrowthStarter
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">Launch your vision</p>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                onClick={onToggleLiveFunding}
                variant="outline"
                size="sm"
                className={`rounded-full backdrop-blur-md shadow-sm transition-all duration-200 ${
                  liveFunding 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700' 
                    : 'bg-white/90 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Activity className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Live</span>
                {liveFunding && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </Button>

              <Button
                onClick={onShowAnalytics}
                variant="outline"
                size="sm"
                className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="sm"
                className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                {isDarkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-slate-600" />}
              </Button>

              {/* Notification Bell - Initial Header */}
              <div className="relative">
                <Button
                  onClick={() => setShowNotifications(!showNotifications)}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 relative"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
                
                {showNotifications && !isVisible && <NotificationDropdown />}
              </div>

              <Button 
                onClick={onCreateProject}
                size="sm"
                className="gs-gradient hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-full"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Create Project</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Navigation - Shows after scroll */}
      {isVisible && (
        <>
          {/* Desktop Floating Nav */}
          <nav className="hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl dark:shadow-2xl dark:shadow-black/20 rounded-full px-3 py-1.5 border border-slate-200/50 dark:border-slate-700/50">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                
                if (item.href && !item.isSection) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        isActive 
                          ? 'gs-gradient text-white shadow-md' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className={isActive ? '' : 'hidden xl:inline'}>{item.label}</span>
                    </Link>
                  )
                }
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive 
                        ? 'gs-gradient text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className={isActive ? '' : 'hidden xl:inline'}>{item.label}</span>
                  </button>
                )
              })}
              
              <div className="w-px h-6 bg-slate-200" />
              
              {/* Action buttons in nav */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={onToggleLiveFunding}
                  className={`relative p-2 rounded-full transition-all ${
                    liveFunding 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  {liveFunding && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                </button>
                
                <button
                  onClick={onShowAnalytics}
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                
                <button
                  onClick={onShowCalculator}
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                >
                  <Calculator className="h-4 w-4" />
                </button>

                {/* Dark Mode Toggle - Floating Nav */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                >
                  {isDarkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4" />}
                </button>
                
                {/* Notification Bell - Floating Nav */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && isVisible && <NotificationDropdown className="mt-3" />}
                </div>
                
                <button
                  onClick={onCreateProject}
                  className="flex items-center gap-1.5 px-3 py-2 gs-gradient text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all ml-1"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden xl:inline">Create</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Tablet Floating Nav - Compact */}
          <nav className="hidden md:block lg:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md shadow-xl rounded-full px-3 py-1.5 border border-slate-200/50">
              {navItems.slice(0, 4).map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                
                return (
                  <button
                    key={item.id}
                    onClick={() => item.isSection ? handleNavClick(item) : null}
                    className={`p-2.5 rounded-full transition-all ${
                      isActive 
                        ? 'gs-gradient text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                )
              })}
              
              <div className="w-px h-6 bg-slate-200" />
              
              {/* Notification Bell - Tablet */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-full text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 text-white text-[7px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && <NotificationDropdown className="mt-3 -right-20" />}
              </div>
              
              <button
                onClick={onCreateProject}
                className="flex items-center gap-1 px-3 py-2 gs-gradient text-white rounded-full text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-14 h-14 gs-gradient text-white rounded-full shadow-xl flex items-center justify-center hover:opacity-90 transition-all"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute bottom-16 right-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {/* Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                
                if (item.href && !item.isSection) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-[#0F7377]/10 text-[#0F7377]' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                }
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-[#0F7377]/10 text-[#0F7377]' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                )
              })}
              
              {/* Divider */}
              <div className="my-2 border-t border-slate-200" />
              
              {/* Notifications - Mobile */}
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5" />
                  Notifications
                </div>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">{unreadCount}</Badge>
                )}
              </button>
              
              {/* Action Items */}
              <button 
                onClick={() => {
                  onToggleLiveFunding()
                  setIsMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  liveFunding ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Activity className="h-5 w-5" />
                Live Funding {liveFunding ? 'On' : 'Off'}
              </button>
              <button 
                onClick={() => {
                  onShowAnalytics()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <BarChart3 className="h-5 w-5" />
                Platform Analytics
              </button>
              <button 
                onClick={() => {
                  onShowCalculator()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Calculator className="h-5 w-5" />
                Funding Calculator
              </button>
              
              {/* Create Project */}
              <div className="p-2 pt-0">
                <button 
                  onClick={() => {
                    onCreateProject()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 gs-gradient text-white rounded-xl text-sm font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 left-4 w-12 h-12 bg-slate-800 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-slate-700 transition-all z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  )
}
