"use client"

import { useState, useEffect } from "react"
import { Toaster } from "sonner"
import { FloatingHeaderSpaces } from "@/components/spaces/floating-header-spaces"

export default function SpacesLayout({ children }: { children: React.ReactNode }) {
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
    <>
      <FloatingHeaderSpaces />
      <main className="min-h-screen bg-background pt-8 pb-24 lg:pt-28 lg:pb-8">
        {children}
      </main>
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}
