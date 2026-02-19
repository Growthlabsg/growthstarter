"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  X,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Upload,
  Info,
  CheckCircle,
  Rocket,
  FileText,
  Image as ImageIcon,
  Users,
  Briefcase,
  Eye,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Linkedin
} from "lucide-react"
import { ProjectCategory, Currency, ProjectFormData } from "@/types"
import { categories } from "@/data/mock-projects"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject: (data: ProjectFormData) => void
}

const TOTAL_STEPS = 6
const STEPS = [
  { number: 1, title: "Basic Info", icon: FileText },
  { number: 2, title: "Details", icon: Info },
  { number: 3, title: "Media", icon: ImageIcon },
  { number: 4, title: "Team & Rewards", icon: Users },
  { number: 5, title: "Business", icon: Briefcase },
  { number: 6, title: "Review", icon: Eye }
]

const initialFormData: ProjectFormData = {
  title: "",
  category: "technology",
  shortDescription: "",
  description: "",
  goal: 0,
  campaignDuration: 30,
  currency: "USD",
  location: "",
  contactEmail: "",
  story: "",
  risks: "",
  timeline: "",
  tags: [],
  socialLinks: {
    website: "",
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: ""
  },
  mainImage: "",
  additionalImages: [],
  videos: [],
  faq: [],
  team: [],
  rewards: [],
  stretchGoals: [],
  businessPlan: "",
  marketResearch: "",
  financialProjections: "",
  legalDocuments: [],
  shippingInfo: "",
  returnPolicy: "",
  estimatedDelivery: "",
  termsAccepted: false
}

