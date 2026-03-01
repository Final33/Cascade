"use client"

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  BookOpen, 
  Lightbulb, 
  Save, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Search,
  ExternalLink,
  Maximize2,
  Minimize2,
  Timer,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
// Database FRQ types
interface DatabaseFRQQuestion {
  id: string
  subject: string
  unit: string
  topic: string
  question: string
  difficulty: string
  total_points: number
  time_limit: number
  exam_type: string
  year: number
  sample_response?: string
  stimulus_image_url?: string
  stimulus_image_description?: string
  stimulus_image_2_url?: string
  stimulus_image_2_description?: string
  parts: DatabaseFRQPart[] | string // Can be array or JSON string
}

interface DatabaseFRQPart {
  id?: string
  part_label: string
  part_question: string
  points: number
  hint?: string
  sample_answer?: string
  order_index: number
}

// Legacy local FRQ types for compatibility
interface FRQQuestion {
  id: string
  subject: string
  unit: string
  topic: string
  question: string
  difficulty: string
  totalPoints: number
  timeLimit: number
  examType: string
  year: number
  parts: FRQPart[]
  rubric?: any
  sampleResponse?: string
  stimulus_image_url?: string
  stimulus_image_description?: string
  stimulus_image_2_url?: string
  stimulus_image_2_description?: string
}

interface FRQPart {
  id: string
  label: string
  question: string
  points: number
  hint?: string
  sampleAnswer?: string
}
import { FRQGradingResults } from "./frq-grading-results"
import { cn } from "@/lib/utils"

interface FRQTestInterfaceProps {
  questions: (FRQQuestion | DatabaseFRQQuestion)[]
  startIndex?: number
  onClose: () => void
  onComplete?: (results: FRQTestResults) => void
}

interface FRQResponse {
  partId: string
  response: string
  timeSpent: number // in seconds
  wordCount: number
}

interface FRQTestResults {
  questionId: string
  responses: FRQResponse[]
  totalTimeSpent: number
  completed: boolean
}

// Helper function to normalize database and local FRQ questions
function normalizeFRQQuestion(question: FRQQuestion | DatabaseFRQQuestion): FRQQuestion {
  // Check if it's a database question
  if ('total_points' in question) {
    const dbQuestion = question as DatabaseFRQQuestion
    
    // Parse parts if they're stored as JSON string
    let parts: DatabaseFRQPart[] = []
    if (typeof dbQuestion.parts === 'string') {
      try {
        parts = JSON.parse(dbQuestion.parts)
      } catch (e) {
        console.error('Error parsing FRQ parts:', e)
        parts = []
      }
    } else {
      parts = dbQuestion.parts || []
    }
    
    // Convert to legacy format
    return {
      id: dbQuestion.id,
      subject: dbQuestion.subject,
      unit: dbQuestion.unit,
      topic: dbQuestion.topic,
      question: dbQuestion.question,
      difficulty: dbQuestion.difficulty,
      totalPoints: dbQuestion.total_points,
      timeLimit: dbQuestion.time_limit,
      examType: dbQuestion.exam_type,
      year: dbQuestion.year,
      sampleResponse: dbQuestion.sample_response,
      stimulus_image_url: dbQuestion.stimulus_image_url,
      stimulus_image_description: dbQuestion.stimulus_image_description,
      stimulus_image_2_url: dbQuestion.stimulus_image_2_url,
      stimulus_image_2_description: dbQuestion.stimulus_image_2_description,
      parts: parts.map(part => ({
        id: part.id || `${dbQuestion.id}-${part.part_label}`,
        label: part.part_label,
        question: part.part_question,
        points: part.points,
        hint: part.hint,
        sampleAnswer: part.sample_answer
      }))
    }
  }
  
  // Already in legacy format
  return question as FRQQuestion
}

