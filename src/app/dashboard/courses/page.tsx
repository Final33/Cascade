"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import BetaGate from "@/components/Dashboard/BetaGate"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

const subjects = [
  { id: "precalculus", label: "Precalculus", active: true }
]

const precalculusTopics = [
  {
    id: 1,
    title: "Unit 1: Polynomial and Rational Functions",
    description: "Equivalent expressions, rates of change, and composition of polynomial and rational functions",
    color: "bg-white border-gray-200 text-gray-800",
    youtubeUrl: "https://www.youtube.com/watch?v=82pUuLgGtJo&list=PLwZ7hsYXWkb5JkVNBveNKYGlu-cckDkcX&index=45&t=372s"
  },
  {
    id: 2,
    title: "Unit 2: Exponential and Logarithmic Functions",
    description: "Equivalent expressions, rates of change, and composition of exponential and logarithmic functions",
    color: "bg-white border-gray-200 text-gray-800",
    youtubeUrl: "https://www.youtube.com/watch?v=2aQR3ihj59M&list=PLwZ7hsYXWkb5JkVNBveNKYGlu-cckDkcX&index=47"
  },
  {
    id: 3,
    title: "Unit 3: Trigonometric and Polar Functions",
    description: "Periodic phenomena, trigonometric functions, identities, and polar coordinate system",
    color: "bg-white border-gray-200 text-gray-800",
    youtubeUrl: "https://www.youtube.com/watch?v=ekO-vaPXgvI&list=PLwZ7hsYXWkb5JkVNBveNKYGlu-cckDkcX&index=48"
  },
  {
    id: 4,
    title: "Unit 4: Functions Involving Parameters, Vectors, and Matrices",
    description: "Parametric functions, vector operations, and matrix transformations",
    color: "bg-white border-gray-200 text-gray-800",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLwZ7hsYXWkb5JkVNBveNKYGlu-cckDkcX"
  }
]





export default function CoursesPage() {
  const [activeSubject, setActiveSubject] = useState("precalculus")
  const [isAdmin, setIsAdmin] = useState(false)
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createSupabaseBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: userData } = await supabase
            .from('users')
            .select('admin')
            .eq('uid', user.id)
            .single()
          
          setIsAdmin((userData as any)?.admin === true)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])

  const handleTopicClick = (topicId: number, subject: string) => {
    router.push(`/dashboard/courses/${subject}/${topicId}`)
  }

  const getCurrentTopics = () => {
    return precalculusTopics
  }

  const coursesContent = (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Subject Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 items-center">
            <div className="flex space-x-0 bg-gray-100 rounded-lg p-1 w-fit">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setActiveSubject(subject.id)}
                  className={cn(
                    "px-8 py-3 text-sm font-medium transition-all duration-200 first:rounded-l-md last:rounded-r-md",
                    activeSubject === subject.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  )}
                >
                  {subject.label}
                </button>
              ))}
            </div>
            
            {/* More Coming Soon Button */}
            <Dialog open={showComingSoonDialog} onOpenChange={setShowComingSoonDialog}>
              <DialogTrigger asChild>
                <button className="px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  More Coming Soon
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center">More Courses Coming Soon!</DialogTitle>
                </DialogHeader>
                <div className="text-center py-4">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    We are currently working on courses for all of your other favorite AP's! Interested in helping us out?
                  </p>
                  <p className="text-blue-600 font-medium">
                    Email us at <a href="aarnavtrivedi@gmail.com" className="underline">aarnavtrivedi@gmail.com</a>
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getCurrentTopics().map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleTopicClick(topic.id, activeSubject)}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                topic.color
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm">
                    {topic.id}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-1.5">{topic.title}</h3>
                  <p className="text-sm opacity-75 leading-snug">{topic.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return coursesContent
}
