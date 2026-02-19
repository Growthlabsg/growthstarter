// GrowthStarter Type Definitions

export interface Creator {
  id: string
  name: string
  avatar: string
  bio?: string
  location?: string
  verified: boolean
  projectsCount: number
  totalRaised: number
  successRate: number
  followers: number
  socialLinks?: {
    website?: string
    twitter?: string
    linkedin?: string
    instagram?: string
  }
}

export interface Reward {
  id: string
  amount: number
  title: string
  description: string
  estimatedDelivery?: string
  shippingInfo?: string
  limited?: boolean
  limitCount?: number
  claimedCount?: number
  includes?: string[]
}

export interface StretchGoal {
  id: string
  amount: number
  title: string
  description: string
  unlocked: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  avatar: string
  linkedin?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
  }
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface Update {
  id: string
  title: string
  content: string
  date: string
  author: string
  authorAvatar: string
  images?: string[]
  likes: number
  comments: number
  pinned?: boolean
}

export interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar: string
  }
  content: string
  date: string
  likes: number
  replies?: Comment[]
  isBacker?: boolean
  isCreator?: boolean
  pledgeAmount?: number
}

export interface Backer {
  id: string
  name: string
  email: string
  avatar: string
  location?: string
  pledgeAmount: number
  rewardId?: string
  rewardTitle?: string
  pledgeDate: string
  status: 'active' | 'pending' | 'cancelled' | 'refunded'
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
  shippingAddress?: string
  isAnonymous?: boolean
  isFirstTime?: boolean
  communicationHistory?: {
    type: 'email' | 'sms'
    date: string
    subject?: string
  }[]
}

export interface Project {
  id: string
  title: string
  shortDescription: string
  description: string
  story: string
  category: ProjectCategory
  goal: number
  raised: number
  backers: number
  daysLeft: number
  startDate: string
  endDate: string
  image: string
  video?: string
  gallery: string[]
  creator: Creator & { projectsCreated?: number }
  featured: boolean
  trending: boolean
  verified: boolean
  status: ProjectStatus
  tags: string[]
  location: string
  rewards: Reward[]
  stretchGoals: StretchGoal[]
  team: TeamMember[]
  faq: FAQ[]
  updates: Update[]
  comments: Comment[]
  risks: string[]
  timeline: { month: string; activity: string }[]
  socialLinks: {
    website?: string
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
  currency: Currency
  minimumPledge: number
  shippingInfo?: string
  returnPolicy?: string
  socialProof?: {
    likes: number
    shares: number
    recentBackers: string[]
  }
  liveStats?: {
    currentBackers: number
    currentRaised: number
    hourlyBackers: number
    trendingScore: number
    viewsToday: number
    conversionRate: number
  }
  analytics?: ProjectAnalytics
}

export interface ProjectAnalytics {
  totalViews: number
  uniqueVisitors: number
  conversionRate: number
  averagePledge: number
  dailyStats: {
    date: string
    views: number
    backers: number
    raised: number
  }[]
  trafficSources: {
    source: string
    visitors: number
    percentage: number
  }[]
  demographics: {
    ageGroups: { group: string; percentage: number }[]
    locations: { country: string; backers: number; percentage: number }[]
    devices: { device: string; percentage: number }[]
  }
  rewardPerformance: {
    rewardId: string
    title: string
    claims: number
    revenue: number
  }[]
}

export type ProjectCategory =
  | 'technology'
  | 'food'
  | 'creative'
  | 'health'
  | 'design'
  | 'art'
  | 'games'
  | 'music'
  | 'publishing'
  | 'fashion'
  | 'education'

export type ProjectStatus =
  | 'draft'
  | 'pending_review'
  | 'active'
  | 'funded'
  | 'ended'
  | 'cancelled'

export type Currency = 'USD' | 'EUR' | 'GBP' | 'SGD' | 'JPY'

export type SortOption =
  | 'trending'
  | 'newest'
  | 'ending-soon'
  | 'most-funded'
  | 'most-backers'
  | 'goal-low'
  | 'goal-high'

export type FilterOption =
  | 'all'
  | 'trending'
  | 'featured'
  | 'ending-soon'
  | 'highly-funded'
  | 'new'

export interface Notification {
  id: string
  type: 'backer' | 'comment' | 'milestone' | 'update' | 'system'
  title: string
  message: string
  date: string
  read: boolean
  urgent: boolean
  projectId?: string
  projectTitle?: string
  actionUrl?: string
  actionLabel?: string
}

export interface Campaign {
  id: string
  project: Project
  backers: Backer[]
  notifications: Notification[]
  stats: {
    totalRaised: number
    totalBackers: number
    conversionRate: number
    averagePledge: number
    dailyAverage: number
  }
}

// Form types for project creation
export interface ProjectFormData {
  // Step 1: Basic Info
  title: string
  category: ProjectCategory
  shortDescription: string
  description: string
  goal: number
  campaignDuration: number
  currency: Currency
  location: string
  contactEmail: string
  
  // Step 2: Project Details
  story: string
  risks: string
  timeline: string
  tags: string[]
  socialLinks: {
    website: string
    twitter: string
    facebook: string
    instagram: string
    linkedin: string
  }
  
  // Step 3: Media
  mainImage: string
  additionalImages: string[]
  videos: string[]
  faq: { question: string; answer: string }[]
  
  // Step 4: Team & Rewards
  team: { name: string; role: string; bio: string; avatar: string }[]
  rewards: { amount: number; title: string; description: string; estimatedDelivery?: string }[]
  stretchGoals: { amount: number; title: string; description: string }[]
  
  // Step 5: Business & Legal
  businessPlan: string
  marketResearch: string
  financialProjections: string
  legalDocuments: string[]
  shippingInfo: string
  returnPolicy: string
  estimatedDelivery: string
  
  // Step 6: Review
  termsAccepted: boolean
}

