"use client"

import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Cog, 
  LogOut, 
  LayoutDashboard, 
  CreditCard, 
  BookOpen, 
  Home,
  BarChart3,
  Star,
  User2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  MessageCircle,
  BookA,
  Trophy
} from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { GraduationCap } from "lucide-react"
import PrepsyLogo from "@/components/PrepsyLogo"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import IntegratedLogin from "./IntegratedLogin"
import ProfileAvatar from "@/components/ProfileAvatar"

interface SideBarContentProps {
  currentSelectedDocumentId?: string | null
  userPlan?: string
  createDocument?: () => void
  logout?: () => void
  editingDocumentId?: string | null
  setEditingDocumentId?: (id: string | null) => void
  selectedDocumentId?: string | null
  setSelectedDocumentId?: (id: string | null) => void
  deleteDocumentDialogOpen?: boolean
  setDeleteDocumentDialogOpen?: (open: boolean) => void
  newDocumentTitle?: string
  setNewDocumentTitle?: (title: string) => void
  updateDocumentTitle?: (id: string, title: string) => void
  sortedDocuments?: any[]
  userData?: any
  isActive?: (path: string) => boolean
  setCurrentSelectedDocumentId?: (id: string | null) => void
  isCollapsed?: boolean
  setIsCollapsed?: (collapsed: boolean) => void
  isAuthenticated?: boolean
  onAuthSuccess?: () => void
}

