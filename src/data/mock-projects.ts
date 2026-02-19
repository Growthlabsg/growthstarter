import { Project, ProjectCategory } from '@/types'

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9)

// Mock creators
const creators = [
  {
    id: generateId(),
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    bio: "Serial entrepreneur focused on sustainable technology",
    location: "San Francisco, CA",
    verified: true,
    projectsCount: 3,
    totalRaised: 450000,
    successRate: 100,
    followers: 1250
  },
  {
    id: generateId(),
    name: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    bio: "Coffee enthusiast and sustainable farming advocate",
    location: "Portland, OR",
    verified: true,
    projectsCount: 2,
    totalRaised: 85000,
    successRate: 100,
    followers: 890
  },
  {
    id: generateId(),
    name: "Alex Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    bio: "Smart home security expert with 10+ years experience",
    location: "Austin, TX",
    verified: true,
    projectsCount: 1,
    totalRaised: 125000,
    successRate: 100,
    followers: 2100
  },
  {
    id: generateId(),
    name: "Emma Thompson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    bio: "Fashion designer committed to sustainable practices",
    location: "New York, NY",
    verified: true,
    projectsCount: 2,
    totalRaised: 95000,
    successRate: 100,
    followers: 3200
  },
  {
    id: generateId(),
    name: "Dr. Lisa Park",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    bio: "Clinical psychologist and mental health advocate",
    location: "Los Angeles, CA",
    verified: true,
    projectsCount: 1,
    totalRaised: 167000,
    successRate: 100,
    followers: 4500
  },
  {
    id: generateId(),
    name: "Marcus Green",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    bio: "Urban farming pioneer and IoT developer",
    location: "Chicago, IL",
    verified: true,
    projectsCount: 2,
    totalRaised: 220000,
    successRate: 100,
    followers: 1850
  }
]

