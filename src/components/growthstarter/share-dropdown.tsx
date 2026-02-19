"use client"

import { useState } from "react"
import { Project } from "@/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link,
  Mail,
  MessageCircle,
  Check,
  Copy
} from "lucide-react"
import { toast } from "sonner"

interface ShareDropdownProps {
  project: Project
  className?: string
  variant?: "icon" | "button"
}

export function ShareDropdown({ project, className = "", variant = "icon" }: ShareDropdownProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/campaign/${project.id}`
    : `/campaign/${project.id}`
  
  const shareText = `Check out "${project.title}" on GrowthStarter! ${project.shortDescription}`

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(`Check out: ${project.title}`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
  }

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  const handleShare = (platform: keyof typeof shareLinks) => (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer,width=600,height=400')
    toast.success(`Opening ${platform}...`)
  }

  // Try native share API first (mobile)
  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.shortDescription,
          url: shareUrl
        })
        toast.success("Shared successfully!")
      } catch (err) {
        // User cancelled or error
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        {variant === "icon" ? (
          <button className={`p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors ${className}`}>
            <Share2 className="h-4 w-4 text-slate-600" />
          </button>
        ) : (
          <Button variant="outline" size="sm" className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52" onClick={(e) => e.stopPropagation()}>
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-slate-900">Share this project</p>
          <p className="text-xs text-slate-500 truncate">{project.title}</p>
        </div>
        <DropdownMenuSeparator />
        
        {/* Social Share Options */}
        <DropdownMenuItem onClick={handleShare('twitter')} className="cursor-pointer">
          <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare('facebook')} className="cursor-pointer">
          <Facebook className="h-4 w-4 mr-2 text-[#4267B2]" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare('linkedin')} className="cursor-pointer">
          <Linkedin className="h-4 w-4 mr-2 text-[#0077B5]" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare('whatsapp')} className="cursor-pointer">
          <MessageCircle className="h-4 w-4 mr-2 text-[#25D366]" />
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare('email')} className="cursor-pointer">
          <Mail className="h-4 w-4 mr-2 text-slate-600" />
          Share via Email
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Copy Link */}
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-emerald-500" />
              <span className="text-emerald-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2 text-slate-600" />
              Copy Link
            </>
          )}
        </DropdownMenuItem>

        {/* Native Share (Mobile) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
              <Share2 className="h-4 w-4 mr-2 text-slate-600" />
              More options...
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

