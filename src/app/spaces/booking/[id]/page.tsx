"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, MapPin, QrCode, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBookingById, getSpaceById } from "@/data/spaces-storage"
import { format } from "date-fns"

export default function BookingDetailPage() {
  const params = useParams()
  const id = (params?.id as string) ?? ""
  const booking = getBookingById(id)
  const space = booking ? getSpaceById(booking.spaceId) : null

  if (!booking || !space) notFound()

  const isUpcoming =
    ["pending", "approved", "confirmed"].includes(booking.status) &&
    new Date(booking.endAt) >= new Date()

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6">
      <Link
        href="/spaces/my-bookings"
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        My Bookings
      </Link>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {space.name}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {format(new Date(booking.startAt), "EEE, d MMM yyyy")} ·{" "}
          {format(new Date(booking.startAt), "HH:mm")} – {format(new Date(booking.endAt), "HH:mm")}
        </p>
        {space.address && (
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4" />
            {space.address}
          </p>
        )}

        {isUpcoming && booking.qrCode && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Check-in QR code
            </p>
            <div className="w-40 h-40 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <QrCode className="h-24 w-24 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Show this at the space
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Status: <span className="font-medium capitalize">{booking.status}</span>
          </p>
          {booking.total > 0 && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Total: {booking.currency} {booking.total.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      <Button asChild className="mt-6 w-full gs-gradient text-white rounded-xl">
        <Link href="/spaces/explore">Explore more spaces</Link>
      </Button>
    </div>
  )
}
