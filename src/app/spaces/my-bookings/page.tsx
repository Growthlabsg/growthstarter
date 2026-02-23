"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, MapPin, QrCode, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBookingsBySeeker, getSpaceById, subscribeBookings } from "@/data/spaces-storage"
import { format } from "date-fns"

const SEEKER_ID = "current-user"

function exportBookingsCsv(bookings: ReturnType<typeof getBookingsBySeeker>) {
  const headers = ["Date", "Space", "Start", "End", "Amount", "Status"]
  const rows = bookings.map((b) => {
    const space = getSpaceById(b.spaceId)
    return [
      b.startAt.slice(0, 10),
      space?.name ?? b.spaceId,
      b.startAt,
      b.endAt,
      b.total,
      b.status,
    ].join(",")
  })
  const csv = [headers.join(","), ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `my-bookings-${format(new Date(), "yyyy-MM-dd")}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState(getBookingsBySeeker(SEEKER_ID))

  useEffect(() => {
    const unsub = subscribeBookings(() => setBookings(getBookingsBySeeker(SEEKER_ID)))
    return unsub
  }, [])

  const upcoming = bookings.filter(
    (b) => ["pending", "approved", "confirmed"].includes(b.status) && new Date(b.endAt) >= new Date()
  )
  const past = bookings.filter(
    (b) => b.status === "completed" || new Date(b.endAt) < new Date()
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Bookings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
            Upcoming and past space bookings.
          </p>
        </div>
        {past.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg shrink-0"
            onClick={() => exportBookingsCsv(past)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export history (CSV)
          </Button>
        )}
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="rounded-full bg-slate-100 dark:bg-slate-800 p-1">
          <TabsTrigger value="upcoming" className="rounded-full data-[state=active]:gs-gradient data-[state=active]:text-white">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-full data-[state=active]:gs-gradient data-[state=active]:text-white">
            History ({past.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-slate-400 mb-3" />
              <p className="text-slate-600 dark:text-slate-400">
                You have no upcoming bookings.
              </p>
              <Button asChild className="mt-4 gs-gradient text-white">
                <Link href="/spaces/explore">Explore spaces</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((b) => {
                const space = getSpaceById(b.spaceId)
                return (
                  <div
                    key={b.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 gs-card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {space?.name ?? "Space"}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(b.startAt), "EEE, d MMM yyyy")} ·{" "}
                        {format(new Date(b.startAt), "HH:mm")} – {format(new Date(b.endAt), "HH:mm")}
                      </p>
                      {space?.address && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {space.address}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg" asChild>
                        <Link href={`/spaces/booking/${b.id}`}>
                          <QrCode className="h-4 w-4 mr-1" />
                          View / QR
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          {past.length === 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-slate-400 mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No past bookings yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {past.map((b) => {
                const space = getSpaceById(b.spaceId)
                return (
                  <div
                    key={b.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 opacity-90"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {space?.name ?? "Space"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {format(new Date(b.startAt), "d MMM yyyy")} ·{" "}
                      {b.total > 0 ? `${b.currency} ${b.total.toFixed(2)}` : "Free"}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

