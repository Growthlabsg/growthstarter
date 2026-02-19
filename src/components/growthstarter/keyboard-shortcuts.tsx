"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Keyboard,
  Search,
  Home,
  ArrowUp,
  Moon,
  Sun,
  Plus,
  Bell,
  BarChart3
} from "lucide-react"

interface KeyboardShortcut {
  keys: string[]
  description: string
  icon: React.ElementType
  category: 'navigation' | 'actions' | 'view'
}

const shortcuts: KeyboardShortcut[] = [
  { keys: ['/', 'Ctrl', 'K'], description: 'Focus search', icon: Search, category: 'navigation' },
  { keys: ['G', 'H'], description: 'Go to Home', icon: Home, category: 'navigation' },
  { keys: ['G', 'T'], description: 'Go to Trending', icon: ArrowUp, category: 'navigation' },
  { keys: ['Ctrl', 'Shift', 'D'], description: 'Toggle dark mode', icon: Moon, category: 'view' },
  { keys: ['C'], description: 'Create new project', icon: Plus, category: 'actions' },
  { keys: ['N'], description: 'Open notifications', icon: Bell, category: 'actions' },
  { keys: ['A'], description: 'Open analytics', icon: BarChart3, category: 'actions' },
  { keys: ['?'], description: 'Show keyboard shortcuts', icon: Keyboard, category: 'view' },
  { keys: ['Esc'], description: 'Close modal/dropdown', icon: Keyboard, category: 'view' },
]

interface KeyboardShortcutsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsDialogProps) {
  const navigationShortcuts = shortcuts.filter(s => s.category === 'navigation')
  const actionShortcuts = shortcuts.filter(s => s.category === 'actions')
  const viewShortcuts = shortcuts.filter(s => s.category === 'view')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-teal-500" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
              Navigation
            </h4>
            <div className="space-y-2">
              {navigationShortcuts.map((shortcut) => (
                <ShortcutRow key={shortcut.description} {...shortcut} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
              Actions
            </h4>
            <div className="space-y-2">
              {actionShortcuts.map((shortcut) => (
                <ShortcutRow key={shortcut.description} {...shortcut} />
              ))}
            </div>
          </div>

          {/* View */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
              View
            </h4>
            <div className="space-y-2">
              {viewShortcuts.map((shortcut) => (
                <ShortcutRow key={shortcut.description} {...shortcut} />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ShortcutRow({ keys, description, icon: Icon }: KeyboardShortcut) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <Icon className="h-4 w-4 text-slate-400" />
        {description}
      </div>
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <span key={i} className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-700 dark:text-slate-300">
              {key}
            </kbd>
            {i < keys.length - 1 && <span className="text-slate-400">+</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

interface UseKeyboardShortcutsProps {
  onSearch: () => void
  onGoHome: () => void
  onGoTrending: () => void
  onToggleDarkMode: () => void
  onCreateProject: () => void
  onOpenNotifications: () => void
  onOpenAnalytics: () => void
  onShowShortcuts: () => void
}

export function useKeyboardShortcuts({
  onSearch,
  onGoHome,
  onGoTrending,
  onToggleDarkMode,
  onCreateProject,
  onOpenNotifications,
  onOpenAnalytics,
  onShowShortcuts
}: UseKeyboardShortcutsProps) {
  const [lastKey, setLastKey] = useState<string | null>(null)
  const [lastKeyTime, setLastKeyTime] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      const now = Date.now()
      const isSequence = now - lastKeyTime < 500

      // Ctrl/Cmd + K - Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        onSearch()
        return
      }

      // / - Search
      if (e.key === '/') {
        e.preventDefault()
        onSearch()
        return
      }

      // Ctrl/Cmd + Shift + D - Dark mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        onToggleDarkMode()
        return
      }

      // ? - Show shortcuts
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault()
        onShowShortcuts()
        return
      }

      // G + H - Go Home (sequence)
      if (e.key.toLowerCase() === 'g') {
        setLastKey('g')
        setLastKeyTime(now)
        return
      }

      if (e.key.toLowerCase() === 'h' && lastKey === 'g' && isSequence) {
        e.preventDefault()
        onGoHome()
        setLastKey(null)
        return
      }

      // G + T - Go Trending (sequence)
      if (e.key.toLowerCase() === 't' && lastKey === 'g' && isSequence) {
        e.preventDefault()
        onGoTrending()
        setLastKey(null)
        return
      }

      // Single key shortcuts
      switch (e.key.toLowerCase()) {
        case 'c':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            onCreateProject()
          }
          break
        case 'n':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            onOpenNotifications()
          }
          break
        case 'a':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            onOpenAnalytics()
          }
          break
      }

      // Reset sequence if not matching
      if (e.key.toLowerCase() !== 'g') {
        setLastKey(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lastKey, lastKeyTime, onSearch, onGoHome, onGoTrending, onToggleDarkMode, onCreateProject, onOpenNotifications, onOpenAnalytics, onShowShortcuts])
}

