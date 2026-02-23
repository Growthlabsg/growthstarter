/**
 * Floating header for the Community section – pill bar only, no static top bar.
 * Same design language as DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCommunityNotifications } from "@/hooks/use-community-notifications"
import {
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Menu,
  X,
  Users,
  FolderOpen,
  Plus,
  TrendingUp,
  Wrench,
  Star,
  ChevronUp,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { CommunityNotificationPreferencesDialog } from "@/components/community/community-notification-preferences-dialog"
import { getTotalUnreadDMCount } from "@/data/direct-messages-storage"

type DropdownItem = {
  label: string
  href: string
  icon: typeof FolderOpen
  highlight?: boolean
}
const communityDropdownItems: DropdownItem[] = [
  { label: "Browse Directory", href: "/community/browse", icon: FolderOpen },
  { label: "My Communities", href: "/community/my", icon: Users },
  { label: "Messages", href: "/community/direct", icon: MessageCircle },
  { label: "Trending", href: "/community/trending", icon: TrendingUp },
  { label: "For You", href: "/community/for-you", icon: Star },
  { label: "For Builders", href: "/community/builders", icon: Wrench },
  { label: "Create New Community", href: "/community/create", icon: Plus, highlight: true },
]

const communityNavItems = [
  { id: "browse", label: "Browse Directory", href: "/community/browse" },
  { id: "my", label: "My Communities", href: "/community/my" },
  { id: "direct", label: "Messages", href: "/community/direct" },
  { id: "trending", label: "Trending", href: "/community/trending" },
  { id: "for-you", label: "For You", href: "/community/for-you" },
]

function formatNotificationTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffM = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffM < 1) return "Just now"
  if (diffM < 60) return `${diffM}m ago`
  if (diffH < 24) return `${diffH}h ago`
  if (diffD === 1) return "Yesterday"
  if (diffD < 7) return `${diffD} days ago`
  return d.toLocaleDateString()
}

export interface FloatingHeaderCommunityProps {
  toggleTheme?: () => void
  onCreateCommunity?: () => void
  unreadCount?: number
  showScrollToTop?: boolean
}

export function FloatingHeaderCommunity({
  toggleTheme,
  onCreateCommunity,
  unreadCount: unreadCountProp,
  showScrollToTop = true,
}: FloatingHeaderCommunityProps) {
  const pathname = usePathname()
  const { notifications, unreadCount: unreadFromHook, markAsRead } = useCommunityNotifications()
  const unreadCount = unreadCountProp ?? unreadFromHook
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [notificationPrefsOpen, setNotificationPrefsOpen] = useState(false)
  const [dmUnreadCount, setDmUnreadCount] = useState(0)
  useEffect(() => {
    setDmUnreadCount(getTotalUnreadDMCount())
    const onUpdate = () => setDmUnreadCount(getTotalUnreadDMCount())
    window.addEventListener("community-dm-updated", onUpdate)
    return () => window.removeEventListener("community-dm-updated", onUpdate)
  }, [])

  const handleToggleTheme = toggleTheme ?? (() => {
    document.documentElement.classList.toggle("dark")
    const isDark = document.documentElement.classList.contains("dark")
    localStorage.setItem("theme", isDark ? "dark" : "light")
  })

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    if (saved === "dark" || (!saved && prefersDark)) document.documentElement.classList.add("dark")
  }, [])

  useEffect(() => {
    const handleScroll = () => setShowScrollBtn(window.scrollY > 300)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const isActive = (href: string) => pathname === href || (href !== "/community/browse" && pathname?.startsWith(href))

  const mobilePageTitle =
    pathname === "/community/browse"
      ? "Browse"
      : pathname === "/community/my"
        ? "My Communities"
        : pathname === "/community/direct"
          ? "Messages"
          : pathname === "/community/trending"
            ? "Trending"
            : pathname === "/community/for-you"
              ? "For You"
              : pathname?.startsWith("/community/")
                ? "Community"
                : "Community"

  return (
    <>
      {/* Mobile: fixed top bar (app-style) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 safe-area-inset-top pt-[env(safe-area-inset-top)]">
        <div className="h-14 flex items-center justify-between px-4 gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-semibold text-slate-900 dark:text-white text-base truncate flex-1 text-center">
            {mobilePageTitle}
          </h1>
          <div className="w-10 h-10 flex items-center justify-end">
            {unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          aria-hidden
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-[min(280px,85vw)] bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-700 animate-in slide-in-from-left duration-200 overflow-y-auto safe-area-inset-left pt-[env(safe-area-inset-top)]">
          <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-900 dark:text-white">Menu</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="p-3 space-y-1">
            {communityDropdownItems.filter((d) => !d.highlight).map((d) => {
              const Icon = d.icon
              return (
                <Link
                  key={d.href}
                  href={d.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium min-h-[48px]",
                    isActive(d.href)
                      ? "bg-[#0F7377]/10 text-[#0F7377] dark:bg-teal-500/20 dark:text-teal-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {d.label}
                </Link>
              )
            })}
            <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
            <Link
              href="/community/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium min-h-[48px] gs-gradient text-white"
            >
              <Plus className="h-5 w-5" />
              Create Community
            </Link>
            <button
              type="button"
              onClick={() => setNotificationPrefsOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium min-h-[48px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell className="h-5 w-5" />
              Notifications
            </button>
            <button
              type="button"
              onClick={handleToggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium min-h-[48px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
              Theme
            </button>
          </nav>
        </div>
      )}

      {/* Mobile: bottom nav bar (app-style) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50 safe-area-inset-bottom pb-[env(safe-area-inset-bottom)]"
        aria-label="Community navigation"
      >
        <div className="h-16 flex items-center justify-around px-2">
          <Link
            href="/community/browse"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[48px] rounded-lg text-xs font-medium",
              isActive("/community/browse")
                ? "text-[#0F7377] dark:text-teal-400"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            <FolderOpen className="h-5 w-5 shrink-0" />
            <span>Browse</span>
          </Link>
          <Link
            href="/community/my"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[48px] rounded-lg text-xs font-medium",
              isActive("/community/my")
                ? "text-[#0F7377] dark:text-teal-400"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            <Users className="h-5 w-5 shrink-0" />
            <span>My</span>
          </Link>
          <Link
            href="/community/create"
            className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[48px] rounded-full gs-gradient text-white shadow-lg -mt-4"
          >
            <Plus className="h-6 w-6 shrink-0" />
            <span className="text-[10px] font-medium">Create</span>
          </Link>
          <Link
            href="/community/direct"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[48px] rounded-lg text-xs font-medium relative",
              isActive("/community/direct")
                ? "text-[#0F7377] dark:text-teal-400"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            <MessageCircle className="h-5 w-5 shrink-0" />
            <span>Messages</span>
            {dmUnreadCount > 0 && (
              <span className="absolute top-1 right-1/4 min-w-[16px] h-[16px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {dmUnreadCount > 99 ? "99+" : dmUnreadCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[48px] rounded-lg text-xs font-medium",
              "text-slate-500 dark:text-slate-400"
            )}
          >
            <Menu className="h-5 w-5 shrink-0" />
            <span>More</span>
          </button>
        </div>
      </nav>

      <nav
        className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in duration-300 max-w-[95vw]"
        role="navigation"
        aria-label="Community"
      >
        <div className="flex items-center flex-nowrap gap-0.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl dark:shadow-2xl dark:shadow-black/20 rounded-full pl-2 pr-1.5 py-1 border border-slate-200/50 dark:border-slate-700/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
                  pathname?.startsWith("/community")
                    ? "gs-gradient text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
                )}
                aria-label="Community menu"
              >
                <Users className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Community</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 rounded-xl">
              {communityDropdownItems.filter((d) => !d.highlight).map((d) => {
                const Icon = d.icon
                return (
                  <DropdownMenuItem key={d.href} asChild>
                    <Link href={d.href} className="flex items-center gap-2 cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                      <Icon className="h-4 w-4" />
                      {d.label}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
              {communityDropdownItems.some((d) => d.highlight) && (
                <>
                  <div className="my-1 h-px bg-slate-200 dark:bg-slate-700" />
                  {communityDropdownItems.filter((d) => d.highlight).map((d) => {
                    const Icon = d.icon
                    return (
                      <DropdownMenuItem key={d.href} asChild>
                        <Link href={d.href} className="flex items-center gap-2 cursor-pointer font-medium text-[#0F7377] dark:text-teal-400" onClick={() => setMobileMenuOpen(false)}>
                          <Icon className="h-4 w-4" />
                          {d.label}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {communityNavItems.map((item) => {
            const active = isActive(item.href)
            const showDmBadge = item.id === "direct" && dmUnreadCount > 0
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all shrink-0 whitespace-nowrap relative",
                  active
                    ? "gs-gradient text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
                )}
              >
                {item.label}
                {showDmBadge && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                    {dmUnreadCount > 99 ? "99+" : dmUnreadCount}
                  </span>
                )}
              </Link>
            )
          })}

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 shrink-0 mx-0.5" />

          {onCreateCommunity ? (
            <Button
              size="sm"
              title="Create a new community"
              className="flex items-center gap-1 px-2.5 py-1.5 gs-gradient text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all shrink-0 whitespace-nowrap"
              onClick={onCreateCommunity}
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Create</span>
            </Button>
          ) : (
            <Button size="sm" title="Create a new community" className="flex items-center gap-1 px-2.5 py-1.5 gs-gradient text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all shrink-0 whitespace-nowrap" asChild>
              <Link href="/community/create">
                <Plus className="h-4 w-4 shrink-0" />
                <span>Create</span>
              </Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 transition-all shrink-0"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl p-0">
              <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">No notifications yet.</p>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <Link
                      key={n.id}
                      href={n.communitySlug ? `/community/${n.communitySlug}` : "/community"}
                      onClick={() => markAsRead(n.id)}
                      className={cn(
                        "block w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col gap-0.5",
                        !n.read && "bg-slate-50/50 dark:bg-slate-800/30"
                      )}
                    >
                      <span className={cn("text-sm", !n.read ? "font-medium text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>
                        {n.title}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{n.message}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{formatNotificationTime(n.createdAt)}</span>
                    </Link>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setNotificationPrefsOpen(true)}
                  className="block w-full text-center text-sm font-medium text-[#0F7377] dark:text-teal-400 hover:underline py-1"
                >
                  Notification preferences
                </button>
                <Link
                  href="/community"
                  className="block text-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:underline py-1"
                >
                  View all notifications
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={handleToggleTheme}
            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 transition-all shrink-0"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </button>
        </div>
      </nav>

      {showScrollToTop && showScrollBtn && !mobileMenuOpen && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed left-4 bottom-28 md:bottom-4 z-30 w-12 h-12 bg-slate-800 dark:bg-slate-700 text-white rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-all animate-in fade-in duration-200"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      <CommunityNotificationPreferencesDialog
        open={notificationPrefsOpen}
        onOpenChange={setNotificationPrefsOpen}
      />
    </>
  )
}
