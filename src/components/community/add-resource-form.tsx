"use client"

import { useState } from "react"
import type { CommunityResource } from "@/types/community"
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

const RESOURCE_TYPES: CommunityResource["type"][] = ["link", "document", "file"]

interface AddResourceFormProps {
  communityId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (resource: CommunityResource) => void
  /** Existing category names (folders) for suggestions. */
  existingCategories?: string[]
}

export function AddResourceForm({
  communityId,
  open,
  onOpenChange,
  onSubmit,
  existingCategories = [],
}: AddResourceFormProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<CommunityResource["type"]>("link")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setTitle("")
    setType("link")
    setUrl("")
    setDescription("")
    setCategory("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return
    setSaving(true)
    const now = new Date().toISOString()
    const resource: CommunityResource = {
      id: `res-${Date.now()}`,
      communityId,
      title: title.trim(),
      type,
      url: url.trim(),
      description: description.trim() || undefined,
      addedBy: "current-user",
      addedByName: "You",
      addedAt: now,
      category: category.trim() || undefined,
    }
    onSubmit(resource)
    setSaving(false)
    reset()
    onOpenChange(false)
  }

  const uniqueCategories = [...new Set(existingCategories)].filter(Boolean).sort()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Add resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="res-title">Title</Label>
            <Input
              id="res-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Guide name or link title"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="res-type">Type</Label>
            <select
              id="res-type"
              value={type}
              onChange={(e) => setType(e.target.value as CommunityResource["type"])}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-background px-3 py-2 text-sm"
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="res-url">URL</Label>
            <Input
              id="res-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="res-desc">Description (optional)</Label>
            <Input
              id="res-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="res-category">Folder / category (optional)</Label>
            <Input
              id="res-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Guides, Repos, or leave blank"
              className="mt-1"
              list="res-category-list"
            />
            {uniqueCategories.length > 0 && (
              <datalist id="res-category-list">
                {uniqueCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gs-gradient text-white" disabled={saving || !title.trim() || !url.trim()}>
              {saving ? "Adding…" : "Add resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