// Generate mock projects
export const mockProjects: Project[] = [
  {
    id: "proj_001",
    title: "EcoTech Smart Home Hub",
    shortDescription: "Revolutionary green technology for sustainable living",
    description: "EcoTech Smart Home Hub is an AI-powered device that manages your home's energy consumption, reduces waste, and helps you live more sustainably. Our technology learns your habits and automatically optimizes energy usage.",
    story: "We started EcoTech with a simple mission: make sustainable living accessible to everyone. After years of research and development, we've created a product that not only reduces your carbon footprint but also saves you money on energy bills.",
    category: "technology",
    goal: 50000,
    raised: 32500,
    backers: 178,
    daysLeft: 15,
    startDate: "2024-01-01",
    endDate: "2024-02-15",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    video: "https://example.com/video1.mp4",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop"
    ],
    creator: creators[0],
    featured: true,
    trending: true,
    verified: true,
    status: "active",
    tags: ["AI", "Sustainability", "Smart Home", "Green Tech"],
    location: "San Francisco, CA",
    rewards: [
      { id: "r1", amount: 29, title: "Early Bird Special", description: "Get 40% off the retail price. Limited to first 100 backers.", estimatedDelivery: "March 2024", limited: true, limitCount: 100, claimedCount: 67 },
      { id: "r2", amount: 79, title: "Standard Pack", description: "One EcoTech Hub + all stretch goal rewards", estimatedDelivery: "April 2024" },
      { id: "r3", amount: 149, title: "Home Kit", description: "Hub + 3 smart sensors + premium features for 1 year", estimatedDelivery: "April 2024" },
      { id: "r4", amount: 499, title: "Ultimate Bundle", description: "Complete home setup + lifetime premium + personal consultation", estimatedDelivery: "May 2024", limited: true, limitCount: 50, claimedCount: 12 }
    ],
    stretchGoals: [
      { id: "sg1", amount: 40000, title: "Voice Control", description: "Integration with Alexa and Google Home", unlocked: false },
      { id: "sg2", amount: 60000, title: "Solar Integration", description: "Connect with solar panels for enhanced monitoring", unlocked: false },
      { id: "sg3", amount: 80000, title: "Community Features", description: "Compare and compete with neighbors", unlocked: false }
    ],
    team: [
      { id: "t1", name: "Sarah Chen", role: "Founder & CEO", bio: "10+ years in sustainable tech", avatar: creators[0].avatar },
      { id: "t2", name: "David Kim", role: "CTO", bio: "Former Google engineer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
      { id: "t3", name: "Maya Patel", role: "Head of Design", bio: "Award-winning industrial designer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" }
    ],
    faq: [
      { id: "f1", question: "When will I receive my EcoTech Hub?", answer: "We expect to ship all rewards by April 2024, with Early Bird backers receiving theirs first in March." },
      { id: "f2", question: "Is the device compatible with my current smart home setup?", answer: "Yes! EcoTech Hub works with most major smart home ecosystems including Apple HomeKit, Google Home, and Amazon Alexa." },
      { id: "f3", question: "What if the campaign doesn't reach its goal?", answer: "If we don't reach our funding goal, all pledges will be automatically refunded." }
    ],
    updates: [
      { id: "u1", title: "We hit 50% of our goal!", content: "Thank you to all our amazing backers! We're halfway there and couldn't be more excited.", date: "2024-01-15", author: "Sarah Chen", authorAvatar: creators[0].avatar, likes: 45, comments: 12, pinned: true }
    ],
    comments: [
      { id: "c1", author: { id: "u-tech", name: "TechEnthusiast", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" }, content: "This looks incredible! Can't wait to reduce my energy bills.", date: "2024-01-10", likes: 23, isBacker: true, pledgeAmount: 149 }
    ],
    risks: [
      "Supply chain delays due to global component shortages",
      "Software development may require additional time for integration with all platforms",
      "Shipping costs may vary based on destination country"
    ],
    timeline: [
      { month: "Jan 2024", activity: "Campaign Launch & Community Building" },
      { month: "Feb 2024", activity: "Final Design & Manufacturing Setup" },
      { month: "Mar 2024", activity: "Production & Quality Testing" },
      { month: "Apr 2024", activity: "Shipping to Backers" }
    ],
    socialLinks: {
      website: "https://ecotech.example.com",
      twitter: "@ecotechhub",
      instagram: "@ecotechhub"
    },
    currency: "USD",
    minimumPledge: 1,
    shippingInfo: "Free shipping within US. International shipping calculated at checkout.",
    returnPolicy: "30-day satisfaction guarantee with full refund",
    liveStats: {
      currentBackers: 178,
      currentRaised: 32500,
      hourlyBackers: 3,
      trendingScore: 85,
      viewsToday: 1240,
      conversionRate: 4.2
    }
  },
  {
    id: "proj_002",
    title: "Artisan Coffee Collective",
    shortDescription: "Premium single-origin beans from sustainable farms",
    description: "Join us in revolutionizing the coffee industry. We partner directly with farmers in Colombia, Ethiopia, and Guatemala to bring you the finest single-origin beans while ensuring fair wages and sustainable practices.",
    story: "After spending 5 years traveling to coffee farms around the world, we saw the disconnect between the amazing farmers and coffee lovers. Artisan Coffee Collective bridges that gap.",
    category: "food",
    goal: 25000,
    raised: 18750,
    backers: 156,
    daysLeft: 22,
    startDate: "2024-01-05",
    endDate: "2024-02-20",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=500&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop"
    ],
    creator: creators[1],
    featured: false,
    trending: false,
    verified: true,
    status: "active",
    tags: ["Coffee", "Sustainable", "Fair Trade", "Artisan"],
    location: "Portland, OR",
    rewards: [
      { id: "r1", amount: 15, title: "Coffee Lover", description: "1 bag of premium single-origin coffee (12oz)", estimatedDelivery: "March 2024" },
      { id: "r2", amount: 45, title: "Coffee Connoisseur", description: "3 bags from different origins + tasting notes", estimatedDelivery: "March 2024" },
      { id: "r3", amount: 99, title: "Subscription Starter", description: "3-month subscription + brewing guide", estimatedDelivery: "March 2024" },
      { id: "r4", amount: 249, title: "Coffee Master", description: "1-year subscription + premium grinder + virtual cupping session", estimatedDelivery: "March 2024", limited: true, limitCount: 25, claimedCount: 18 }
    ],
    stretchGoals: [
      { id: "sg1", amount: 30000, title: "Rwanda Origin", description: "Add beans from Rwanda to our collection", unlocked: false },
      { id: "sg2", amount: 40000, title: "Cold Brew Kit", description: "Free cold brew kit for all subscribers", unlocked: false }
    ],
    team: [
      { id: "t1", name: "Mike Johnson", role: "Founder", bio: "Coffee roaster for 15 years", avatar: creators[1].avatar },
      { id: "t2", name: "Ana Garcia", role: "Head of Sourcing", bio: "Direct relationships with 50+ farmers", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" }
    ],
    faq: [
      { id: "f1", question: "How fresh is the coffee?", answer: "All coffee is roasted to order and shipped within 24 hours of roasting." },
      { id: "f2", question: "Do you ship internationally?", answer: "Yes! We ship to over 40 countries worldwide." }
    ],
    updates: [],
    comments: [],
    risks: [
      "Seasonal variations may affect bean availability",
      "Shipping delays during peak coffee season"
    ],
    timeline: [
      { month: "Feb 2024", activity: "Finalize farmer partnerships" },
      { month: "Mar 2024", activity: "Begin roasting and shipping" }
    ],
    socialLinks: {
      website: "https://artisancoffee.example.com",
      instagram: "@artisancoffeeco"
    },
    currency: "USD",
    minimumPledge: 1
  },
  {
    id: "proj_003",
    title: "Guardian AI Security System",
    shortDescription: "Next-gen home security with facial recognition",
    description: "Guardian AI uses advanced machine learning to protect your home. Facial recognition identifies family and friends, smart alerts reduce false alarms by 95%, and 24/7 professional monitoring keeps you safe.",
    story: "After a break-in at my own home, I knew there had to be a better way. Guardian AI is the result of 3 years of development to create truly intelligent home security.",
    category: "technology",
    goal: 75000,
    raised: 52500,
    backers: 312,
    daysLeft: 8,
    startDate: "2024-01-01",
    endDate: "2024-02-01",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=500&fit=crop",
    video: "https://example.com/guardian-video.mp4",
    gallery: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&fit=crop"
    ],
    creator: creators[2],
    featured: true,
    trending: true,
    verified: true,
    status: "active",
    tags: ["AI", "Security", "Smart Home", "Safety"],
    location: "Austin, TX",
    rewards: [
      { id: "r1", amount: 149, title: "Basic Kit", description: "1 Hub + 2 cameras + 1 month monitoring", estimatedDelivery: "April 2024" },
      { id: "r2", amount: 299, title: "Home Pack", description: "1 Hub + 4 cameras + 6 months monitoring", estimatedDelivery: "April 2024" },
      { id: "r3", amount: 599, title: "Complete Protection", description: "Full home setup + 1 year monitoring + installation", estimatedDelivery: "April 2024" }
    ],
    stretchGoals: [
      { id: "sg1", amount: 100000, title: "Pet Detection", description: "AI that distinguishes between pets and intruders", unlocked: false }
    ],
    team: [
      { id: "t1", name: "Alex Rodriguez", role: "Founder & CEO", bio: "Former security consultant", avatar: creators[2].avatar }
    ],
    faq: [
      { id: "f1", question: "Does it work without internet?", answer: "Yes, Guardian AI can operate offline with local storage and will sync when connection is restored." }
    ],
    updates: [],
    comments: [],
    risks: ["Component availability", "Certification delays"],
    timeline: [
      { month: "Feb 2024", activity: "Final testing" },
      { month: "Mar 2024", activity: "Manufacturing" },
      { month: "Apr 2024", activity: "Shipping" }
    ],
    socialLinks: { website: "https://guardian-ai.example.com" },
    currency: "USD",
    minimumPledge: 1,
    liveStats: {
      currentBackers: 312,
      currentRaised: 52500,
      hourlyBackers: 5,
      trendingScore: 92,
      viewsToday: 2100,
      conversionRate: 5.8
    }
  },
  {
    id: "proj_004",
    title: "ReThread Sustainable Fashion",
    shortDescription: "Eco-friendly clothing from recycled materials",
    description: "ReThread creates beautiful, durable clothing from 100% recycled materials. Each piece diverts plastic from oceans and uses 90% less water than traditional manufacturing.",
    story: "Fashion shouldn't cost the Earth. We're proving that sustainable can be stylish, affordable, and accessible to everyone.",
    category: "fashion",
    goal: 30000,
    raised: 14250,
    backers: 89,
    daysLeft: 35,
    startDate: "2024-01-10",
    endDate: "2024-03-01",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=500&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=500&fit=crop"
    ],
    creator: creators[3],
    featured: false,
    trending: false,
    verified: true,
    status: "active",
    tags: ["Fashion", "Sustainability", "Eco-Friendly", "Recycled"],
    location: "New York, NY",
    rewards: [
      { id: "r1", amount: 35, title: "Essential Tee", description: "1 recycled cotton t-shirt", estimatedDelivery: "April 2024" },
      { id: "r2", amount: 89, title: "Casual Set", description: "T-shirt + hoodie combo", estimatedDelivery: "April 2024" },
      { id: "r3", amount: 199, title: "Full Wardrobe", description: "Complete outfit + accessories", estimatedDelivery: "May 2024" }
    ],
    stretchGoals: [],
    team: [
      { id: "t1", name: "Emma Thompson", role: "Founder & Designer", bio: "10 years in sustainable fashion", avatar: creators[3].avatar }
    ],
    faq: [],
    updates: [],
    comments: [],
    risks: ["Material sourcing variations"],
    timeline: [
      { month: "Mar 2024", activity: "Production" },
      { month: "Apr 2024", activity: "Fulfillment" }
    ],
    socialLinks: { instagram: "@rethread" },
    currency: "USD",
    minimumPledge: 1
  },
  {
    id: "proj_005",
    title: "MindfulMe Mental Health App",
    shortDescription: "AI-powered 24/7 mental health companion",
    description: "MindfulMe provides personalized mental health support through AI therapy sessions, mood tracking, and evidence-based exercises. Backed by clinical psychologists.",
    story: "Mental health support should be available to everyone, anytime. MindfulMe makes professional-quality mental health tools accessible and affordable.",
    category: "health",
    goal: 100000,
    raised: 78000,
    backers: 567,
    daysLeft: 12,
    startDate: "2024-01-01",
    endDate: "2024-02-10",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=500&fit=crop",
    video: "https://example.com/mindfulme-video.mp4",
    gallery: [
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop"
    ],
    creator: creators[4],
    featured: true,
    trending: true,
    verified: true,
    status: "active",
    tags: ["Mental Health", "AI", "Wellness", "Therapy"],
    location: "Los Angeles, CA",
    rewards: [
      { id: "r1", amount: 19, title: "Monthly Access", description: "1 month premium access", estimatedDelivery: "March 2024" },
      { id: "r2", amount: 49, title: "Quarterly", description: "3 months + guided programs", estimatedDelivery: "March 2024" },
      { id: "r3", amount: 149, title: "Annual", description: "1 year + personal coach session", estimatedDelivery: "March 2024" },
      { id: "r4", amount: 299, title: "Lifetime", description: "Lifetime access + all future features", estimatedDelivery: "March 2024", limited: true, limitCount: 100, claimedCount: 78 }
    ],
    stretchGoals: [
      { id: "sg1", amount: 120000, title: "Spanish Support", description: "Full Spanish language support", unlocked: false }
    ],
    team: [
      { id: "t1", name: "Dr. Lisa Park", role: "Founder", bio: "Clinical psychologist", avatar: creators[4].avatar }
    ],
    faq: [],
    updates: [],
    comments: [],
    risks: ["App store approval timelines"],
    timeline: [
      { month: "Feb 2024", activity: "Beta testing" },
      { month: "Mar 2024", activity: "Launch" }
    ],
    socialLinks: { website: "https://mindfulme.example.com" },
    currency: "USD",
    minimumPledge: 1,
    liveStats: {
      currentBackers: 567,
      currentRaised: 78000,
      hourlyBackers: 8,
      trendingScore: 95,
      viewsToday: 3500,
      conversionRate: 6.2
    }
  },
  {
    id: "proj_006",
    title: "UrbanGrow Vertical Farm",
    shortDescription: "IoT-powered vertical farming for cities",
    description: "UrbanGrow brings fresh produce to urban areas with smart vertical farming. Our modular system uses 95% less water and produces 10x more per square foot than traditional farming.",
    story: "Cities need local food sources. UrbanGrow makes it possible to grow fresh vegetables year-round, anywhere.",
    category: "technology",
    goal: 150000,
    raised: 98000,
    backers: 423,
    daysLeft: 18,
    startDate: "2024-01-01",
    endDate: "2024-02-15",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=500&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop"
    ],
    creator: creators[5],
    featured: false,
    trending: true,
    verified: true,
    status: "active",
    tags: ["Agriculture", "IoT", "Sustainability", "Urban Farming"],
    location: "Chicago, IL",
    rewards: [
      { id: "r1", amount: 79, title: "Starter Kit", description: "Desktop herb garden + app", estimatedDelivery: "May 2024" },
      { id: "r2", amount: 299, title: "Home Farm", description: "Full vertical unit (grows 50+ plants)", estimatedDelivery: "June 2024" },
      { id: "r3", amount: 999, title: "Commercial", description: "Restaurant-scale system + training", estimatedDelivery: "July 2024" }
    ],
    stretchGoals: [],
    team: [
      { id: "t1", name: "Marcus Green", role: "Founder", bio: "Urban agriculture expert", avatar: creators[5].avatar }
    ],
    faq: [],
    updates: [],
    comments: [],
    risks: ["Manufacturing complexity"],
    timeline: [
      { month: "Mar 2024", activity: "Tooling" },
      { month: "May 2024", activity: "Production" }
    ],
    socialLinks: { website: "https://urbangrow.example.com" },
    currency: "USD",
    minimumPledge: 1,
    liveStats: {
      currentBackers: 423,
      currentRaised: 98000,
      hourlyBackers: 4,
      trendingScore: 88,
      viewsToday: 1800,
      conversionRate: 4.5
    }
  }
  ,
  {
    id: "proj_007",
    title: "Pixel Quest RPG",
    shortDescription: "Retro-style adventure game with modern mechanics",
    description: "Pixel Quest combines nostalgic 16-bit graphics with deep RPG mechanics. Explore vast dungeons, collect rare items, and battle epic bosses in this love letter to classic gaming.",
    story: "As lifelong gamers, we wanted to create the game we always dreamed of playing. Pixel Quest is 5 years in the making.",
    category: "games",
    goal: 80000,
    raised: 65000,
    backers: 890,
    daysLeft: 14,
    startDate: "2024-01-05",
    endDate: "2024-02-05",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=500&fit=crop"
    ],
    creator: {
      id: "creator_007",
      name: "Jake Williams",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop&crop=face",
      bio: "Indie game developer with 15+ years experience",
      location: "Seattle, WA",
      verified: true,
      projectsCount: 4,
      totalRaised: 320000,
      successRate: 100,
      followers: 5600
    },
    featured: true,
    trending: true,
    verified: true,
    status: "active",
    tags: ["Gaming", "RPG", "Pixel Art", "Adventure"],
    location: "Seattle, WA",
    rewards: [
      { id: "r1", amount: 15, title: "Digital Copy", description: "Full game on release + soundtrack", estimatedDelivery: "Dec 2024" },
      { id: "r2", amount: 45, title: "Collector Edition", description: "Game + art book + poster + beta access", estimatedDelivery: "Dec 2024" },
      { id: "r3", amount: 150, title: "Name in Game", description: "Your name as NPC + all previous tiers", estimatedDelivery: "Dec 2024", limited: true, limitCount: 100, claimedCount: 87 }
    ],
    stretchGoals: [
      { id: "sg1", amount: 100000, title: "Multiplayer Mode", description: "Co-op dungeon crawling", unlocked: false }
    ],
    team: [],
    faq: [],
    updates: [],
    comments: [],
    risks: ["Development delays", "Platform certification"],
    timeline: [],
    socialLinks: { website: "https://pixelquest.example.com" },
    currency: "USD",
    minimumPledge: 1,
    liveStats: {
      currentBackers: 890,
      currentRaised: 65000,
      hourlyBackers: 12,
      trendingScore: 94,
      viewsToday: 4200,
      conversionRate: 7.1
    }
  },
  {
    id: "proj_008",
    title: "SoundWave Wireless Earbuds",
    shortDescription: "Crystal-clear audio with 48-hour battery life",
    description: "SoundWave delivers audiophile-grade sound in a compact wireless package. Active noise cancellation, spatial audio, and an industry-leading 48-hour battery.",
    story: "We spent 3 years perfecting our driver technology. SoundWave is the result of obsessive attention to audio quality.",
    category: "technology",
    goal: 200000,
    raised: 187000,
    backers: 2340,
    daysLeft: 5,
    startDate: "2024-01-01",
    endDate: "2024-01-25",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=500&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=500&fit=crop"
    ],
    creator: {
      id: "creator_008",
      name: "Diana Chen",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
      bio: "Audio engineer and product designer",
      location: "Boston, MA",
      verified: true,
      projectsCount: 2,
      totalRaised: 450000,
      successRate: 100,
      followers: 8900
    },
    featured: true,
    trending: true,
    verified: true,
    status: "active",
    tags: ["Audio", "Wireless", "Technology", "Music"],
    location: "Boston, MA",
    rewards: [
      { id: "r1", amount: 89, title: "Early Bird", description: "50% off retail - limited!", estimatedDelivery: "April 2024", limited: true, limitCount: 500, claimedCount: 498 },
      { id: "r2", amount: 129, title: "Standard", description: "One pair + premium case", estimatedDelivery: "April 2024" },
      { id: "r3", amount: 229, title: "Duo Pack", description: "Two pairs + wireless charger", estimatedDelivery: "April 2024" }
    ],
    stretchGoals: [],
    team: [],
    faq: [],
    updates: [],
    comments: [],
    risks: ["Component availability"],
    timeline: [],
    socialLinks: { website: "https://soundwave.example.com" },
    currency: "USD",
    minimumPledge: 1,
    liveStats: {
      currentBackers: 2340,
      currentRaised: 187000,
      hourlyBackers: 25,
      trendingScore: 98,
      viewsToday: 8500,
      conversionRate: 8.2
    }
  },
  {
    id: "proj_009",
    title: "Harmony Music Learning",
    shortDescription: "AI-powered music lessons for any instrument",
    description: "Harmony uses AI to provide personalized music lessons. Learn piano, guitar, drums, or any instrument at your own pace with real-time feedback.",
    story: "Music education shouldn't be expensive or intimidating. Harmony makes learning an instrument accessible to everyone.",
    category: "education",
    goal: 60000,
    raised: 42000,
    backers: 380,
    daysLeft: 20,
    startDate: "2024-01-08",
    endDate: "2024-02-15",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=500&fit=crop",
    gallery: [],
    creator: {
      id: "creator_009",
      name: "Jordan Taylor",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
      bio: "Music teacher turned tech entrepreneur",
      location: "Nashville, TN",
      verified: true,
      projectsCount: 1,
      totalRaised: 42000,
      successRate: 100,
      followers: 1200
    },
    featured: false,
    trending: false,
    verified: true,
    status: "active",
    tags: ["Music", "Education", "AI", "Learning"],
    location: "Nashville, TN",
    rewards: [
      { id: "r1", amount: 29, title: "6 Months", description: "6 months premium access", estimatedDelivery: "March 2024" },
      { id: "r2", amount: 79, title: "1 Year", description: "Full year + all instruments", estimatedDelivery: "March 2024" },
      { id: "r3", amount: 199, title: "Lifetime", description: "Lifetime access + future instruments", estimatedDelivery: "March 2024" }
    ],
    stretchGoals: [],
    team: [],
    faq: [],
    updates: [],
    comments: [],
    risks: ["App development timeline"],
    timeline: [],
    socialLinks: {},
    currency: "USD",
    minimumPledge: 1
  },
  {
    id: "proj_010",
    title: "Canvas & Soul Art Supplies",
    shortDescription: "Professional-grade eco-friendly art materials",
    description: "Canvas & Soul creates premium art supplies using sustainable materials. Our paints, brushes, and canvases perform like the best while being kind to the planet.",
    story: "As artists, we were tired of choosing between quality and sustainability. Now you don't have to.",
    category: "art",
    goal: 35000,
    raised: 28500,
    backers: 245,
    daysLeft: 28,
    startDate: "2024-01-10",
    endDate: "2024-02-28",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=500&fit=crop",
    gallery: [],
    creator: {
      id: "creator_010",
      name: "Sofia Martinez",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      bio: "Professional artist and environmentalist",
      location: "Santa Fe, NM",
      verified: true,
      projectsCount: 1,
      totalRaised: 28500,
      successRate: 100,
      followers: 890
    },
    featured: false,
    trending: false,
    verified: true,
    status: "active",
    tags: ["Art", "Sustainable", "Supplies", "Creative"],
    location: "Santa Fe, NM",
    rewards: [
      { id: "r1", amount: 25, title: "Starter Set", description: "Basic paint set + brushes", estimatedDelivery: "March 2024" },
      { id: "r2", amount: 75, title: "Artist Kit", description: "Full paint collection + canvas pack", estimatedDelivery: "March 2024" },
      { id: "r3", amount: 199, title: "Studio Bundle", description: "Complete professional setup", estimatedDelivery: "April 2024" }
    ],
    stretchGoals: [],
    team: [],
    faq: [],
    updates: [],
    comments: [],
    risks: ["Sourcing sustainable materials"],
    timeline: [],
    socialLinks: {},
    currency: "USD",
    minimumPledge: 1
  },
  {
    id: "proj_011",
    title: "ChefBox Smart Kitchen Scale",
    shortDescription: "Nutrition tracking meets precision cooking",
    description: "ChefBox is a smart kitchen scale that tracks nutrition automatically. Just place your food and our AI identifies it, calculates macros, and syncs with health apps.",
    story: "Healthy eating starts with knowing what you eat. ChefBox makes nutrition tracking effortless.",
    category: "health",
    goal: 45000,
    raised: 38000,
    backers: 420,
    daysLeft: 10,
    startDate: "2024-01-05",
    endDate: "2024-02-05",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop",
    gallery: [],
    creator: {
      id: "creator_011",
      name: "Kevin Park",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      bio: "Fitness coach and hardware engineer",
      location: "Denver, CO",
      verified: true,
      projectsCount: 1,
      totalRaised: 38000,
      successRate: 100,
      followers: 2100
    },
    featured: true,
    trending: false,
    verified: true,
    status: "active",
    tags: ["Health", "Kitchen", "Smart Home", "Fitness"],
    location: "Denver, CO",
    rewards: [
      { id: "r1", amount: 59, title: "Early Bird", description: "40% off retail", estimatedDelivery: "May 2024", limited: true, limitCount: 200, claimedCount: 189 },
      { id: "r2", amount: 89, title: "Standard", description: "One ChefBox + app subscription", estimatedDelivery: "May 2024" }
    ],
    stretchGoals: [],
    team: [],
    faq: [],
    updates: [],
    comments: [],
    risks: ["Manufacturing timeline"],
    timeline: [],
    socialLinks: {},
    currency: "USD",
    minimumPledge: 1,
    liveStats: {
      currentBackers: 420,
      currentRaised: 38000,
      hourlyBackers: 6,
      trendingScore: 82,
      viewsToday: 1500,
      conversionRate: 5.5
    }
  },
  {
    id: "proj_012",
    title: "Verse Poetry Journal",
    shortDescription: "Beautiful guided journals for aspiring poets",
    description: "Verse combines premium paper quality with thoughtful prompts to help you discover your poetic voice. Each journal includes writing exercises and inspiration.",
    story: "Poetry changed our lives. Verse journals help others discover the magic of self-expression through verse.",
    category: "publishing",
    goal: 15000,
    raised: 12800,
    backers: 320,
    daysLeft: 18,
    startDate: "2024-01-12",
    endDate: "2024-02-12",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop",
    gallery: [],
    creator: {
      id: "creator_012",
      name: "Maya Rivers",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      bio: "Published poet and workshop leader",
      location: "Brooklyn, NY",
      verified: true,
      projectsCount: 2,
      totalRaised: 35000,
      successRate: 100,
      followers: 4500
    },
    featured: false,
    trending: false,
    verified: true,
    status: "active",
    tags: ["Poetry", "Journal", "Writing", "Creative"],
    location: "Brooklyn, NY",
    rewards: [
      { id: "r1", amount: 22, title: "Single Journal", description: "One Verse journal", estimatedDelivery: "March 2024" },
      { id: "r2", amount: 55, title: "Trilogy Set", description: "3 themed journals", estimatedDelivery: "March 2024" },
      { id: "r3", amount: 99, title: "Writer's Bundle", description: "All journals + workshop access", estimatedDelivery: "March 2024" }
    ],
    stretchGoals: [],
    team: [],
    faq: [],
    updates: [],
    comments: [],
    risks: ["Printing quality consistency"],
    timeline: [],
    socialLinks: {},
    currency: "USD",
    minimumPledge: 1
  }
]

