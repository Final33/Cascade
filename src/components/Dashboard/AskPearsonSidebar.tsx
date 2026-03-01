"use client"

import { useState } from "react"
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
  Plus,
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

import type { ChatSession } from "@/types/chat"
import ChatSessionItem from "./ChatSessionItem"
import ProfileAvatar from "@/components/ProfileAvatar"

interface AskPearsonSidebarProps {
  chatSessions: ChatSession[]
  currentSession: ChatSession | null
  onSelectSession: (session: ChatSession) => void
  onNewChat: () => void
  onRenameChat: (sessionId: string, newTitle: string) => void
  onDeleteChat: (sessionId: string) => void
  userData?: any
  userPlan?: string
}

export default function AskPearsonSidebar({
  chatSessions,
  currentSession,
  onSelectSession,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  userData,
  userPlan
}: AskPearsonSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<'navigation' | 'chat'>('chat')

  const isAdmin = userData?.admin === true

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut().catch(() => {})
    } finally {
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
    {
      title: "Free Response",
      icon: FileText,
      href: "/dashboard/question-bank?type=frq",
      color: "text-gray-700",
      isBeta: false
    },
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
      title: "Feature Request",
      icon: Lightbulb,
      href: "/dashboard/feature-request",
      color: "text-gray-700",
      isBeta: false
    },
    {
      title: "Free Tutoring",
      icon: FaDiscord,
      href: "https://discord.gg/Zwg47nxxcG",
      color: "text-gray-700",
      isBeta: false
    }
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    if (href === "/ask-pearson") {
      return pathname === "/ask-pearson"
    }
    return pathname.startsWith(href)
  }



  return (
    <div className="w-80 flex h-full flex-col bg-white border-r border-gray-200">
      {/* Header with Logo */}
      <div className="flex h-24 items-center justify-between px-6 bg-white relative">
        <div className="flex items-center justify-center transition-all duration-300">
          <PrepsyLogo className="" collapsed={false} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/home')}
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Two-tab navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('navigation')}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'navigation'
                ? "text-green-600 border-green-500 bg-green-50"
                : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
            )}
          >
            Navigation
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'chat'
                ? "text-green-600 border-green-500 bg-green-50"
                : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
            )}
          >
            Chat History
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'navigation' ? (
          /* Navigation Section */
          <div className="flex-1 px-4 py-3 space-y-3">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const active = isActive(item.href)
                
                // Special handling for Discord button
                if (item.title === "Discord") {
                  return (
                    <Button
                      key={item.title}
                      variant="ghost"
                      onClick={() => window.open(item.href, '_blank')}
                      className="w-full justify-start gap-4 px-4 py-4 text-base font-medium rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <div className="relative z-10 flex items-center gap-4">
                        <item.icon className=" text-gray-700 h-8 w-8" />
                        <span className="font-medium">Discord</span>
                      </div>

                    </Button>
                  )
                }
                
                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    onClick={() => router.push(item.href)}
                    className={cn(
                      "w-full justify-start gap-4 px-4 py-4 text-base font-medium rounded-xl",
                      active
                        ? "bg-green-50 text-green-700 shadow-sm hover:bg-green-50 hover:text-green-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )} 
                  >
                    <div className="relative z-10 flex items-center gap-4">
                      <item.icon className={cn("", item.color, item.title === "Question Bank" ? "h-12 w-12 stroke-[2]" : "h-8 w-8")} />
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.title}</span>
                        {item.isBeta && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                            Beta
                          </span>
                        )}
                      </div>
                    </div>


                  </Button>
                )
              })}
            </nav>

            {/* Ask Pearson Section - Highlighted */}
            <div className="mt-6 px-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/ask-pearson')}
                className="w-full justify-start gap-4 px-4 py-4 text-base font-medium rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm hover:bg-yellow-100"
              >
                <div className="relative z-10 flex items-center gap-4">
                  <MessageCircle className="h-7 w-7 text-yellow-600" />
                  <span className="font-medium">Ask Pearson!</span>
                </div>

              </Button>
            </div>
          </div>
        ) : (
          /* Chat History Section */
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Chat History</h3>
                <Button
                  onClick={onNewChat}
                  size="sm"
                  className="bg-yellow-600  text-white h-8 px-3 rounded-lg shadow-sm  "
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Chat
                </Button>
              </div>
              
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <ChatSessionItem
                    key={session.id}
                    session={session}
                    isSelected={currentSession?.id === session.id}
                    onSelect={onSelectSession}
                    onRename={onRenameChat}
                    onDelete={onDeleteChat}
                  />
                ))}
                {chatSessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No chat history yet</p>
                    <p className="text-xs">Start a conversation to see your chats here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
        {/* Upgrade */}
        <Button
          variant="ghost"
          onClick={() => router.push('/upgrade-new')}
          className="w-full justify-start gap-4 px-4 py-4 text-base font-bold rounded-xl shadow-lg bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 text-white border-0 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 hover:text-white"
        >

          
          <div className="relative z-10 flex items-center gap-4">
            <CreditCard className=" text-white drop-shadow-sm h-8 w-8" />
            <span className="font-bold">Upgrade</span>
          </div>
          

        </Button>

        {/* Profile */}
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/settings')}
          className="w-full justify-start gap-4 px-4 py-3 text-base font-medium text-gray-700  rounded-lg  "
        >
          <ProfileAvatar userData={userData} className="shadow-sm" />
          <span>Profile</span>
        </Button>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          className="w-full justify-center gap-3 px-4 py-3 text-base font-medium bg-blue-600 text-white  rounded-lg  shadow-sm  "
        >
          <LogOut className="h-6 w-6" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}
