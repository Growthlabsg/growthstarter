"use client"

import { useState, useEffect, useMemo } from "react"
import { Toaster, toast } from "sonner"
import { Project, SortOption, FilterOption, ProjectFormData, Notification, Reward } from "@/types"
import { mockProjects } from "@/data/mock-projects"
import { Header } from "@/components/growthstarter/header"
import { SearchFilters } from "@/components/growthstarter/search-filters"
import { ProjectCard } from "@/components/growthstarter/project-card"
import { ProjectDetailModal } from "@/components/growthstarter/project-detail-modal"
import { CreateProjectModal } from "@/components/growthstarter/create-project-modal"
import { PledgeModal } from "@/components/growthstarter/pledge-modal"
import { NotificationCenter, generateMockNotifications } from "@/components/growthstarter/notification-center"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// keep this as backup

