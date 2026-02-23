/**
 * FLOATING HEADER – Community section (copy-paste)
 * Use this header design for the Community section: floating pill only, no static top bar.
 * Same design as Network section. Requires: Next.js, Tailwind, shadcn (Button, DropdownMenu), Lucide icons.
 *
 * 1. Ensure globals.css has .gs-gradient and .gs-glass (see DESIGN_AND_CODE_REFERENCE_APPS_DEALS.md).
 * 2. Replace /community/* routes with your actual Community routes.
 * 3. Wire toggleTheme, onCreateCommunity, and notifications to your app.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Menu,
  X,
  Users,
  LayoutGrid,
  PlusCircle,
  TrendingUp,
  Wrench,
  Rocket,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const communityDropdownItems = [
  { label: "Browse Directory", href: "/community/browse", icon: LayoutGrid },
  { label: "My Communities", href: "/community/my", icon: Users },
  { label: "Create New Community", href: "/community/create", icon: PlusCircle },
  { label: "Trending", href: "/community/trending", icon: TrendingUp },
  { label: "For Builders", href: "/community/builders", icon: Wrench },
];

const mainNavItems = [
  { id: "feed", label: "Feed", href: "/feed" },
  { id: "network", label: "Network", href: "/network" },
  { id: "community", label: "Community", href: "/community", isDropdown: true },
  { id: "events", label: "Events", href: "/events" },
];

interface FloatingHeaderCommunityProps {
  toggleTheme?: () => void;
  onCreateCommunity?: () => void;
  unreadCount?: number;
  showScrollToTop?: boolean;
}

export function FloatingHeaderCommunity({
  toggleTheme = () => document.documentElement.classList.toggle("dark"),
  onCreateCommunity,
  unreadCount = 0,
  showScrollToTop = true,
}: FloatingHeaderCommunityProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const isCommunityRoute = pathname?.startsWith("/community") ?? false;

  useEffect(() => {
    const handleScroll = () => setShowScrollBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* Desktop / Tablet: Floating pill – always visible (Community section) */}
      <nav
        className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in duration-300"
        role="navigation"
        aria-label="Main"
      >
        <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl dark:shadow-2xl dark:shadow-black/20 rounded-full px-3 py-1.5 border border-slate-200/50 dark:border-slate-700/50">
          {mainNavItems.map((item) => {
            const isActive =
              item.id === "community" ? isCommunityRoute : pathname?.startsWith(item.href);

            if (item.isDropdown && item.id === "community") {
              return (
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all",
                        isActive
                          ? "gs-gradient text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
                      )}
                      aria-label="Community menu"
                    >
                      <Users className="h-4 w-4" />
                      <span className="hidden xl:inline">Community</span>
                      <ChevronDown className="h-3.5 w-3.5 ml-0.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56 rounded-xl">
                    {communityDropdownItems.map((d) => {
                      const Icon = d.icon;
                      return (
                        <DropdownMenuItem key={d.href} asChild>
                          <Link
                            href={d.href}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            {d.label}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all",
                  isActive
                    ? "gs-gradient text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
                )}
              >
                <span className={isActive ? "" : "hidden xl:inline"}>{item.label}</span>
              </Link>
            );
          })}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-600" />

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 transition-all"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </button>

          <button
            type="button"
            className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
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
            className="flex items-center gap-1.5 px-3 py-2 gs-gradient text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all ml-1"
            onClick={onCreateCommunity}
            asChild={!onCreateCommunity}
          >
            {onCreateCommunity ? (
              <>
                <Rocket className="h-4 w-4" />
                <span className="hidden xl:inline">Create Community</span>
              </>
            ) : (
              <Link href="/community/create" className="flex items-center gap-1.5">
                <Rocket className="h-4 w-4" />
                <span className="hidden xl:inline">Create Community</span>
              </Link>
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile: FAB + sheet */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-14 h-14 gs-gradient text-white rounded-full shadow-xl flex items-center justify-center hover:opacity-90 transition-all"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {mobileMenuOpen && (
          <div className="absolute bottom-16 right-0 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {mainNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    pathname?.startsWith(item.href)
                      ? "bg-[#0F7377]/10 text-[#0F7377] dark:bg-teal-500/20 dark:text-teal-400"
                      : "text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {communityDropdownItems.map((d) => (
                <Link
                  key={d.href}
                  href={d.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 pl-8"
                >
                  {d.label}
                </Link>
              ))}
              <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
              <Link
                href="/community/create"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 gs-gradient text-white rounded-xl text-sm font-medium"
              >
                <Rocket className="h-5 w-5" />
                Create Community
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to top */}
      {showScrollToTop && showScrollBtn && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-4 left-4 w-12 h-12 bg-slate-800 dark:bg-slate-700 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-slate-700 dark:hover:bg-slate-600 transition-all z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
