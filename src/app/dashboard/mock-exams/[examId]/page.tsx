"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  AlertCircle,
  CheckCircle,
  X,
  ArrowLeft,
  Timer
} from "lucide-react"
import { cn } from "@/lib/utils"
import BetaGate from "@/components/Dashboard/BetaGate"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"

interface Question {
  id: string
  type: "multiple-choice" | "free-response"
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
  topic: string
}

interface MockExamData {
  id: string
  title: string
  subject: string
  duration: number
  questions: Question[]
  instructions: string
}

// Sample exam data - in real app this would come from API
const examData: Record<string, MockExamData> = {
  "calc-mock-1": {
    id: "calc-mock-1",
    title: "Calculus Mock 1",
    subject: "AP Calculus AB",
    duration: 195,
    instructions: "This exam consists of two sections. Section I contains 30 multiple-choice questions and Section II contains 6 free-response questions. You have 3 hours and 15 minutes to complete the entire exam.",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is the derivative of f(x) = 3x² + 2x - 5?",
        options: ["6x + 2", "6x - 2", "3x + 2", "6x² + 2x"],
        correctAnswer: "6x + 2",
        points: 1,
        topic: "Derivatives"
      },
      {
        id: "q2", 
        type: "multiple-choice",
        question: "Find the limit: lim(x→2) (x² - 4)/(x - 2)",
        options: ["0", "2", "4", "undefined"],
        correctAnswer: "4",
        points: 1,
        topic: "Limits"
      },
      {
        id: "q3",
        type: "free-response", 
        question: "A particle moves along the x-axis with velocity v(t) = 3t² - 12t + 9 for t ≥ 0. Find the position function s(t) if s(0) = 5.",
        points: 4,
        topic: "Integration"
      }
    ]
  },
  "cs-mock-1": {
    id: "cs-mock-1", 
    title: "CS A Mock 1",
    subject: "AP Computer Science A",
    duration: 180,
    instructions: "This exam consists of two sections. Section I contains 40 multiple-choice questions and Section II contains 4 free-response questions. You have 3 hours to complete the entire exam.",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Which of the following correctly declares an integer variable in Java?",
        options: ["int x;", "integer x;", "Int x;", "var x;"],
        correctAnswer: "int x;",
        points: 1,
        topic: "Primitive Types"
      },
      {
        id: "q2",
        type: "multiple-choice", 
        question: "What is the output of the following code?\n\nint[] arr = {1, 2, 3, 4, 5};\nSystem.out.println(arr.length);",
        options: ["4", "5", "6", "Error"],
        correctAnswer: "5",
        points: 1,
        topic: "Arrays"
      }
    ]
  }
}

export default function MockExamPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.examId as string
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isExamStarted, setIsExamStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const exam = examData[examId]

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

  useEffect(() => {
    if (exam && isExamStarted) {
      setTimeRemaining(exam.duration * 60) // Convert minutes to seconds
    }
  }, [exam, isExamStarted])

  useEffect(() => {
    if (timeRemaining > 0 && isExamStarted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && isExamStarted) {
      handleSubmitExam()
    }
  }, [timeRemaining, isExamStarted])

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Exam Not Found</h1>
          <Button onClick={() => router.push("/dashboard/mock-exams")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mock Exams
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = exam.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
  }

  const handleFlagQuestion = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id)
      } else {
        newSet.add(currentQuestion.id)
      }
      return newSet
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitExam = () => {
    // TODO: Submit exam results
    router.push("/dashboard/mock-exams")
  }

  const startExam = () => {
    setShowInstructions(false)
    setIsExamStarted(true)
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-6">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-lg">
                    <Timer className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      {exam.title}
                    </CardTitle>
                    <p className="text-lg text-gray-600 mt-1">{exam.subject}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Exam Instructions
                  </h3>
                  <p className="text-blue-800 leading-relaxed">
                    {exam.instructions}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">Duration</p>
                    <p className="text-gray-600">{Math.floor(exam.duration / 60)}h {exam.duration % 60}m</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">Questions</p>
                    <p className="text-gray-600">{exam.questions.length} total</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Flag className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">Format</p>
                    <p className="text-gray-600">AP Style</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Important:</strong> Once you start the exam, the timer will begin and cannot be paused. 
                    Make sure you have a quiet environment and stable internet connection.
                  </p>
                </div>

                <div className="flex gap-4 justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/mock-exams")}
                    className="px-6"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={startExam}
                    className="px-8 bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg hover:shadow-xl"
                  >
                    Start Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const examContent = (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">{exam.title}</h1>
              <Badge variant="outline" className="text-sm">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </Badge>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-lg font-mono">
                <Clock className="h-5 w-5 text-gray-600" />
                <span className={cn(
                  "font-semibold",
                  timeRemaining < 300 ? "text-red-600" : "text-gray-900"
                )}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              <Button
                variant="outline"
                onClick={handleSubmitExam}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Submit Exam
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {currentQuestion.topic}
                  </Badge>
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1}
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      ({currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'})
                    </span>
                  </CardTitle>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFlagQuestion}
                  className={cn(
                    "gap-2",
                    flaggedQuestions.has(currentQuestion.id)
                      ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                      : ""
                  )}
                >
                  <Flag className="h-4 w-4" />
                  {flaggedQuestions.has(currentQuestion.id) ? "Flagged" : "Flag"}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.question}
                </p>
              </div>

              {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index) // A, B, C, D
                    const isSelected = answers[currentQuestion.id] === option
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:bg-gray-50",
                          isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-900"
                            : "border-gray-200 text-gray-900"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                            isSelected
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          )}>
                            {letter}
                          </div>
                          <span className="flex-1 whitespace-pre-wrap">{option}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {currentQuestion.type === "free-response" && (
                <div className="space-y-4">
                  <textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-600">
                    Show all work and explain your reasoning clearly.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {exam.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={cn(
                    "w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200",
                    index === currentQuestionIndex
                      ? "bg-blue-600 text-white shadow-lg"
                      : answers[exam.questions[index].id]
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : flaggedQuestions.has(exam.questions[index].id)
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === exam.questions.length - 1}
              className="gap-2 bg-blue-600 text-white"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <BetaGate featureName="Mock Exams" className="h-screen" isAdmin={isAdmin}>
      {examContent}
    </BetaGate>
  )
}
