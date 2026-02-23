"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { COMMUNITY_TEMPLATES, mockCommunities } from "@/data/mock-communities"
import { getCreatedCommunities } from "@/data/community-created-storage"
import { COMMUNITY_CATEGORY_LABELS, MAX_COMMUNITY_CATEGORIES } from "@/data/community-categories"
import type { CommunityFormData, CommunityPrivacy } from "@/types/community"
import { X, Upload, Loader2, LayoutTemplate, Lightbulb, AlertCircle, ChevronLeft, ChevronRight, Check } from "lucide-react"

const PRIVACY_OPTIONS: { value: CommunityPrivacy; label: string }[] = [
  { value: "public", label: "Public – Anyone can join" },
  { value: "approval", label: "Approval required – You approve members" },
  { value: "invite-only", label: "Invite only – By invite or link" },
  { value: "secret", label: "Secret – Hidden from directory; invite only" },
]

const initialForm: CommunityFormData = {
  name: "",
  tagline: "",
  description: "",
  category: "",
  tags: [],
  logoUrl: "",
  bannerUrl: "",
  privacy: "public",
  welcomeMessage: "",
  guidelines: "",
  subGroupsAllowed: true,
}

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "community"
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

interface CreateCommunityFormProps {
  onSubmit: (data: CommunityFormData) => void
  onCancel?: () => void
}

const WIZARD_STEPS = [
  { id: 1, title: "Basics", short: "Name & description" },
  { id: 2, title: "Categories", short: "Categories & tags" },
  { id: 3, title: "Look", short: "Logo & banner" },
  { id: 4, title: "Privacy", short: "Privacy & rules" },
  { id: 5, title: "Review", short: "Review & create" },
] as const

