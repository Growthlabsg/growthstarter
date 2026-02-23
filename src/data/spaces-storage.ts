"use client"

import type { Space, Booking } from "@/types/spaces"
import { mockSpaces } from "@/data/mock-spaces"

let spacesStore: Space[] = [...mockSpaces]
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((fn) => fn())
}

export function getSpaces(): Space[] {
  return [...spacesStore]
}

export function getSpaceBySlug(slug: string): Space | undefined {
  return spacesStore.find((s) => s.slug === slug)
}

export function getSpaceById(id: string): Space | undefined {
  return spacesStore.find((s) => s.id === id)
}

export function getSpacesByType(spaceType: Space["spaceType"]): Space[] {
  return spacesStore.filter((s) => s.spaceType === spaceType)
}

export function getFreeSpaces(): Space[] {
  return spacesStore.filter((s) => s.pricing.type === "free")
}

export function getSpacesWithStartupOffer(): Space[] {
  return spacesStore.filter((s) => s.startupOffer.enabled)
}

export function addSpace(space: Space): void {
  spacesStore = [...spacesStore, space]
  notify()
}

export function updateSpace(id: string, updates: Partial<Space>): void {
  spacesStore = spacesStore.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s))
  notify()
}

export function subscribeSpaces(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

// Bookings (in-memory for MVP)
const bookingsStore: Booking[] = []
const bookingListeners = new Set<() => void>()

function notifyBookings() {
  bookingListeners.forEach((fn) => fn())
}

export function getBookings(): Booking[] {
  return [...bookingsStore]
}

export function getBookingsBySeeker(seekerId: string): Booking[] {
  return bookingsStore.filter((b) => b.seekerId === seekerId)
}

export function getBookingById(id: string): Booking | undefined {
  return bookingsStore.find((b) => b.id === id)
}

export function addBooking(booking: Booking): void {
  bookingsStore.push(booking)
  notifyBookings()
}

export function updateBookingStatus(id: string, status: Booking["status"]): void {
  const idx = bookingsStore.findIndex((b) => b.id === id)
  if (idx >= 0) {
    bookingsStore[idx] = { ...bookingsStore[idx], status, updatedAt: new Date().toISOString() }
    notifyBookings()
  }
}

export function subscribeBookings(cb: () => void): () => void {
  bookingListeners.add(cb)
  return () => bookingListeners.delete(cb)
}
