"use client"

import { useState } from "react"
import type { SubGroup, ChannelKind } from "@/types/community"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type CreateChannelFormProps = {
  communityId: string
  onSubmit: (channel: {
    communityId: string
    slug: string
    name: string
    description: string
    kind: ChannelKind
    createdBy: string
  }) => void
  onCancel?: () => void
}

const KIND_OPTIONS: { value: ChannelKind; label: string }[] = [
  { value: "announcement", label: "Announcement" },
  { value: "general", label: "General" },
  { value: "channel", label: "Topic channel" },
]

export function CreateChannelForm({ communityId, onSubmit, onCancel }: CreateChannelFormProps) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [kind, setKind] = useState<ChannelKind>("channel")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const s = slug.trim() || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    if (!name.trim()) return
    onSubmit({
      communityId,
      name: name.trim(),
      slug: s,
      description: description.trim(),
      kind,
      createdBy: "current-user",
    })
    setName("")
    setSlug("")
    setDescription("")
    setKind("channel")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label htmlFor="ch-name">Name</Label>
          <Input
            id="ch-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
            }}
            placeholder="e.g. Events"
            className="mt-1 rounded-lg"
          />
        </div>
        <div>
          <Label htmlFor="ch-slug">Slug</Label>
          <Input
            id="ch-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="events"
            className="mt-1 rounded-lg"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="ch-desc">Description</Label>
        <Input
          id="ch-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional"
          className="mt-1 rounded-lg"
        />
      </div>
      <div>
        <Label>Type</Label>
        <Select value={kind} onValueChange={(v) => setKind(v as ChannelKind)}>
          <SelectTrigger className="mt-1 rounded-lg w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {KIND_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" className="rounded-lg">
          Create channel
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
