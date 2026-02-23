"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { addSpace } from "@/data/spaces-storage"
import { SpaceListedCelebration } from "@/components/spaces/space-listed-celebration"
import {
  SPACE_TYPE_LABELS,
  SG_DISTRICTS,
  AMENITY_OPTIONS,
  type Space,
  type SpaceType,
} from "@/types/spaces"

const STEPS = ["Basics", "Photos", "Pricing", "Availability", "Startup Offer", "Publish"]
const HOST_ID = "h1"

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function ListSpacePage() {
  const [step, setStep] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [createdSpace, setCreatedSpace] = useState<Space | null>(null)

  const [name, setName] = useState("")
  const [spaceType, setSpaceType] = useState<SpaceType>("coworking")
  const [address, setAddress] = useState("")
  const [district, setDistrict] = useState("CBD")
  const [capacity, setCapacity] = useState(10)
  const [description, setDescription] = useState("")
  const [amenities, setAmenities] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  ])
  const [pricingType, setPricingType] = useState<"free" | "paid">("paid")
  const [hourly, setHourly] = useState(20)
  const [daily, setDaily] = useState(80)
  const [monthly, setMonthly] = useState(500)
  const [instantBook, setInstantBook] = useState(true)
  const [startupOfferEnabled, setStartupOfferEnabled] = useState(true)
  const [startupOfferDesc, setStartupOfferDesc] = useState("20% off for GrowthLab startups")
  const [startupOfferType, setStartupOfferType] = useState<"percent" | "fixed" | "free_hours">("percent")
  const [startupOfferValue, setStartupOfferValue] = useState(20)

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }

  const handlePublish = () => {
    const slug = slugify(name) || `space-${Date.now()}`
    const space: Space = {
      id: `s-${Date.now()}`,
      slug,
      hostId: HOST_ID,
      name,
      description,
      spaceType,
      address,
      lat: 1.28,
      lng: 103.85,
      district,
      capacity,
      amenities,
      pricing:
        pricingType === "free"
          ? { type: "free", currency: "SGD" }
          : {
              type: "paid",
              currency: "SGD",
              hourly,
              daily,
              monthly,
            },
      startupOffer: {
        enabled: startupOfferEnabled,
        description: startupOfferDesc,
        discountType: startupOfferType,
        value: startupOfferValue,
      },
      images: images.filter(Boolean),
      coverImageIndex: 0,
      instantBook,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addSpace(space)
    setCreatedSpace(space)
    setShowCelebration(true)
  }

  const canNext =
    step === 0
      ? name.trim() && address.trim() && capacity > 0
      : step === 1
        ? images.length > 0
        : step === 2
          ? pricingType === "free" || (pricingType === "paid" && (hourly > 0 || daily > 0 || monthly > 0))
          : true

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <Link
        href="/spaces/explore"
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0F7377] dark:hover:text-teal-400 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Explore
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">List a Space</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
        <div className="flex gap-1 mt-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-[#0F7377] dark:bg-teal-500" : "bg-slate-200 dark:bg-slate-700"}`}
            />
          ))}
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <Label>Space name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CBD Hot Desks" className="mt-1 rounded-lg" />
          </div>
          <div>
            <Label>Space type</Label>
            <select
              value={spaceType}
              onChange={(e) => setSpaceType(e.target.value as SpaceType)}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3 py-2 text-sm"
            >
              {(Object.keys(SPACE_TYPE_LABELS) as SpaceType[]).map((t) => (
                <option key={t} value={t}>{SPACE_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" className="mt-1 rounded-lg" />
          </div>
          <div>
            <Label>District</Label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3 py-2 text-sm"
            >
              {SG_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Capacity (people)</Label>
            <Input type="number" min={1} value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 1)} className="mt-1 rounded-lg" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your space..." rows={4} className="mt-1 rounded-lg" />
          </div>
          <div>
            <Label className="mb-2 block">Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => (
                <label key={a} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={amenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
                  <span className="text-sm capitalize">{a}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            First image is the cover. Add image URLs for now (MVP).
          </p>
          {images.map((url, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => {
                  const next = images.map((u, j) => (j === i ? e.target.value : u))
                  setImages(next)
                }}
                placeholder="Image URL"
                className="rounded-lg"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
              >
                ×
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setImages((p) => [...p, ""])}>
            <Upload className="h-4 w-4 mr-2" />
            Add image
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={pricingType === "free"} onChange={() => setPricingType("free")} />
              Free
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={pricingType === "paid"} onChange={() => setPricingType("paid")} />
              Paid
            </label>
          </div>
          {pricingType === "paid" && (
            <>
              <div>
                <Label>Hourly (SGD)</Label>
                <Input type="number" min={0} value={hourly} onChange={(e) => setHourly(parseFloat(e.target.value) || 0)} className="mt-1 rounded-lg" />
              </div>
              <div>
                <Label>Daily (SGD)</Label>
                <Input type="number" min={0} value={daily} onChange={(e) => setDaily(parseFloat(e.target.value) || 0)} className="mt-1 rounded-lg" />
              </div>
              <div>
                <Label>Monthly (SGD)</Label>
                <Input type="number" min={0} value={monthly} onChange={(e) => setMonthly(parseFloat(e.target.value) || 0)} className="mt-1 rounded-lg" />
              </div>
            </>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={instantBook} onCheckedChange={(c) => setInstantBook(!!c)} />
            <span className="text-sm">Instant book (no approval required)</span>
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Set default hours (e.g. Mon–Fri 9–6). Calendar sync can be added later.
          </p>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={startupOfferEnabled} onCheckedChange={(c) => setStartupOfferEnabled(!!c)} />
            <span className="text-sm font-medium">Offer for GrowthLab startups</span>
          </label>
          {startupOfferEnabled && (
            <>
              <div>
                <Label>Offer description</Label>
                <Input value={startupOfferDesc} onChange={(e) => setStartupOfferDesc(e.target.value)} placeholder="e.g. 20% off for GrowthLab startups" className="mt-1 rounded-lg" />
              </div>
              <div>
                <Label>Discount type</Label>
                <select
                  value={startupOfferType}
                  onChange={(e) => setStartupOfferType(e.target.value as "percent" | "fixed" | "free_hours")}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3 py-2 text-sm"
                >
                  <option value="percent">Percentage off</option>
                  <option value="fixed">Fixed amount off</option>
                  <option value="free_hours">Free hours</option>
                </select>
              </div>
              <div>
                <Label>Value</Label>
                <Input type="number" min={0} value={startupOfferValue} onChange={(e) => setStartupOfferValue(parseFloat(e.target.value) || 0)} className="mt-1 rounded-lg" />
              </div>
            </>
          )}
        </div>
      )}

      {step === 5 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Zero listing fee. A small commission applies on paid bookings only (e.g. 5–10%). By publishing you agree to the terms.
          </p>
          <p className="font-medium text-slate-900 dark:text-white">{name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{address} · {SPACE_TYPE_LABELS[spaceType]}</p>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" className="rounded-xl" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button className="gs-gradient text-white rounded-xl" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button className="gs-gradient text-white rounded-xl" onClick={handlePublish}>
            Publish
          </Button>
        )}
      </div>

      {createdSpace && (
        <SpaceListedCelebration
          isVisible={showCelebration}
          onClose={() => setShowCelebration(false)}
          spaceName={createdSpace.name}
          spaceSlug={createdSpace.slug}
        />
      )}
    </div>
  )
}
