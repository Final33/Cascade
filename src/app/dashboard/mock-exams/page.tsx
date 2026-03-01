"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import BetaGate from "@/components/Dashboard/BetaGate"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"

interface MockExam {
  id: string
  title: string
  subject: string
}

// Generate mock exams for all AP classes
const apClasses = [
  'AP Calculus AB',
  'AP Calculus BC', 
  'AP Precalculus',
  'AP Computer Science A',
  'AP Statistics',
  'AP World History',
  'AP US History',
  'AP European History',
  'AP US Government',
  'AP Human Geography',
  'AP Psychology',
  'AP Microeconomics',
  'AP Macroeconomics',
  'AP Chemistry',
  'AP Biology',
  'AP Environmental Science',
  'AP Physics 1',
  'AP Physics 2',
  'AP Physics C: Mechanics',
  'AP Physics C: Electricity and Magnetism',
  'AP English Language and Composition',
  'AP English Literature and Composition',
  'AP Art History'
]

const getShortName = (className: string): string => {
  const shortNames: Record<string, string> = {
    'AP Calculus AB': 'calc ab',
    'AP Calculus BC': 'calc bc',
    'AP Precalculus': 'precalc',
    'AP Computer Science A': 'csa',
    'AP Statistics': 'stats',
    'AP World History': 'world history',
    'AP US History': 'us history',
    'AP European History': 'euro history',
    'AP US Government': 'us gov',
    'AP Human Geography': 'human geo',
    'AP Psychology': 'psych',
    'AP Microeconomics': 'micro econ',
    'AP Macroeconomics': 'macro econ',
    'AP Chemistry': 'chem',
    'AP Biology': 'bio',
    'AP Environmental Science': 'enviro sci',
    'AP Physics 1': 'physics 1',
    'AP Physics 2': 'physics 2',
    'AP Physics C: Mechanics': 'physics c mech',
    'AP Physics C: Electricity and Magnetism': 'physics c e&m',
    'AP English Language and Composition': 'eng lang',
    'AP English Literature and Composition': 'eng lit',
    'AP Art History': 'art history'
  }
  return shortNames[className] || className.toLowerCase()
}

const mockExams: MockExam[] = []

// Generate 5 mock exams for each AP class
apClasses.forEach(apClass => {
  const shortName = getShortName(apClass)
  for (let i = 1; i <= 5; i++) {
    mockExams.push({
      id: `${shortName.replace(/\s+/g, '-')}-mock-${i}`,
      title: `${shortName} mock ${i}`,
      subject: apClass
    })
  }
})

// Organize subjects by category for better UX
const subjectCategories = {
  "All Subjects": ["All Subjects"],
  "Mathematics": [
    "AP Calculus AB",
    "AP Calculus BC", 
    "AP Precalculus",
    "AP Statistics"
  ],
  "Sciences": [
    "AP Biology",
    "AP Chemistry",
    "AP Environmental Science",
    "AP Physics 1",
    "AP Physics 2",
    "AP Physics C: Mechanics",
    "AP Physics C: Electricity and Magnetism"
  ],
  "History & Social Studies": [
    "AP World History",
    "AP US History",
    "AP European History",
    "AP US Government",
    "AP Human Geography",
    "AP Psychology"
  ],
  "Economics": [
    "AP Microeconomics",
    "AP Macroeconomics"
  ],
  "English": [
    "AP English Language and Composition",
    "AP English Literature and Composition"
  ],
  "Computer Science": [
    "AP Computer Science A"
  ],
  "Arts": [
    "AP Art History"
  ]
}

const subjects = ["All Subjects", ...apClasses]

export default function MockExamsPage() {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [isAdmin, setIsAdmin] = useState(false)

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

  const filteredExams = mockExams.filter(exam => {
    return selectedSubject === "All Subjects" || exam.subject === selectedSubject
  })

  const handleStartExam = (examId: string) => {
    router.push(`/dashboard/mock-exams/${examId}`)
  }

  const mockExamsContent = (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-green-50/15 to-cyan-50/20 pointer-events-none" />
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Mock Exams
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Practice with authentic AP-style exams designed to simulate the real testing experience
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-sm">
            <label htmlFor="class-select" className="block text-sm font-semibold text-gray-700 mb-3">
              Class:
            </label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent className="max-h-80 w-full">
                {Object.entries(subjectCategories).map(([category, subjects]) => (
                  <div key={category}>
                    {category !== "All Subjects" && (
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                        {category}
                      </div>
                    )}
                    {subjects.map((subject) => (
                      <SelectItem 
                        key={subject} 
                        value={subject} 
                        className="cursor-pointer"
                      >
                        {subject}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        {selectedSubject !== "All Subjects" && (
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-gray-600">
              {filteredExams.length} mock exams available for {selectedSubject}
            </p>
          </div>
        )}

        {/* Mock Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExams.map((exam) => (
            <Card 
              key={exam.id} 
              className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 text-center"
            >
              <CardContent className="p-0 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {exam.title}
                </h3>
                
                <Button
                  onClick={() => handleStartExam(exam.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"
                >
                  Start Exam
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <BetaGate featureName="Mock Exams" className="h-screen" isAdmin={isAdmin}>
      {mockExamsContent}
    </BetaGate>
  )
}
