/**
 * Data models for Book a Space (GrowthLab Spaces) section.
 * Aligns with spec Section 11.
 */

export type SpaceType =
  | "coworking"
  | "private_office"
  | "meeting_event"
  | "cafe"
  | "sports_fitness"
  | "government_public"
  | "corporate_lounge"
  | "outdoor_hybrid"

export type BookingStatus =
  | "pending"
  | "approved"
  | "declined"
  | "confirmed"
  | "cancelled"
  | "completed"

export interface SpacePricing {
  type: "free" | "paid"
  currency: string
  hourly?: number
  daily?: number
  monthly?: number
}

export interface StartupOffer {
  enabled: boolean
  description: string
  discountType: "percent" | "fixed" | "free_hours"
  value?: number
}

export interface Space {
  id: string
  slug: string
  hostId: string
  name: string
  description: string
  spaceType: SpaceType
  address: string
  lat: number
  lng: number
  district: string
  capacity: number
  amenities: string[]
  pricing: SpacePricing
  startupOffer: StartupOffer
  images: string[]
  coverImageIndex: number
  instantBook: boolean
  verified?: boolean
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  spaceId: string
  seekerId: string
  hostId: string
  startAt: string
  endAt: string
  status: BookingStatus
  price: number
  discount: number
  total: number
  currency: string
  startupOfferApplied: boolean
  promoCode?: string
  teamMemberIds?: string[]
  qrCode?: string
  createdAt: string
  updatedAt: string
}

export interface Host {
  id: string
  userId: string
  businessName: string
  logoUrl?: string
  description?: string
  stripeConnectAccountId?: string
  responseTime?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  bookingId: string
  spaceId: string
  authorId: string
  hostId: string
  rating: number
  comment?: string
  createdAt: string
}

export const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  coworking: "Co-working / Hot Desks",
  private_office: "Private Offices / Team Rooms",
  meeting_event: "Meeting & Event Spaces",
  cafe: "Cafe & Casual Work Zones",
  sports_fitness: "Sports & Fitness",
  government_public: "Government & Public Hubs",
  corporate_lounge: "Corporate Lounges",
  outdoor_hybrid: "Outdoor / Hybrid",
}

export const SPACE_TYPE_ICONS: Record<SpaceType, string> = {
  coworking: "Monitor",
  private_office: "Building2",
  meeting_event: "Users",
  cafe: "Coffee",
  sports_fitness: "Dumbbell",
  government_public: "Landmark",
  corporate_lounge: "Briefcase",
  outdoor_hybrid: "TreePine",
}

export const SG_DISTRICTS = [
  "CBD",
  "Orchard",
  "One-North",
  "Jurong",
  "Marina Bay",
  "Bugis",
  "Tiong Bahru",
  "Sentosa",
  "Changi",
  "Other",
] as const

export const AMENITY_OPTIONS = [
  "wifi",
  "projector",
  "whiteboard",
  "coffee",
  "parking",
  "24/7",
  "AC",
  "printing",
  "sports_equipment",
  "catering",
] as const
