"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, Rocket, Award } from "lucide-react"

export default function CommunityBuildersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold gs-gradient-text mb-2">For builders</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Resources and tips to grow your community on GrowthLab.
      </p>

      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 gs-card-hover">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl gs-gradient flex items-center justify-center shrink-0">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Get started in 5 minutes</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Create your community, invite members, add your first sub-group, and post an announcement.
              </p>
              <Button asChild size="sm" className="mt-3 gs-gradient text-white rounded-lg">
                <Link href="/community/create">Create community</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 gs-card-hover">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0F7377]/10 dark:bg-teal-500/20 flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6 text-[#0F7377] dark:text-teal-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Best practices</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Guidelines, moderation, and engagement tips to keep your community healthy and active.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 gs-card-hover">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0F7377]/10 dark:bg-teal-500/20 flex items-center justify-center shrink-0">
              <Award className="h-6 w-6 text-[#0F7377] dark:text-teal-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Community of the month</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                GrowthLab features a standout community each month in the directory. Build something great and you could be next.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Button asChild className="gs-gradient text-white rounded-xl">
          <Link href="/community/browse">
            <Users className="h-4 w-4 mr-2" />
            Browse directory
          </Link>
        </Button>
      </div>
    </div>
  )
}
