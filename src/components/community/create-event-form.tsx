"use client"

import { useState } from "react"
import type { CommunityEvent } from "@/types/community"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EVENT_TYPES: CommunityEvent["type"][] = [
  "meetup",
  "webinar",
  "workshop",
  "ama",
  "mixer",
  "hackathon",
]

interface CreateEventFormProps {
  communityId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (event: CommunityEvent) => void
}

export function CreateEventForm({
  communityId,
  open,
  onOpenChange,
  onSubmit,
}: CreateEventFormProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<CommunityEvent["type"]>("meetup")
  const [description, setDescription] = useState("")
  const [startAt, setStartAt] = useState("")
  const [endAt, setEndAt] = useState("")
  const [location, setLocation] = useState("")
  const [meetingUrl, setMeetingUrl] = useState("")
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setTitle("")
    setType("meetup")
    setDescription("")
    setStartAt("")
    setEndAt("")
    setLocation("")
    setMeetingUrl("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !startAt) return
    setSaving(true)
    const now = new Date().toISOString()
    const event: CommunityEvent = {
      id: `ev-${Date.now()}`,
      communityId,
      title: title.trim(),
      type,
      description: description.trim() || undefined,
      startAt: new Date(startAt).toISOString(),
      endAt: endAt ? new Date(endAt).toISOString() : undefined,
      location: location.trim() || undefined,
      meetingUrl: meetingUrl.trim() || undefined,
      createdBy: "current-user",
      createdAt: now,
    }
    onSubmit(event)
    setSaving(false)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Create event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ev-title">Title</Label>
            <Input
              id="ev-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Monthly sync"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="ev-type">Type</Label>
            <select
              id="ev-type"
              value={type}
              onChange={(e) => setType(e.target.value as CommunityEvent["type"])}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-3 py-2 text-sm"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="ev-desc">Description (optional)</Label>
            <textarea
              id="ev-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this event about?"
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-3 py-2 text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ev-start">Start</Label>
              <Input
                id="ev-start"
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="ev-end">End (optional)</Label>
              <Input
                id="ev-end"
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="ev-location">Location (optional)</Label>
            <Input
              id="ev-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or venue"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ev-url">Meeting URL (optional)</Label>
            <Input
              id="ev-url"
              type="url"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://meet.example.com/..."
              className="mt-1"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gs-gradient text-white" disabled={saving || !title.trim() || !startAt}>
              {saving ? "Creating…" : "Create event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
