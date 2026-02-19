"use client"

import { useState, useEffect, useRef } from "react"
import { Project } from "@/types"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  X,
  Clock,
  TrendingUp,
  User,
  Tag,
  ArrowRight,
  Sparkles
} from "lucide-react"
import Image from "next/image"

interface SearchAutocompleteProps {
  projects: Project[]
  searchTerm: string
  onSearchChange: (value: string) => void
  onProjectSelect: (project: Project) => void
  recentSearches?: string[]
  onAddRecentSearch?: (term: string) => void
}

interface SearchSuggestion {
  type: 'project' | 'creator' | 'tag' | 'category'
  value: string
  project?: Project
  count?: number
}

export function SearchAutocomplete({
  projects,
  searchTerm,
  onSearchChange,
  onProjectSelect,
  recentSearches = [],
  onAddRecentSearch
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Generate suggestions based on search term
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([])
      return
    }

    const term = searchTerm.toLowerCase()
    const newSuggestions: SearchSuggestion[] = []

    // Search in projects
    const matchingProjects = projects
      .filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.shortDescription.toLowerCase().includes(term)
      )
      .slice(0, 3)

    matchingProjects.forEach(p => {
      newSuggestions.push({ type: 'project', value: p.title, project: p })
    })

    // Search in creators
    const creators = [...new Set(projects.map(p => p.creator.name))]
    const matchingCreators = creators
      .filter(c => c.toLowerCase().includes(term))
      .slice(0, 2)

    matchingCreators.forEach(c => {
      const count = projects.filter(p => p.creator.name === c).length
      newSuggestions.push({ type: 'creator', value: c, count })
    })

    // Search in tags
    const allTags = [...new Set(projects.flatMap(p => p.tags))]
    const matchingTags = allTags
      .filter(t => t.toLowerCase().includes(term))
      .slice(0, 3)

    matchingTags.forEach(t => {
      const count = projects.filter(p => p.tags.includes(t)).length
      newSuggestions.push({ type: 'tag', value: t, count })
    })

    // Search in categories
    const categories = [...new Set(projects.map(p => p.category))]
    const matchingCategories = categories
      .filter(c => c.toLowerCase().includes(term))
      .slice(0, 2)

    matchingCategories.forEach(c => {
      const count = projects.filter(p => p.category === c).length
      newSuggestions.push({ type: 'category', value: c, count })
    })

    setSuggestions(newSuggestions)
    setSelectedIndex(-1)
  }, [searchTerm, projects])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex])
        } else if (searchTerm) {
          onAddRecentSearch?.(searchTerm)
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'project' && suggestion.project) {
      onProjectSelect(suggestion.project)
    } else {
      onSearchChange(suggestion.value)
      onAddRecentSearch?.(suggestion.value)
    }
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const handleRecentSearch = (term: string) => {
    onSearchChange(term)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'project': return <Sparkles className="h-4 w-4 text-teal-500" />
      case 'creator': return <User className="h-4 w-4 text-blue-500" />
      case 'tag': return <Tag className="h-4 w-4 text-purple-500" />
      case 'category': return <TrendingUp className="h-4 w-4 text-orange-500" />
    }
  }

  const getTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'project': return 'Project'
      case 'creator': return 'Creator'
      case 'tag': return 'Tag'
      case 'category': return 'Category'
    }
  }

  const showDropdown = isOpen && (suggestions.length > 0 || (recentSearches.length > 0 && !searchTerm))

  return (
    <div className="relative flex-1 max-w-xl">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
      <Input
        ref={inputRef}
        placeholder="Search projects, creators, or tags..."
        value={searchTerm}
        onChange={(e) => {
          onSearchChange(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="pl-11 pr-10 h-11 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white dark:bg-slate-900 transition-all"
      />
      {searchTerm && (
        <button
          onClick={() => {
            onSearchChange("")
            inputRef.current?.focus()
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl dark:shadow-black/30 border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Recent Searches */}
          {!searchTerm && recentSearches.length > 0 && (
            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <Clock className="h-3 w-3" />
                Recent Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.slice(0, 5).map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handleRecentSearch(term)}
                    className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.value}`}
                  onClick={() => handleSelect(suggestion)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                    selectedIndex === index 
                      ? 'bg-teal-50 dark:bg-teal-900/30' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {suggestion.type === 'project' && suggestion.project ? (
                    <>
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={suggestion.project.image}
                          alt={suggestion.project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {suggestion.project.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          by {suggestion.project.creator.name} • {Math.round((suggestion.project.raised / suggestion.project.goal) * 100)}% funded
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {getIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {suggestion.value}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {getTypeLabel(suggestion.type)} • {suggestion.count} project{suggestion.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </>
                  )}
                  <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {searchTerm && suggestions.length === 0 && (
            <div className="p-4 text-center">
              <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No results found for &quot;{searchTerm}&quot;</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try different keywords</p>
            </div>
          )}

          {/* Search tip */}
          {searchTerm && suggestions.length > 0 && (
            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-mono">↵</kbd> to search, <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-mono">↑↓</kbd> to navigate
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

