"use client"

import Link from "next/link"
import { Calendar, Inbox, DollarSign, BarChart3, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSpaces } from "@/data/spaces-storage"

const HOST_ID = "h1"

export default function HostDashboardPage() {
  const spaces = getSpaces().filter((s) => s.hostId === HOST_ID)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Host Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
            Manage your listings, bookings, and payouts.
          </p>
        </div>
        <Button className="gs-gradient text-white rounded-xl shrink-0" asChild>
          <Link href="/spaces/list">
            <Plus className="h-4 w-4 mr-2" />
            List a Space
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="rounded-full bg-slate-100 dark:bg-slate-800 p-1">
          <TabsTrigger value="inbox" className="rounded-full data-[state=active]:gs-gradient data-[state=active]:text-white">
            <Inbox className="h-4 w-4 mr-1" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-full data-[state=active]:gs-gradient data-[state=active]:text-white">
            <Calendar className="h-4 w-4 mr-1" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="payouts" className="rounded-full data-[state=active]:gs-gradient data-[state=active]:text-white">
            <DollarSign className="h-4 w-4 mr-1" />
            Payouts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-full data-[state=active]:gs-gradient data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="mt-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              No requests yet. Share your listing to get bookings.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Unified calendar view (FullCalendar / Cal.com integration).
            </p>
          </div>
        </TabsContent>

        <TabsContent value="payouts" className="mt-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Stripe Connect: payout schedule, history, pending balance.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Occupancy rate, revenue, views, conversion.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Your listings</h2>
        {spaces.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">No spaces listed yet.</p>
            <Button asChild className="mt-3 gs-gradient text-white">
              <Link href="/spaces/list">List a Space</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {spaces.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{s.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.district}</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg" asChild>
                  <Link href={`/spaces/host/space/${s.id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
