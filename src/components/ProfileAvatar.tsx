"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { cn } from "@/lib/utils"

interface ProfileAvatarProps {
  className?: string
  size?: "sm" | "md" | "lg"
  userData?: any
}

export default function ProfileAvatar({ 
  className, 
  size = "md", 
  userData 
}: ProfileAvatarProps) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [userInitials, setUserInitials] = useState<string>("A")
  const [isLoading, setIsLoading] = useState(true)

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  }

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      try {
        const supabase = createSupabaseBrowserClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Get profile image from Google OAuth metadata
          const avatarUrl = session.user.user_metadata?.avatar_url || 
                           session.user.user_metadata?.picture
          
          if (avatarUrl) {
            setProfileImageUrl(avatarUrl)
          }

          // Generate initials from user data
          const name = session.user.user_metadata?.full_name || 
                      userData?.name || 
                      session.user.email
          
          if (name) {
            const initials = name
              .split(' ')
              .map((word: string) => word.charAt(0).toUpperCase())
              .slice(0, 2)
              .join('')
            setUserInitials(initials || 'A')
          }
        }
      } catch (error) {
        console.error('Error fetching user profile image:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfileImage()
  }, [userData])

  if (isLoading) {
    return (
      <div className={cn(
        "rounded-full bg-gray-200 animate-pulse",
        sizeClasses[size],
        className
      )} />
    )
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {profileImageUrl && (
        <AvatarImage 
          src={profileImageUrl} 
          alt="Profile picture"
          className="object-cover"
        />
      )}
      <AvatarFallback className="bg-blue-600 text-white text-base font-medium">
        {userInitials}
      </AvatarFallback>
    </Avatar>
  )
}
