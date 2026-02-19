"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Notification } from "@/types"
import {
  Bell,
  DollarSign,
  MessageCircle,
  Target,
  FileText,
  Info,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink
} from "lucide-react"

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
}

const notificationIcons: Record<Notification['type'], React.ElementType> = {
  backer: DollarSign,
  comment: MessageCircle,
  milestone: Target,
  update: FileText,
  system: Info
}

const notificationColors: Record<Notification['type'], string> = {
  backer: 'bg-green-100 text-green-600',
  comment: 'bg-blue-100 text-blue-600',
  milestone: 'bg-purple-100 text-purple-600',
  update: 'bg-orange-100 text-orange-600',
  system: 'bg-slate-100 text-slate-600'
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !n.read
    return n.type === activeTab
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#0F7377]" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
              )}
            </DialogTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-sm text-[#0F7377] hover:text-[#0F7377]/80"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start px-4 bg-transparent border-b rounded-none h-auto py-0">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#0F7377] rounded-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="unread"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#0F7377] rounded-none"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger 
              value="backer"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#0F7377] rounded-none"
            >
              Backers
            </TabsTrigger>
            <TabsTrigger 
              value="comment"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#0F7377] rounded-none"
            >
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="m-0">
            <div className="max-h-[50vh] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredNotifications.map((notification) => {
                    const Icon = notificationIcons[notification.type]
                    const colorClass = notificationColors[notification.type]
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className={`font-medium ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-sm text-slate-500 mt-0.5">
                                  {notification.message}
                                </p>
                                {notification.projectTitle && (
                                  <p className="text-xs text-[#0F7377] mt-1">
                                    {notification.projectTitle}
                                  </p>
                                )}
                              </div>
                              {notification.urgent && (
                                <Badge variant="destructive" className="text-xs">Urgent</Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-slate-400">
                                {formatDate(notification.date)}
                              </span>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onMarkAsRead(notification.id)}
                                    className="h-7 px-2 text-xs"
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Mark read
                                  </Button>
                                )}
                                {notification.actionUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-[#0F7377]"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    {notification.actionLabel || 'View'}
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDelete(notification.id)}
                                  className="h-7 px-2 text-xs text-slate-400 hover:text-red-500"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Mock notifications generator
export function generateMockNotifications(): Notification[] {
  return [
    {
      id: "n1",
      type: "backer",
      title: "New backer!",
      message: "John D. just pledged $149 to your project",
      date: new Date(Date.now() - 5 * 60000).toISOString(),
      read: false,
      urgent: false,
      projectId: "proj_001",
      projectTitle: "EcoTech Smart Home Hub"
    },
    {
      id: "n2",
      type: "milestone",
      title: "75% Funded! 🎉",
      message: "Your project has reached 75% of its funding goal",
      date: new Date(Date.now() - 30 * 60000).toISOString(),
      read: false,
      urgent: false,
      projectId: "proj_001",
      projectTitle: "EcoTech Smart Home Hub"
    },
    {
      id: "n3",
      type: "comment",
      title: "New comment",
      message: "Sarah asked: 'Does this work with Apple HomeKit?'",
      date: new Date(Date.now() - 2 * 3600000).toISOString(),
      read: false,
      urgent: false,
      projectId: "proj_001",
      projectTitle: "EcoTech Smart Home Hub",
      actionUrl: "#",
      actionLabel: "Reply"
    },
    {
      id: "n4",
      type: "backer",
      title: "3 new backers!",
      message: "Your project received 3 new pledges totaling $267",
      date: new Date(Date.now() - 5 * 3600000).toISOString(),
      read: true,
      urgent: false,
      projectId: "proj_001",
      projectTitle: "EcoTech Smart Home Hub"
    },
    {
      id: "n5",
      type: "system",
      title: "Campaign ending soon",
      message: "Your campaign ends in 3 days. Consider sending an update!",
      date: new Date(Date.now() - 24 * 3600000).toISOString(),
      read: true,
      urgent: true,
      projectId: "proj_001",
      projectTitle: "EcoTech Smart Home Hub"
    },
    {
      id: "n6",
      type: "update",
      title: "Update posted",
      message: "Your update 'Production update' was published successfully",
      date: new Date(Date.now() - 48 * 3600000).toISOString(),
      read: true,
      urgent: false,
      projectId: "proj_001",
      projectTitle: "EcoTech Smart Home Hub"
    }
  ]
}

