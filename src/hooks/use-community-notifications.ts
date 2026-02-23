"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getCommunityNotifications,
  addCommunityNotification,
  markCommunityNotificationRead as markReadStorage,
  type CommunityNotification,
} from "@/data/community-notifications"

export function useCommunityNotifications() {
  const [notifications, setNotifications] = useState<CommunityNotification[]>([])

  const refresh = useCallback(() => {
    setNotifications(getCommunityNotifications())
  }, [])

  useEffect(() => {
    refresh()
    const onUpdate = () => refresh()
    window.addEventListener("storage", onUpdate)
    window.addEventListener("community-notifications-updated", onUpdate)
    return () => {
      window.removeEventListener("storage", onUpdate)
      window.removeEventListener("community-notifications-updated", onUpdate)
    }
  }, [refresh])

  const addNotification = useCallback(
    (payload: Parameters<typeof addCommunityNotification>[0]) => {
      const added = addCommunityNotification(payload)
      setNotifications((prev) => [added, ...prev])
      return added
    },
    []
  )

  const markAsRead = useCallback((id: string) => {
    markReadStorage(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    refresh,
  }
}
