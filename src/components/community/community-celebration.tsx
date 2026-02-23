"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, X, Share2 } from "lucide-react"
import confetti from "canvas-confetti"
import type { Community } from "@/types/community"

const CONFETTI_COLORS = ["#0F7377", "#00A884", "#FFD700", "#FF6B6B"]

function runConfetti() {
  const duration = 3000
  const end = Date.now() + duration
  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: CONFETTI_COLORS })
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: CONFETTI_COLORS })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

interface CommunityCelebrationProps {
  community: Community
  isVisible: boolean
  onClose: () => void
}

export function CommunityCelebration({ community, isVisible, onClose }: CommunityCelebrationProps) {
  const router = useRouter()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      runConfetti()
      setHasAnimated(true)
    }
  }, [isVisible, hasAnimated])

  useEffect(() => {
    if (!isVisible) setHasAnimated(false)
  }, [isVisible])

  if (!isVisible) return null

  const goToCommunity = () => {
    onClose()
    router.push(`/community/${community.slug}`)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="relative bg-gradient-to-br from-[#0F7377] to-[#00A884] px-6 py-8 text-white text-center">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            </div>
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <Users className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Community created!</h2>
              <p className="text-white/90">Your community is now live on GrowthLab.</p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={community.logoUrl}
                alt={community.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">{community.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{community.tagline}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">1</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Members</div>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Posts</div>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">Live</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Status</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button className="flex-1 gs-gradient text-white" onClick={goToCommunity}>
                Go to community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