export const FRQTestInterface: React.FC<FRQTestInterfaceProps> = ({
  questions,
  startIndex = 0,
  onClose,
  onComplete
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(startIndex)
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({})
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [partStartTime, setPartStartTime] = useState<number>(Date.now())
  const [showHints, setShowHints] = useState<Record<string, boolean>>({})
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Normalize questions to ensure consistent format
  const normalizedQuestions = questions.map(normalizeFRQQuestion)
  const [isGrading, setIsGrading] = useState(false)
  const [gradingResult, setGradingResult] = useState<any>(null)
  const [showGradingResults, setShowGradingResults] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Ensure component only renders on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const currentQuestion = normalizedQuestions[currentQuestionIndex]
  const currentPart = currentQuestion?.parts[currentPartIndex]
  const totalParts = currentQuestion?.parts.length || 0

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const currentPartId = `${currentQuestion?.id}-${currentPart?.id}`
      
      setTimeSpent(prev => ({
        ...prev,
        [currentPartId]: (prev[currentPartId] || 0) + 1
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [currentQuestion?.id, currentPart?.id])

  // Auto-save effect
  useEffect(() => {
    if (autoSave && currentPart) {
      const currentPartId = `${currentQuestion.id}-${currentPart.id}`
      const response = responses[currentPartId] || ''
      
      // Save to localStorage
      const saveKey = `frq-response-${currentPartId}`
      localStorage.setItem(saveKey, response)
    }
  }, [responses, currentQuestion?.id, currentPart?.id, autoSave])

  // Load saved responses
  useEffect(() => {
    if (currentPart) {
      const currentPartId = `${currentQuestion.id}-${currentPart.id}`
      const saveKey = `frq-response-${currentPartId}`
      const saved = localStorage.getItem(saveKey)
      
      if (saved && !responses[currentPartId]) {
        setResponses(prev => ({
          ...prev,
          [currentPartId]: saved
        }))
      }
    }
  }, [currentQuestion?.id, currentPart?.id])

  const handleResponseChange = (value: string) => {
    if (!currentPart) return
    
    const currentPartId = `${currentQuestion.id}-${currentPart.id}`
    setResponses(prev => ({
      ...prev,
      [currentPartId]: value
    }))
  }

  const getCurrentResponse = () => {
    if (!currentPart) return ''
    const currentPartId = `${currentQuestion.id}-${currentPart.id}`
    return responses[currentPartId] || ''
  }

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const getTimeSpentFormatted = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleHints = () => {
    const currentPartId = `${currentQuestion.id}-${currentPart.id}`
    setShowHints(prev => ({
      ...prev,
      [currentPartId]: !prev[currentPartId]
    }))
  }

  const goToNextPart = () => {
    if (currentPartIndex < totalParts - 1) {
      setCurrentPartIndex(currentPartIndex + 1)
      setPartStartTime(Date.now())
    } else if (currentQuestionIndex < normalizedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentPartIndex(0)
      setPartStartTime(Date.now())
    }
  }

  const goToPreviousPart = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex(currentPartIndex - 1)
      setPartStartTime(Date.now())
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      const prevQuestion = normalizedQuestions[currentQuestionIndex - 1]
      setCurrentPartIndex(prevQuestion.parts.length - 1)
      setPartStartTime(Date.now())
    }
  }

  const handleComplete = async () => {
    const results: FRQTestResults = {
      questionId: currentQuestion.id,
      responses: Object.entries(responses).map(([partId, response]) => ({
        partId,
        response,
        timeSpent: timeSpent[partId] || 0,
        wordCount: getWordCount(response)
      })),
      totalTimeSpent: Math.floor((Date.now() - startTime) / 1000),
      completed: true
    }
    
    // Start AI grading
    await handleAIGrading(results)
  }

  const handleAIGrading = async (results: FRQTestResults) => {
    setIsGrading(true)
    
    try {
      // Prepare responses for grading
      const responsesForGrading = currentQuestion.parts.map((part, index) => {
        const partId = `${currentQuestion.id}-${part.id}`
        const response = responses[partId] || ''
        return {
          partId: part.id,
          response,
          timeSpent: timeSpent[partId] || 0,
          wordCount: getWordCount(response)
        }
      })

      const gradingRequest = {
        question: currentQuestion,
        responses: responsesForGrading,
        rubric: currentQuestion.rubric || null
      }

      const response = await fetch('/api/grade-frq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradingRequest),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to grade FRQ')
      }

      const gradingData = await response.json()
      console.log('🎯 Grading completed successfully:', gradingData)
      setGradingResult(gradingData)
      setShowGradingResults(true)
      console.log('🎯 Grading results state updated, should show modal now')
      
    } catch (error) {
      console.error('Error grading FRQ:', error)
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      // Create a fallback grading result for display
      const fallbackResult = {
        totalScore: 0,
        maxScore: currentQuestion.totalPoints,
        percentage: 0,
        overallGrade: 'Error',
        gradingTime: '0:00',
        parts: currentQuestion.parts.map(part => ({
          partLabel: part.label,
          pointsEarned: 0,
          maxPoints: part.points,
          feedback: 'Unable to grade this response due to a technical error. Please try again.',
          strengths: [],
          improvements: ['Please try submitting your response again'],
          suggestions: ['Check your internet connection and try again']
        })),
        overallFeedback: `Grading failed: ${errorMessage}. Please try again or contact support if the issue persists.`,
        studyRecommendations: ['Try grading again when the connection is stable'],
        nextSteps: ['Retry grading', 'Contact support if issues persist'],
        gradedAt: new Date().toISOString(),
        model: 'error-fallback',
        questionId: currentQuestion.id,
        isError: true
      }
      
      setGradingResult(fallbackResult)
      setShowGradingResults(true)
    } finally {
      setIsGrading(false)
    }
  }

  const handleRetryGrading = () => {
    setShowGradingResults(false)
    setGradingResult(null)
    
    const results: FRQTestResults = {
      questionId: currentQuestion.id,
      responses: Object.entries(responses).map(([partId, response]) => ({
        partId,
        response,
        timeSpent: timeSpent[partId] || 0,
        wordCount: getWordCount(response)
      })),
      totalTimeSpent: Math.floor((Date.now() - startTime) / 1000),
      completed: true
    }
    
    handleAIGrading(results)
  }

  const handleCloseGrading = () => {
    setShowGradingResults(false)
    onComplete?.(gradingResult)
  }

  const openResearchLink = (query: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' AP exam')}`
    window.open(searchUrl, '_blank')
  }

  if (!currentQuestion || !currentPart) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No questions available</p>
      </div>
    )
  }

  const currentPartId = `${currentQuestion.id}-${currentPart.id}`
  const currentTimeSpent = timeSpent[currentPartId] || 0
  const currentResponse = getCurrentResponse()
  const wordCount = getWordCount(currentResponse)
  const progress = ((currentQuestionIndex * totalParts + currentPartIndex + 1) / (questions.length * totalParts)) * 100

  const frqInterface = (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-white z-50 flex flex-col" 
      style={{ 
        margin: 0, 
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999
      }}
    >
      {/* FRQ-Style Header */}
      <div className="bg-blue-50 border-b-2 border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between w-full">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit
            </Button>
            
            {/* Timer */}
            <div className="w-20 text-xl font-mono font-bold text-gray-900">
              {getTimeSpentFormatted(currentTimeSpent)}
            </div>
          </div>

          {/* Center - Course Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-baseline gap-2 text-lg font-bold text-gray-900">
              <span>{currentQuestion.subject}</span>
              {currentQuestion.unit && (
                <span className="text-base text-gray-600 font-medium">• {currentQuestion.unit}</span>
              )}
            </div>
          </div>

          {/* Right Section - Tools */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => openResearchLink(currentQuestion.topic)}
            >
              <Search className="h-4 w-4" />
              Research
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => openResearchLink(`${currentQuestion.subject} ${currentQuestion.unit}`)}
            >
              <BookOpen className="h-4 w-4" />
              Study Unit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Question Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center font-medium text-base">
                  {currentQuestionIndex + 1}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">Part {currentPart.label}</span>
                  <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    <Award className="w-4 h-4" />
                    {currentPart.points} points
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={toggleHints}
                >
                  <Lightbulb className="h-4 w-4" />
                  {showHints[currentPartId] ? 'Hide Hints' : 'Show Hints'}
                </Button>
                
                {/* Test Grade Button - for testing purposes */}
                {getCurrentResponse().trim() && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => {
                      const testResults: FRQTestResults = {
                        questionId: currentQuestion.id,
                        responses: Object.entries(responses).map(([partId, response]) => ({
                          partId,
                          response,
                          timeSpent: timeSpent[partId] || 0,
                          wordCount: getWordCount(response)
                        })),
                        totalTimeSpent: Math.floor((Date.now() - startTime) / 1000),
                        completed: false
                      }
                      handleAIGrading(testResults)
                    }}
                    disabled={isGrading}
                  >
                    {isGrading ? (
                      <div className="animate-spin w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full"></div>
                    ) : (
                      <Award className="h-4 w-4" />
                    )}
                    Grade Current Response
                  </Button>
                )}
              </div>
            </div>

            {/* Question Context */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Question Context</h3>
                <Badge variant="outline" className={cn(
                  "text-sm font-medium",
                  currentQuestion.difficulty === 'Easy' && "bg-green-50 text-green-700 border-green-200",
                  currentQuestion.difficulty === 'Medium' && "bg-yellow-50 text-yellow-700 border-yellow-200",
                  currentQuestion.difficulty === 'Hard' && "bg-red-50 text-red-700 border-red-200"
                )}>
                  {currentQuestion.difficulty}
                </Badge>
              </div>
              <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 text-base leading-relaxed text-gray-800">
                {currentQuestion.question}
              </div>

              {/* Stimulus Images */}
              {[
                { 
                  url: currentQuestion.stimulus_image_url, 
                  desc: currentQuestion.stimulus_image_description 
                },
                { 
                  url: currentQuestion.stimulus_image_2_url, 
                  desc: currentQuestion.stimulus_image_2_description 
                }
              ].map((stimulus, index) =>
                stimulus.url ? (
                  <div className="mb-6" key={index}>
                    <img
                      src={stimulus.url}
                      alt={stimulus.desc || `Stimulus ${index + 1}`}
                      className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm bg-white"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {stimulus.desc && (
                      <div className="mt-2 text-sm italic text-gray-600">{stimulus.desc}</div>
                    )}
                  </div>
                ) : null
              )}
            </div>

            {/* Current Part Question */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Part {currentPart.label}</h3>
              <div className="text-lg leading-relaxed text-gray-900 font-normal mb-4">
                {currentPart.question}
              </div>
            </div>

            {/* Hints Section */}
            {showHints[currentPartId] && currentPart.hint && (
              <div className="mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-3 text-lg">💡 Hint:</h4>
                  <div className="text-base text-yellow-700">
                    {currentPart.hint}
                  </div>
                </div>
              </div>
            )}

            {/* Response Area */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Your Response</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Words: <span className="font-medium text-gray-700">{wordCount}</span></span>
                  <div className="flex items-center gap-1">
                    <Save className="w-4 h-4" />
                    <span className={autoSave ? "text-green-600 font-medium" : "text-gray-400"}>
                      {autoSave ? "Auto-saving" : "Manual save"}
                    </span>
                  </div>
                </div>
              </div>

              <Textarea
                ref={textareaRef}
                value={currentResponse}
                onChange={(e) => handleResponseChange(e.target.value)}
                placeholder={`Write your response for part ${currentPart.label} here...\n\nTip: Be clear and show your work step by step. This part is worth ${currentPart.points} points.`}
                className="w-full h-64 text-base leading-relaxed resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-100 rounded-lg p-4"
              />
            </div>

            {/* Response Guidelines */}
            <div className="mb-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-3 text-base">📝 Response Guidelines:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Show all work and explain your reasoning</li>
                  <li>• Use proper mathematical notation when applicable</li>
                  <li>• Answer in complete sentences for full credit</li>
                  <li>• Expected length: <span className="font-medium">medium response</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={goToPreviousPart}
              disabled={currentQuestionIndex === 0 && currentPartIndex === 0}
              className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Part
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="font-medium">
              Part {currentPartIndex + 1} of {totalParts}
            </span>
            {currentResponse.trim() && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                Answered
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentQuestionIndex === questions.length - 1 && currentPartIndex === totalParts - 1 ? (
              <Button
                onClick={handleComplete}
                disabled={isGrading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white flex items-center gap-2 px-6 py-2 rounded-lg font-semibold"
              >
                {isGrading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    AI Grading...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Complete & Grade
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={goToNextPart}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-2 rounded-lg font-semibold"
              >
                Next Part
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Don't render on server side
  if (!isMounted) return null;

  console.log('🎯 FRQ Interface render states:', { 
    showGradingResults, 
    hasGradingResult: !!gradingResult, 
    isGrading,
    isMounted 
  });

  // Render using portal to break out of any parent containers
  return (
    <>
      {createPortal(frqInterface, document.body)}
      
      {/* AI Grading Results - Also use portal for proper z-index */}
      {showGradingResults && gradingResult && createPortal(
        <FRQGradingResults
          gradingResult={gradingResult}
          onClose={handleCloseGrading}
          onRetry={handleRetryGrading}
        />,
        document.body
      )}
      
      {/* Loading State for Grading - Also use portal */}
      {isGrading && createPortal(
        <FRQGradingResults
          gradingResult={{} as any}
          onClose={() => {}}
          isLoading={true}
        />,
        document.body
      )}
    </>
  );
}