const SideBarContent = ({
  logout,
  isCollapsed = false,
  setIsCollapsed,
  isAuthenticated = true,
  onAuthSuccess,
  userData
}: SideBarContentProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createSupabaseBrowserClient()

  const isAdmin = userData?.admin === true

  const handleDiscordClick = () => {
    window.open('https://discord.gg/Zwg47nxxcG', '_blank')
  }

  const handleSettingsClick = () => {
    router.push('/dashboard/settings')
  }

  const handleLogout = async () => {
    try {
      // Attempt client-side sign out; ignore failure
      await supabase.auth.signOut().catch(() => {})
    } finally {
      // Always hit server route to clear any HttpOnly cookies and redirect
      router.push('/auth/logout')
    }
  }



  const navigationItems = [
    {
      title: "Home",
      icon: Home,
      href: "/dashboard/home",
      color: "text-gray-700",
      isBeta: false
    },
    {
      title: "Question Bank",
      icon: GraduationCap,
      href: "/dashboard/question-bank",
      color: "text-gray-700",
      isBeta: false
    },
    {
      title: "Vocabulary",
      icon: BookA,
      href: "/dashboard/vocabulary",
      color: "text-gray-700",
      isBeta: false
    },
    {
      title: "Mock Exams",
      icon: Trophy,
      href: "/dashboard/mock-exams",
      color: "text-gray-700",
      isBeta: !isAdmin
    },
    // {
    //   title: "Free Response",
    //   icon: FileText,
    //   href: "/dashboard/question-bank?type=frq",
    //   color: "text-gray-700",
    //   isBeta: false
    // },
    {
      title: "Courses",
      icon: BookOpen,
      href: "/dashboard/courses",
      color: "text-gray-700",
      isBeta: false
    },
    {
      title: "Stats",
      icon: BarChart3,
      href: "/dashboard/studyhub",
      color: "text-gray-700",
      isBeta: !isAdmin
    },
    {
      title: "Free Tutoring",
      icon: FaDiscord,
      href: "https://discord.gg/Zwg47nxxcG",
      color: "text-gray-700",
      isBeta: false
    },
    {
      title: "Feature Request",
      icon: Lightbulb,
      href: "/dashboard/feature-request",
      color: "text-gray-700",
      isBeta: false
    }
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const NavButton = ({ item, active }: { item: any; active: boolean }) => {
    const Icon = item.icon
    
    // Special handling for Discord button
    if (item.title === "Discord") {
      const button = (
        <Button
          variant="ghost"
          onClick={() => window.open(item.href, '_blank')}
          className="w-full justify-start gap-4 px-4 py-4 text-base font-medium rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
          <div className={cn(
            "relative z-10 flex items-center gap-4",
            isCollapsed ? "justify-center w-full" : ""
          )}>
            <Icon className="text-gray-700 h-8 w-8" />
            {!isCollapsed && <span className="font-medium">Discord</span>}
          </div>

        </Button>
      )
      
      if (isCollapsed) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {button}
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-900 text-white">
                Discord
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
      
      return button
    }
    
    // Regular styling for other buttons
    const button = (
      <Button
        variant="ghost"
        onClick={() => {
          router.push(item.href)
        }}
        className={cn(
          "w-full justify-start gap-4 px-4 py-4 text-base font-medium rounded-xl",
          active
            ? "bg-green-50 text-green-700 shadow-sm hover:bg-green-50 hover:text-green-700"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <div className={cn(
          "relative z-10 flex items-center gap-4",
          isCollapsed ? "justify-center w-full" : ""
        )}>
          <Icon className={cn(item.color, item.title === "Question Bank" ? "h-12 w-12 stroke-[2]" : "h-8 w-8")} />
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.title}</span>
              {item.isBeta && (
                <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                  Beta
                </span>
              )}
            </div>
          )}
        </div>


      </Button>
    )

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white">
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  }

  // Always show the normal sidebar - login is handled in main content area

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Header with Logo */}
      <div className="flex h-24 items-center justify-between px-6 bg-white relative">
        <div className={cn(
          "flex items-center transition-all duration-300",
          isCollapsed ? "justify-center w-full" : "justify-center"
        )}>
          <PrepsyLogo className="" collapsed={isCollapsed} />
        </div>
      </div>

      {/* Collapse Button - Positioned on the edge */}
      <div className="absolute -right-3 top-6 z-50">
        <TooltipProvider> 
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed?.(!isCollapsed)}
                className={cn(
                  "h-6 w-6 bg-white border border-gray-200 rounded-full text-gray-500 shadow-sm",
                  isCollapsed ? "rotate-180" : ""
                )}
              >
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white">
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-3 space-y-3">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const active = isActive(item.href)
            return <NavButton key={item.title} item={item} active={active} />
          })}
        </nav>

        {/* Ask Prof. Coco Section */}
        <div className={cn("mt-6 transition-all duration-300", isCollapsed ? "px-1" : "px-4")}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/ask-pearson')}
                  className={cn(
                    "w-full justify-start gap-4 px-4 py-4 text-base font-medium rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm hover:bg-yellow-100",
                    isCollapsed ? "justify-center" : ""
                  )}
                >
                  <div className={cn(
                    "relative z-10 flex items-center gap-4",
                    isCollapsed ? "justify-center w-full" : ""
                  )}>
                    <MessageCircle className="h-7 w-7 text-yellow-600" />
                    {!isCollapsed && <span className="font-medium">Ask Pearson!</span>}
                  </div>

                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-gray-900 text-white">
                  Ask Pearson!
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
        {/* Upgrade */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => router.push('/upgrade-new')}
                className={cn(
                  "w-full justify-start gap-4 px-4 py-4 text-base font-bold rounded-xl shadow-lg",
                  "bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 text-white border-0",
                  "hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 hover:text-white",
                  isCollapsed ? "justify-center" : ""
                )}
              >

                
                <div className={cn(
                  "relative z-10 flex items-center gap-4",
                  isCollapsed ? "justify-center w-full" : ""
                )}>
                  <CreditCard className="text-white drop-shadow-sm h-8 w-8" />
                  {!isCollapsed && <span className="font-bold">Upgrade</span>}
                </div>
                

              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-300">
                <p className="font-semibold">Upgrade to Premium</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Profile */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={handleSettingsClick}
                className={cn(
                  "w-full justify-start gap-4 px-4 py-3 text-base font-medium text-gray-700 rounded-lg",
                  isCollapsed ? "justify-center" : ""
                )}
              >
                <ProfileAvatar userData={userData} className="shadow-sm" />
                {!isCollapsed && <span>Profile</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-gray-900 text-white">
                Profile
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Login/Logout Button */}
        {isAuthenticated ? (
          <Button
            variant="default"
            onClick={handleLogout}
            className={cn(
              "w-full justify-center gap-3 px-4 py-3 text-base font-medium bg-blue-600 text-white rounded-lg shadow-sm",
              isCollapsed ? "px-3" : ""
            )}
          >
            <LogOut className="h-6 w-6" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => {
              const supabase = createSupabaseBrowserClient();
              const isLocalhost = location.hostname === 'localhost' || 
                                 location.hostname === '127.0.0.1' ||
                                 location.origin.includes('localhost');
              
              let redirectOrigin = location.origin;
              if (isLocalhost) {
                redirectOrigin = 'http://localhost:3000';
              }
              
              const redirectUrl = `${redirectOrigin}/auth/callback`;
              
              supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: redirectUrl,
                },
              });
            }}
            className={cn(
              "w-full justify-center gap-3 px-4 py-3 text-base font-medium bg-blue-600 text-white rounded-lg shadow-sm",
              isCollapsed ? "px-3" : ""
            )}
          >
            <LogOut className="h-6 w-6" />
            {!isCollapsed && <span>Login</span>}
          </Button>
        )}
      </div>


    </div>
  )
}

export default SideBarContent