// Categories with icons and colors
export const categories: { value: ProjectCategory; label: string; icon: string; color: string }[] = [
  { value: 'technology', label: 'Technology', icon: '💻', color: 'bg-blue-500' },
  { value: 'food', label: 'Food & Beverage', icon: '🍽️', color: 'bg-orange-500' },
  { value: 'creative', label: 'Creative', icon: '🎨', color: 'bg-purple-500' },
  { value: 'health', label: 'Health & Fitness', icon: '💪', color: 'bg-green-500' },
  { value: 'design', label: 'Design', icon: '✏️', color: 'bg-pink-500' },
  { value: 'art', label: 'Art', icon: '🖼️', color: 'bg-indigo-500' },
  { value: 'games', label: 'Games', icon: '🎮', color: 'bg-red-500' },
  { value: 'music', label: 'Music', icon: '🎵', color: 'bg-yellow-500' },
  { value: 'publishing', label: 'Publishing', icon: '📚', color: 'bg-teal-500' },
  { value: 'fashion', label: 'Fashion', icon: '👗', color: 'bg-rose-500' },
  { value: 'education', label: 'Education', icon: '🎓', color: 'bg-cyan-500' }
]

// Sort options
export const sortOptions = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'ending-soon', label: 'Ending Soon' },
  { value: 'most-funded', label: 'Most Funded' },
  { value: 'most-backers', label: 'Most Backers' },
  { value: 'goal-low', label: 'Goal: Low to High' },
  { value: 'goal-high', label: 'Goal: High to Low' }
]

// Filter options
export const filterOptions = [
  { value: 'all', label: 'All Projects' },
  { value: 'trending', label: 'Trending' },
  { value: 'featured', label: 'Featured' },
  { value: 'ending-soon', label: 'Ending Soon' },
  { value: 'highly-funded', label: 'Highly Funded' },
  { value: 'new', label: 'Just Launched' }
]

