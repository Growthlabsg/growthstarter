"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  FolderOpen,
  Plus,
  TrendingUp,
  Star,
  Wrench,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react"

const navItems = [
  { label: "Browse Directory", href: "/community/browse", icon: FolderOpen },
  { label: "My Communities", href: "/community/my", icon: Users },
  { label: "Trending", href: "/community/trending", icon: TrendingUp },
  { label: "For You", href: "/community/for-you", icon: Star },
  { label: "For Builders", href: "/community/builders", icon: Wrench },
] as const

export function CommunityHeader() {
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (saved === "dark" || (!saved && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev)
    if (!isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const isActive = (href: string) => pathname === href || (href !== "/community/browse" && pathname?.startsWith(href))

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border gs-glass" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <Link href="/community/browse" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gs-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gs-gradient-text">GrowthLab</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Community</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "gs-gradient text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              )
            })}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="h-4 w-4 hidden dark:block" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button asChild size="sm" className="gs-gradient text-white rounded-full shadow-md">
              <Link href="/community/create">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Create Community</span>
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                      active
                        ? "bg-[#0F7377]/10 dark:bg-teal-500/20 text-[#0F7377] dark:text-teal-400"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
              <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                <Link
                  href="/community/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 gs-gradient text-white rounded-xl text-sm font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Create Community
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
