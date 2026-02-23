"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, WifiOff, X } from "lucide-react"

const DISMISSED_KEY = "community_pwa_install_dismissed"

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<unknown>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      try {
        if (localStorage.getItem(DISMISSED_KEY) !== "true") setShowInstall(true)
      } catch {}
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  useEffect(() => {
    setOffline(!navigator.onLine)
    const onOffline = () => setOffline(true)
    const onOnline = () => setOffline(false)
    window.addEventListener("offline", onOffline)
    window.addEventListener("online", onOnline)
    return () => {
      window.removeEventListener("offline", onOffline)
      window.removeEventListener("online", onOnline)
    }
  }, [])

  const handleInstall = async () => {
    const p = deferredPrompt as { prompt?: () => Promise<{ outcome: string }> }
    if (p?.prompt) {
      await p.prompt()
      setShowInstall(false)
      try {
        localStorage.setItem(DISMISSED_KEY, "true")
      } catch {}
    }
  }

  const dismiss = () => {
    setShowInstall(false)
    try {
      localStorage.setItem(DISMISSED_KEY, "true")
    } catch {}
  }

  if (offline) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 flex items-center gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 px-4 py-3 shadow-lg">
        <WifiOff className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <p className="text-sm text-amber-800 dark:text-amber-200 flex-1">
          You&apos;re offline. Some features may be limited until you&apos;re back online.
        </p>
      </div>
    )
  }

  if (!showInstall || !deferredPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 rounded-xl border border-slate-200 dark:border-slate-700 bg-card px-4 py-3 shadow-lg flex items-center gap-3">
      <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">
        Install GrowthStarter for a better experience on mobile.
      </p>
      <Button size="sm" className="rounded-lg gs-gradient text-white shrink-0 gap-1" onClick={handleInstall}>
        <Download className="h-4 w-4" />
        Install
      </Button>
      <button
        type="button"
        onClick={dismiss}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
