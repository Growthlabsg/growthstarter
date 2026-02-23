/**
 * Floating header for Book a Space section – pill only, no static top bar.
 * DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md Section 2.3.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Tag,
  Gift,
  Dumbbell,
  Coffee,
  Calendar,
  Plus,
  ChevronUp,
  LayoutGrid,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type SpacesNavItem = { label: string; href: string; icon: typeof MapPin; highlight?: boolean }

const spacesDropdownItems: SpacesNavItem[] = [
  { label: "Explore Spaces", href: "/spaces/explore", icon: LayoutGrid },
  { label: "Startup Deals", href: "/spaces/deals", icon: Tag },
  { label: "Free Spaces", href: "/spaces/free", icon: Gift },
  { label: "Sports & Wellness", href: "/spaces/sports-wellness", icon: Dumbbell },
  { label: "Cafe Work Zones", href: "/spaces/cafe", icon: Coffee },
  { label: "My Bookings", href: "/spaces/my-bookings", icon: Calendar },
  { label: "List a Space", href: "/spaces/list", icon: Plus, highlight: true },
]

const mainNavItems = [
  { id: "feed", label: "Feed", href: "/" },
  { id: "network", label: "Network", href: "/community/browse" },
  { id: "community", label: "Community", href: "/community/browse" },
  { id: "events", label: "Events", href: "/community/browse" },
]

export interface FloatingHeaderSpacesProps {
  toggleTheme?: () => void
  unreadCount?: number
  showScrollToTop?: boolean
}

export function FloatingHeaderSpaces({
  toggleTheme,
  unreadCount = 0,
  showScrollToTop = true,
}: FloatingHeaderSpacesProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const handleToggleTheme =
    toggleTheme ??
    (() => {
      document.documentElement.classList.toggle("dark")
      const isDark = document.documentElement.classList.contains("dark")
      localStorage.setItem("theme", isDark ? "dark" : "light")
    })

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    if (saved === "dark" || (!saved && prefersDark)) document.documentElement.classList.add("dark")
  }, [])

  useEffect(() => {
    const handleScroll = () => setShowScrollBtn(window.scrollY > 300)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const isSpacesActive = pathname?.startsWith("/spaces")
  const isActive = (href: string) => pathname === href || (href !== "/spaces/explore" && pathname?.startsWith(href))

  return (
    <>
      {/* Mobile: FAB + sheet (no top bar per spec) */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-14 h-14 gs-gradient text-white rounded-full shadow-xl flex items-center justify-center hover:opacity-90 transition-all"
          aria-label="Spaces menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {mobileMenuOpen && (
          <div className="absolute bottom-16 right-0 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            <div className="p-2 max-h-[70vh] overflow-y-auto">
              <p className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Spaces
              </p>
              {spacesDropdownItems
                .filter((d) => !d.highlight)
                .map((d) => {
                  const Icon = d.icon
                  return (
                    <Link
                      key={d.href}
                      href={d.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive(d.href)
                          ? "bg-[#0F7377]/10 text-[#0F7377] dark:bg-teal-500/20 dark:text-teal-400"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {d.label}
                    </Link>
                  )
                })}
              <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
              <Link
                href="/spaces/list"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium gs-gradient text-white"
              >
                <Plus className="h-5 w-5" />
                List a Space
              </Link>
              <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
              <div className="flex items-center gap-2 px-4 py-2">
                <button
                  type="button"
                  onClick={handleToggleTheme}
                  className="flex items-center gap-3 py-2 text-slate-600 dark:text-slate-300 text-sm"
                >
                  <Sun className="h-5 w-5 dark:hidden" />
                  <Moon className="h-5 w-5 hidden dark:block" />
                  Theme
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: centred floating pill */}
      <nav
        className="hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in duration-300 max-w-[95vw]"
        role="navigation"
        aria-label="Spaces"
      >
        <div className="flex items-center flex-nowrap gap-0.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl dark:shadow-2xl dark:shadow-black/20 rounded-full pl-2 pr-1.5 py-1 border border-slate-200/50 dark:border-slate-700/50">
          {mainNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all shrink-0 whitespace-nowrap",
                item.id === "community" && pathname?.startsWith("/community")
                  ? "gs-gradient text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
              )}
            >
              {item.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
                  isSpacesActive ? "gs-gradient text-white shadow-md" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
                )}
                aria-label="Spaces menu"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Spaces</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 rounded-xl">
              {spacesDropdownItems.filter((d) => !d.highlight).map((d) => {
                const Icon = d.icon
                return (
                  <DropdownMenuItem key={d.href} asChild>
                    <Link href={d.href} className="flex items-center gap-2 cursor-pointer">
                      <Icon className="h-4 w-4" />
                      {d.label}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
              <div className="my-1 h-px bg-slate-200 dark:bg-slate-700" />
              <DropdownMenuItem asChild>
                <Link
                  href="/spaces/list"
                  className="flex items-center gap-2 cursor-pointer font-medium text-[#0F7377] dark:text-teal-400"
                >
                  <Plus className="h-4 w-4" />
                  List a Space
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 shrink-0 mx-0.5" />

          <button
            type="button"
            onClick={handleToggleTheme}
            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 transition-all shrink-0"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </button>

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

          <Button
            size="sm"
            className="flex items-center gap-1 px-2.5 py-1.5 gs-gradient text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all shrink-0 whitespace-nowrap"
            asChild
          >
            <Link href="/spaces/list">
              <Plus className="h-4 w-4 shrink-0" />
              <span>List a Space</span>
            </Link>
          </Button>
        </div>
      </nav>

      {showScrollToTop && showScrollBtn && !mobileMenuOpen && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed left-4 bottom-20 lg:bottom-4 z-30 w-12 h-12 bg-slate-800 dark:bg-slate-700 text-white rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-all animate-in fade-in duration-200"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  )
}