export function CreateProjectModal({ isOpen, onClose, onCreateProject }: CreateProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData)
  const [currentTag, setCurrentTag] = useState("")
  const [currentFAQ, setCurrentFAQ] = useState({ question: "", answer: "" })
  const [currentTeamMember, setCurrentTeamMember] = useState({ name: "", role: "", bio: "", avatar: "" })
  const [currentReward, setCurrentReward] = useState({ amount: 0, title: "", description: "", estimatedDelivery: "" })
  const [currentStretchGoal, setCurrentStretchGoal] = useState({ amount: 0, title: "", description: "" })

  const updateFormData = (field: keyof ProjectFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateSocialLink = (platform: keyof typeof formData.socialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      updateFormData("tags", [...formData.tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tag: string) => {
    updateFormData("tags", formData.tags.filter(t => t !== tag))
  }

  const addFAQ = () => {
    if (currentFAQ.question && currentFAQ.answer) {
      updateFormData("faq", [...formData.faq, currentFAQ])
      setCurrentFAQ({ question: "", answer: "" })
    }
  }

  const removeFAQ = (index: number) => {
    updateFormData("faq", formData.faq.filter((_, i) => i !== index))
  }

  const addTeamMember = () => {
    if (currentTeamMember.name && currentTeamMember.role) {
      updateFormData("team", [...formData.team, currentTeamMember])
      setCurrentTeamMember({ name: "", role: "", bio: "", avatar: "" })
    }
  }

  const removeTeamMember = (index: number) => {
    updateFormData("team", formData.team.filter((_, i) => i !== index))
  }

  const addReward = () => {
    if (currentReward.amount > 0 && currentReward.title && currentReward.description) {
      updateFormData("rewards", [...formData.rewards, currentReward])
      setCurrentReward({ amount: 0, title: "", description: "", estimatedDelivery: "" })
    }
  }

  const removeReward = (index: number) => {
    updateFormData("rewards", formData.rewards.filter((_, i) => i !== index))
  }

  const addStretchGoal = () => {
    if (currentStretchGoal.amount > 0 && currentStretchGoal.title) {
      updateFormData("stretchGoals", [...formData.stretchGoals, currentStretchGoal])
      setCurrentStretchGoal({ amount: 0, title: "", description: "" })
    }
  }

  const removeStretchGoal = (index: number) => {
    updateFormData("stretchGoals", formData.stretchGoals.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = () => {
    if (formData.termsAccepted) {
      onCreateProject(formData)
      setFormData(initialFormData)
      setCurrentStep(1)
    }
  }

  const progress = (currentStep / TOTAL_STEPS) * 100

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-slate-900" showCloseButton={false}>
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold gs-gradient-text">
              Create Your Project
            </DialogTitle>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-4">
              {STEPS.map((step) => {
                const Icon = step.icon
                const isActive = step.number === currentStep
                const isCompleted = step.number < currentStep
                return (
                  <button
                    key={step.number}
                    onClick={() => step.number <= currentStep && setCurrentStep(step.number)}
                    className={`flex flex-col items-center gap-1 ${
                      step.number <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? 'gs-gradient text-white'
                        : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${
                      isActive ? 'text-[#0F7377]' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    placeholder="Enter your project title"
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => updateFormData("category", value as ProjectCategory)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <span className="flex items-center gap-2">
                              {cat.icon} {cat.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Currency *</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => updateFormData("currency", value as Currency)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="SGD">SGD (S$)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => updateFormData("shortDescription", e.target.value)}
                    placeholder="A brief summary of your project (max 200 characters)"
                    className="mt-1.5"
                    maxLength={200}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.shortDescription.length}/200 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Describe your project in detail"
                    className="mt-1.5 min-h-[150px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="goal">Funding Goal *</Label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <Input
                        id="goal"
                        type="number"
                        value={formData.goal || ""}
                        onChange={(e) => updateFormData("goal", parseInt(e.target.value) || 0)}
                        placeholder="50000"
                        className="pl-7"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration">Campaign Duration *</Label>
                    <Select
                      value={formData.campaignDuration.toString()}
                      onValueChange={(value) => updateFormData("campaignDuration", parseInt(value))}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="45">45 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      placeholder="City, Country"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData("contactEmail", e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="story">Project Story *</Label>
                <Textarea
                  id="story"
                  value={formData.story}
                  onChange={(e) => updateFormData("story", e.target.value)}
                  placeholder="Tell the story behind your project. What inspired you? What problem are you solving?"
                  className="mt-1.5 min-h-[200px]"
                />
              </div>

              <div>
                <Label htmlFor="risks">Risks & Challenges *</Label>
                <Textarea
                  id="risks"
                  value={formData.risks}
                  onChange={(e) => updateFormData("risks", e.target.value)}
                  placeholder="Be transparent about potential risks and how you plan to address them"
                  className="mt-1.5 min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="timeline">Timeline & Milestones</Label>
                <Textarea
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => updateFormData("timeline", e.target.value)}
                  placeholder="Describe your project timeline and key milestones"
                  className="mt-1.5 min-h-[120px]"
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-2 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Social Links</Label>
                <div className="grid gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <Input
                      value={formData.socialLinks.website}
                      onChange={(e) => updateSocialLink("website", e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-slate-400" />
                    <Input
                      value={formData.socialLinks.twitter}
                      onChange={(e) => updateSocialLink("twitter", e.target.value)}
                      placeholder="@username"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-slate-400" />
                    <Input
                      value={formData.socialLinks.facebook}
                      onChange={(e) => updateSocialLink("facebook", e.target.value)}
                      placeholder="facebook.com/page"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-slate-400" />
                    <Input
                      value={formData.socialLinks.instagram}
                      onChange={(e) => updateSocialLink("instagram", e.target.value)}
                      placeholder="@username"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-slate-400" />
                    <Input
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                      placeholder="linkedin.com/company/name"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Media */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="mainImage">Main Project Image *</Label>
                <Input
                  id="mainImage"
                  value={formData.mainImage}
                  onChange={(e) => updateFormData("mainImage", e.target.value)}
                  placeholder="Enter image URL"
                  className="mt-1.5"
                />
                <div className="mt-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto text-slate-400" />
                  <p className="text-sm text-slate-500 mt-2">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Recommended: 1200x675px, JPG or PNG
                  </p>
                </div>
              </div>

              <div>
                <Label>Project Video URL</Label>
                <Input
                  value={formData.videos[0] || ""}
                  onChange={(e) => updateFormData("videos", [e.target.value])}
                  placeholder="https://youtube.com/watch?v=..."
                  className="mt-1.5"
                />
                <p className="text-xs text-slate-500 mt-1">
                  YouTube or Vimeo links supported
                </p>
              </div>

              <div>
                <Label>FAQ Section</Label>
                <div className="space-y-3 mt-2">
                  <Input
                    value={currentFAQ.question}
                    onChange={(e) => setCurrentFAQ(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Question"
                  />
                  <Textarea
                    value={currentFAQ.answer}
                    onChange={(e) => setCurrentFAQ(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Answer"
                    className="min-h-[80px]"
                  />
                  <Button type="button" onClick={addFAQ} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>

                {formData.faq.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.faq.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{item.question}</p>
                          <button onClick={() => removeFAQ(idx)} className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Team & Rewards */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Team Members */}
              <div>
                <Label>Team Members</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <Input
                    value={currentTeamMember.name}
                    onChange={(e) => setCurrentTeamMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Name"
                  />
                  <Input
                    value={currentTeamMember.role}
                    onChange={(e) => setCurrentTeamMember(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Role"
                  />
                  <Textarea
                    value={currentTeamMember.bio}
                    onChange={(e) => setCurrentTeamMember(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Short bio"
                    className="md:col-span-2"
                  />
                </div>
                <Button type="button" onClick={addTeamMember} variant="outline" className="w-full mt-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>

                {formData.team.length > 0 && (
                  <div className="mt-4 grid gap-2">
                    {formData.team.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                        <button onClick={() => removeTeamMember(idx)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reward Tiers */}
              <div>
                <Label>Reward Tiers *</Label>
                <div className="grid gap-3 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <Input
                        type="number"
                        value={currentReward.amount || ""}
                        onChange={(e) => setCurrentReward(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                        placeholder="Amount"
                        className="pl-7"
                      />
                    </div>
                    <Input
                      value={currentReward.title}
                      onChange={(e) => setCurrentReward(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Reward Title"
                    />
                  </div>
                  <Textarea
                    value={currentReward.description}
                    onChange={(e) => setCurrentReward(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what backers will receive"
                    className="min-h-[80px]"
                  />
                  <Input
                    value={currentReward.estimatedDelivery}
                    onChange={(e) => setCurrentReward(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                    placeholder="Estimated delivery (e.g., March 2024)"
                  />
                </div>
                <Button type="button" onClick={addReward} variant="outline" className="w-full mt-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reward Tier
                </Button>

                {formData.rewards.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.rewards.map((reward, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0F7377]">${reward.amount}</span>
                              <span className="font-medium">{reward.title}</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{reward.description}</p>
                          </div>
                          <button onClick={() => removeReward(idx)} className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stretch Goals */}
              <div>
                <Label>Stretch Goals (Optional)</Label>
                <div className="grid gap-3 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <Input
                        type="number"
                        value={currentStretchGoal.amount || ""}
                        onChange={(e) => setCurrentStretchGoal(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                        placeholder="Goal Amount"
                        className="pl-7"
                      />
                    </div>
                    <Input
                      value={currentStretchGoal.title}
                      onChange={(e) => setCurrentStretchGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Stretch Goal Title"
                    />
                  </div>
                  <Textarea
                    value={currentStretchGoal.description}
                    onChange={(e) => setCurrentStretchGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the stretch goal"
                    className="min-h-[60px]"
                  />
                </div>
                <Button type="button" onClick={addStretchGoal} variant="outline" className="w-full mt-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stretch Goal
                </Button>

                {formData.stretchGoals.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.stretchGoals.map((goal, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div>
                          <span className="font-bold text-[#0F7377]">${goal.amount.toLocaleString()}</span>
                          <span className="ml-2">{goal.title}</span>
                        </div>
                        <button onClick={() => removeStretchGoal(idx)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Business & Legal */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="businessPlan">Business Plan Summary</Label>
                <Textarea
                  id="businessPlan"
                  value={formData.businessPlan}
                  onChange={(e) => updateFormData("businessPlan", e.target.value)}
                  placeholder="Briefly describe your business model and go-to-market strategy"
                  className="mt-1.5 min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="marketResearch">Market Research</Label>
                <Textarea
                  id="marketResearch"
                  value={formData.marketResearch}
                  onChange={(e) => updateFormData("marketResearch", e.target.value)}
                  placeholder="Describe your target market and competitive landscape"
                  className="mt-1.5 min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="financialProjections">Financial Projections</Label>
                <Textarea
                  id="financialProjections"
                  value={formData.financialProjections}
                  onChange={(e) => updateFormData("financialProjections", e.target.value)}
                  placeholder="How will funds be allocated? Provide a breakdown"
                  className="mt-1.5 min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shippingInfo">Shipping Information</Label>
                  <Textarea
                    id="shippingInfo"
                    value={formData.shippingInfo}
                    onChange={(e) => updateFormData("shippingInfo", e.target.value)}
                    placeholder="Shipping details, regions, and estimated costs"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="returnPolicy">Return Policy</Label>
                  <Textarea
                    id="returnPolicy"
                    value={formData.returnPolicy}
                    onChange={(e) => updateFormData("returnPolicy", e.target.value)}
                    placeholder="Your return and refund policy"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
                <Input
                  id="estimatedDelivery"
                  value={formData.estimatedDelivery}
                  onChange={(e) => updateFormData("estimatedDelivery", e.target.value)}
                  placeholder="e.g., Q2 2024"
                  className="mt-1.5"
                />
              </div>
            </div>
          )}

          {/* Step 6: Review & Launch */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Project Summary
                </h3>
                
                <div className="grid gap-4">
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Title</span>
                    <span className="font-medium">{formData.title || "Not set"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium">
                      {categories.find(c => c.value === formData.category)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Funding Goal</span>
                    <span className="font-medium">${formData.goal.toLocaleString()} {formData.currency}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-medium">{formData.campaignDuration} days</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Location</span>
                    <span className="font-medium">{formData.location || "Not set"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Reward Tiers</span>
                    <span className="font-medium">{formData.rewards.length}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Team Members</span>
                    <span className="font-medium">{formData.team.length}</span>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={(e) => updateFormData("termsAccepted", e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                  I agree to the GrowthStarter Terms of Service and Community Guidelines. 
                  I understand that my project will be reviewed before going live, and I commit 
                  to delivering on my promises to backers.
                </label>
              </div>

              {/* Launch Notice */}
              <div className="bg-[#0F7377]/10 border border-[#0F7377]/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Rocket className="h-5 w-5 text-[#0F7377] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#0F7377]">Ready to Launch?</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Your project will be submitted for review. Our team typically reviews 
                      projects within 24-48 hours. You&apos;ll receive an email once approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < TOTAL_STEPS ? (
            <Button onClick={nextStep} className="gs-gradient text-white">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!formData.termsAccepted}
              className="gs-gradient text-white"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Submit for Review
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