export function CreateCommunityForm({ onSubmit, onCancel }: CreateCommunityFormProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<CommunityFormData>(initialForm)
  const [tagInput, setTagInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

  const existingSlugs = useMemo(() => {
    const created = getCreatedCommunities().map((c) => c.slug)
    return new Set([...mockCommunities.map((c) => c.slug), ...created])
  }, [])

  const currentSlug = normalizeSlug(form.slug ?? slugFromName(form.name))
  const slugTaken = currentSlug.length > 0 && existingSlugs.has(currentSlug)
  const slugError = slugTouched && slugTaken

  const update = (field: keyof CommunityFormData, value: string | string[] | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "name" && typeof value === "string") {
        const derived = slugFromName(value)
        if (!prev.slug || prev.slug === slugFromName(prev.name)) next.slug = derived
      }
      return next
    })
  }

  const applyTemplate = (templateId: string) => {
    const t = COMMUNITY_TEMPLATES.find((x) => x.id === templateId)
    if (!t) return
    setForm((prev) => ({
      ...prev,
      name: t.id === "blank" ? "" : t.name,
      tagline: t.tagline,
      description: t.description,
      category: t.category,
      categories: t.category ? [t.category] : [],
      guidelines: t.guidelines,
      templateId: t.id,
      slug: t.id === "blank" ? "" : slugFromName(t.name),
    }))
  }

  const toggleCategory = (label: string) => {
    const current = form.categories ?? []
    if (current.includes(label)) {
      update("categories", current.filter((c) => c !== label))
    } else if (current.length < MAX_COMMUNITY_CATEGORIES) {
      update("categories", [...current, label])
    }
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      update("tags", [...form.tags, t])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    update("tags", form.tags.filter((x) => x !== tag))
  }

  const canProceedStep1 = form.name.trim() && form.tagline.trim() && form.description.trim() && !slugTaken
  const canProceedStep2 = (form.categories ?? []).length >= 1
  const canProceedStep3 = !!form.logoUrl && !!form.bannerUrl

  const goNext = () => {
    if (step === 1) setSlugTouched(true)
    if (step < 5) setStep((s) => s + 1)
  }
  const goBack = () => setStep((s) => Math.max(1, s - 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSlugTouched(true)
    const hasCategories = (form.categories ?? []).length >= 1
    if (!form.name.trim() || !form.tagline.trim() || !form.description.trim() || !form.logoUrl || !form.bannerUrl || !hasCategories || slugTaken) return
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 400))
      onSubmit(form)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between gap-2 mb-8">
        {WIZARD_STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                step === s.id
                  ? "bg-[#0F7377]/15 text-[#0F7377] dark:bg-teal-500/20 dark:text-teal-400"
                  : step > s.id
                    ? "text-slate-500 dark:text-slate-400"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {step > s.id ? <Check className="h-3.5 w-3.5" /> : <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px]">{s.id}</span>}
              <span className="hidden sm:inline truncate">{s.short}</span>
            </button>
            {i < WIZARD_STEPS.length - 1 && <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-0.5 min-w-[8px]" />}
          </div>
        ))}
      </div>

      {/* Step 1: Basics */}
      {step === 1 && (
        <div className="space-y-6">
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4 text-[#0F7377] dark:text-teal-400" />
          Choose a template (optional)
        </Label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Pre-fills name, tagline, description and guidelines. You can change anything below.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMMUNITY_TEMPLATES.map((t) => {
            const selected = form.templateId === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTemplate(t.id)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  selected
                    ? "border-[#0F7377] dark:border-teal-500 bg-[#0F7377]/10 dark:bg-teal-500/15 ring-1 ring-[#0F7377]/30 dark:ring-teal-500/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`font-medium text-sm ${selected ? "text-[#0F7377] dark:text-teal-400" : "text-slate-900 dark:text-white"}`}>
                    {t.name}
                  </span>
                  {selected && <Check className="h-4 w-4 text-[#0F7377] dark:text-teal-400 shrink-0" />}
                </div>
                {t.tagline && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{t.tagline}</p>
                )}
                {t.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{t.description}</p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Community name *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. AI Engineers"
          className="rounded-xl"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Custom URL slug (optional)</Label>
        <Input
          id="slug"
          value={form.slug ?? slugFromName(form.name)}
          onChange={(e) => {
            const raw = e.target.value
            const normalized = normalizeSlug(raw)
            update("slug", raw.trim() ? normalized || raw : "")
          }}
          onBlur={() => setSlugTouched(true)}
          placeholder="e.g. ai-founders"
          className={`rounded-xl font-mono text-sm ${slugError ? "border-red-500 dark:border-red-400" : ""}`}
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          growthlab.com/c/<span className="font-mono">{form.slug || slugFromName(form.name) || "…"}</span>
        </p>
        {slugError && (
          <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            This URL is already taken. Choose a different slug.
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="tagline">Short tagline *</Label>
        <Input
          id="tagline"
          value={form.tagline}
          onChange={(e) => update("tagline", e.target.value)}
          placeholder="One line that describes your community"
          className="rounded-xl"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Full description *</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="What is this community about? Who is it for?"
          rows={4}
          className="rounded-xl"
          required
        />
      </div>
        </div>
      )}

      {/* Step 2: Categories & tags */}
      {step === 2 && (
        <div className="space-y-6">
      <div className="space-y-2">
        <Label>Categories (pick 1–3) *</Label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Helps members find you. Multi-category e.g. &quot;AI + Fintech&quot; is allowed.
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {COMMUNITY_CATEGORY_LABELS.map((label) => {
            const selected = (form.categories ?? []).includes(label)
            const atMax = (form.categories ?? []).length >= MAX_COMMUNITY_CATEGORIES && !selected
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleCategory(label)}
                disabled={atMax}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  selected
                    ? "bg-[#0F7377]/15 dark:bg-teal-500/20 text-[#0F7377] dark:text-teal-400 border-[#0F7377]/40 dark:border-teal-500/40"
                    : atMax
                      ? "opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        {(form.categories ?? []).length > 0 && (
          <p className="text-xs text-slate-500 mt-1">
            {(form.categories ?? []).length} of {MAX_COMMUNITY_CATEGORIES} selected
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="suggestedCategory" className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Lightbulb className="h-4 w-4" />
          Suggest new category (optional)
        </Label>
        <Input
          id="suggestedCategory"
          value={form.suggestedCategory ?? ""}
          onChange={(e) => update("suggestedCategory", e.target.value)}
          placeholder="If none fit, suggest one — GrowthLab team reviews weekly"
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label>Tags (for discoverability)</Label>
        <div className="flex gap-2 flex-wrap">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Add tag and press Enter"
            className="rounded-xl flex-1 min-w-[140px]"
          />
          <Button type="button" variant="outline" onClick={addTag} className="rounded-xl">
            Add
          </Button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0F7377]/10 text-[#0F7377] dark:bg-teal-500/20 dark:text-teal-400 text-sm"
              >
                {t}
                <button type="button" onClick={() => removeTag(t)} className="hover:opacity-80">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
        </div>
      )}

      {/* Step 3: Look */}
      {step === 3 && (
        <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Logo *</Label>
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 min-h-[120px]">
            {form.logoUrl ? (
              <>
                <img src={form.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => update("logoUrl", "")}
                  className="text-slate-500"
                >
                  Remove
                </Button>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-slate-400" />
                <Input
                  type="url"
                  placeholder="Image URL"
                  value={form.logoUrl}
                  onChange={(e) => update("logoUrl", e.target.value)}
                  className="rounded-lg text-sm"
                />
              </>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Banner *</Label>
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 min-h-[120px]">
            {form.bannerUrl ? (
              <>
                <img src={form.bannerUrl} alt="Banner" className="w-full h-20 rounded-lg object-cover" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => update("bannerUrl", "")}
                  className="text-slate-500"
                >
                  Remove
                </Button>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-slate-400" />
                <Input
                  type="url"
                  placeholder="Banner image URL"
                  value={form.bannerUrl}
                  onChange={(e) => update("bannerUrl", e.target.value)}
                  className="rounded-lg text-sm"
                />
              </>
            )}
          </div>
        </div>
      </div>
        </div>
      )}

      {/* Step 4: Privacy & rules */}
      {step === 4 && (
        <div className="space-y-6">
      <div className="space-y-2">
        <Label>Privacy *</Label>
        <Select value={form.privacy} onValueChange={(v) => update("privacy", v as CommunityPrivacy)}>
          <SelectTrigger className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIVACY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.privacy === "secret" && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Secret communities do not appear in the directory. Only people with the link can find and request to join.
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="welcome">Welcome message (optional)</Label>
        <Textarea
          id="welcome"
          value={form.welcomeMessage || ""}
          onChange={(e) => update("welcomeMessage", e.target.value)}
          placeholder="Shown to new members"
          rows={2}
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="guidelines">Community guidelines (optional)</Label>
        <Textarea
          id="guidelines"
          value={form.guidelines || ""}
          onChange={(e) => update("guidelines", e.target.value)}
          placeholder="Rules and expectations"
          rows={3}
          className="rounded-xl"
        />
      </div>
      <div className="flex items-center justify-between rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50">
        <div>
          <Label className="text-base">Allow sub-groups</Label>
        </div>
        <Switch checked={form.subGroupsAllowed} onCheckedChange={(v) => update("subGroupsAllowed", v)} />
      </div>
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Review your community</h3>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Name</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{form.name || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">URL</dt>
                <dd className="font-mono text-slate-700 dark:text-slate-300">/community/{form.slug || slugFromName(form.name) || "…"}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Tagline</dt>
                <dd className="text-slate-700 dark:text-slate-300">{form.tagline || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Categories</dt>
                <dd className="text-slate-700 dark:text-slate-300">{(form.categories ?? []).join(", ") || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Privacy</dt>
                <dd className="text-slate-700 dark:text-slate-300">{PRIVACY_OPTIONS.find((o) => o.value === form.privacy)?.label ?? form.privacy}</dd>
              </div>
            </dl>
            {(form.logoUrl || form.bannerUrl) && (
              <div className="flex gap-4 pt-2">
                {form.logoUrl && <img src={form.logoUrl} alt="Logo" className="w-14 h-14 rounded-lg object-cover" />}
                {form.bannerUrl && <img src={form.bannerUrl} alt="Banner" className="h-14 rounded-lg object-cover max-w-[200px]" />}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer: Back / Next / Submit */}
      <div className="flex gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
            Cancel
          </Button>
        )}
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={goBack} className="rounded-xl gap-1.5">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        ) : <span />}
        <div className="flex-1" />
        {step < 5 ? (
          <Button
            type="button"
            onClick={goNext}
            disabled={
              (step === 1 && !canProceedStep1) ||
              (step === 2 && !canProceedStep2) ||
              (step === 3 && !canProceedStep3)
            }
            className="rounded-xl gap-1.5 gs-gradient text-white"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={submitting || !form.name.trim() || !form.tagline.trim() || !form.description.trim() || !form.logoUrl || !form.bannerUrl || (form.categories ?? []).length < 1 || slugTaken}
            className="rounded-xl gap-1.5 gs-gradient text-white"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create community
          </Button>
        )}
      </div>
    </form>
  )
}
