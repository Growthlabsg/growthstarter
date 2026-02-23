"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Toaster } from "sonner"
import { FloatingHeaderCommunity } from "@/components/community/floating-header-community"
import { CommunityJoinProvider } from "@/components/community/community-join-context"
import { PwaInstallPrompt } from "@/components/community/pwa-install-prompt"

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#0F7377] dark:border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <CommunityJoinProvider>
      <FloatingHeaderCommunity
        onCreateCommunity={() => router.push("/community/create")}
      />
      <main className="min-h-screen bg-background pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pt-28 md:pb-0">
        {children}
      </main>
      <PwaInstallPrompt />
      <Toaster position="top-right" richColors closeButton />
    </CommunityJoinProvider>
  )
}
