"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSpaceBySlug } from "@/data/spaces-storage"
import {
  addBooking,
} from "@/data/spaces-storage"
import { BookingConfirmedCelebration } from "@/components/spaces/booking-confirmed-celebration"
import type { Space, Booking } from "@/types/spaces"
import { format } from "date-fns"

const SEEKER_ID = "current-user"

export default function BookSpacePage() {
  const params = useParams()
  const slug = (params?.slug as string) ?? ""
  const space = getSpaceBySlug(slug)

  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("12:00")
  const [promoCode, setPromoCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null)

  const isFree = space?.pricing.type === "free"
  const hourlyRate = space?.pricing.hourly ?? space?.pricing.daily ? (space.pricing.daily ?? 0) / 8 : 0
  const hours = 3
  const subtotal = isFree ? 0 : hourlyRate * hours
  const discount = 0
  const total = Math.max(0, subtotal - discount)
  const startupOfferApplied = space?.startupOffer.enabled ?? false

  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDate(tomorrow.toISOString().slice(0, 10))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!space) return
    setSubmitting(true)
    const startAt = new Date(`${date}T${startTime}:00`)
    const endAt = new Date(`${date}T${endTime}:00`)
    const booking: Booking = {
      id: `b-${Date.now()}`,
      spaceId: space.id,
      seekerId: SEEKER_ID,
      hostId: space.hostId,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      status: space.instantBook ? "confirmed" : "pending",
      price: subtotal,
      discount,
      total,
      currency: space.pricing.currency,
      startupOfferApplied,
      promoCode: promoCode || undefined,
      qrCode: `QR-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addBooking(booking)
    setCreatedBooking(booking)
    setSubmitting(false)
    setShowCelebration(true)
  }

  if (!space) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-600 dark:text-slate-400">Space not found.</p>
        <Button asChild className="mt-4 gs-gradient text-white">
          <Link href="/spaces/explore">Explore spaces</Link>
        </Button>
      </div>
    )
  }

  const dateTimeLabel =
    date && startTime && endTime
      ? `${format(new Date(date), "EEE, d MMM yyyy")} · ${startTime} – ${endTime}`
      : ""

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6">
      <Link
        href={`/spaces/space/${slug}`}
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to space
      </Link>

      <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Book: {space.name}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Date & time
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-lg"
                required
              />
            </div>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-lg"
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>

        {!isFree && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Promo code (optional)
            </label>
            <Input
              placeholder="e.g. STARTUP20"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="rounded-lg"
            />
          </div>
        )}

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-2">
          {!isFree && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
            <span>Total</span>
            <span>{isFree ? "Free" : `$${total.toFixed(2)} ${space.pricing.currency}`}</span>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full gs-gradient text-white rounded-xl"
          disabled={submitting}
        >
          {space.instantBook ? (isFree ? "Confirm booking" : "Pay & confirm") : "Request to book"}
        </Button>
      </form>

      <BookingConfirmedCelebration
        isVisible={showCelebration}
        onClose={() => setShowCelebration(false)}
        spaceName={space.name}
        dateTime={dateTimeLabel}
        bookingId={createdBooking?.id ?? ""}
      />
    </div>
  )
}
