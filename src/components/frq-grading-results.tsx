"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  BookOpen, 
  Lightbulb,
  Award,
  Clock,
  ArrowRight,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"

interface GradingResult {
  totalScore: number
  maxScore: number
  percentage: number
  overallGrade: string
  gradingTime: string
  parts: Array<{
    partLabel: string
    pointsEarned: number
    maxPoints: number
    feedback: string
    strengths: string[]
    improvements: string[]
    suggestions: string[]
  }>
  overallFeedback: string
  studyRecommendations: string[]
  nextSteps: string[]
  gradedAt: string
  model: string
  questionId: string
  isError?: boolean
}

interface FRQGradingResultsProps {
  gradingResult: GradingResult
  onClose: () => void
  onRetry?: () => void
  isLoading?: boolean
}

export const FRQGradingResults: React.FC<FRQGradingResultsProps> = ({
  gradingResult,
  onClose,
  onRetry,
  isLoading = false
}) => {
  console.log('🎯 FRQGradingResults rendering:', { isLoading, hasResult: !!gradingResult, isError: gradingResult?.isError });
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200'
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 90) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (percentage >= 70) return <AlertCircle className="w-5 h-5 text-yellow-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Grading in Progress</h3>
          <p className="text-gray-600">Our AI is carefully reviewing your responses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={cn(
          "sticky top-0 border-b px-6 py-4 rounded-t-xl",
          gradingResult.isError 
            ? "bg-red-50 border-red-200" 
            : "bg-white border-gray-200"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {gradingResult.isError ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : (
                  getScoreIcon(gradingResult.percentage)
                )}
                <h2 className={cn(
                  "text-2xl font-bold",
                  gradingResult.isError ? "text-red-900" : "text-gray-900"
                )}>
                  {gradingResult.isError ? "Grading Error" : "AI Grading Results"}
                </h2>
              </div>
              {!gradingResult.isError && (
                <Badge className={cn("text-lg px-3 py-1 font-bold", getGradeColor(gradingResult.overallGrade))}>
                  {gradingResult.overallGrade}
                </Badge>
              )}
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Score Summary */}
          {!gradingResult.isError && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Score Summary</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Graded in {gradingResult.gradingTime}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {gradingResult.totalScore}/{gradingResult.maxScore}
                </div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {gradingResult.percentage}%
                </div>
                <div className="text-sm text-gray-600">Percentage</div>
              </div>
              <div className="text-center">
                <div className={cn("text-3xl font-bold", getGradeColor(gradingResult.overallGrade).split(' ')[0])}>
                  {gradingResult.overallGrade}
                </div>
                <div className="text-sm text-gray-600">Letter Grade</div>
              </div>
            </div>
            
            <Progress value={gradingResult.percentage} className="h-3 mb-2" />
            <div className="text-sm text-gray-600 text-center">
              Overall Performance: {gradingResult.percentage >= 90 ? 'Excellent' : gradingResult.percentage >= 80 ? 'Good' : gradingResult.percentage >= 70 ? 'Satisfactory' : gradingResult.percentage >= 60 ? 'Needs Improvement' : 'Requires Significant Work'}
            </div>
          </div>
          )}

          {/* Error Message */}
          {gradingResult.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-red-900">Grading Failed</h3>
              </div>
              <p className="text-red-800 mb-4">
                We encountered an issue while grading your response. This could be due to:
              </p>
              <ul className="text-red-700 space-y-1 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Temporary server issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Network connectivity problems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>High system load</span>
                </li>
              </ul>
              <p className="text-red-800">
                Please try grading again in a few moments. If the problem persists, contact support.
              </p>
            </div>
          )}

          {/* Part-by-Part Breakdown */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Part-by-Part Breakdown
            </h3>
            <div className="space-y-4">
              {gradingResult.parts.map((part, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg text-gray-900">{part.partLabel.startsWith('Part') ? part.partLabel : `Part ${part.partLabel}`}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {part.pointsEarned}/{part.maxPoints} pts
                      </Badge>
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        part.pointsEarned === part.maxPoints ? "bg-green-500" :
                        part.pointsEarned >= part.maxPoints * 0.7 ? "bg-yellow-500" : "bg-red-500"
                      )}></div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Progress value={(part.pointsEarned / part.maxPoints) * 100} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Feedback:</h5>
                      <p className="text-gray-700 text-sm leading-relaxed">{part.feedback}</p>
                    </div>

                    {part.strengths.length > 0 && (
                      <div>
                        <h5 className="font-medium text-green-700 mb-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Strengths:
                        </h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          {part.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {part.improvements.length > 0 && (
                      <div>
                        <h5 className="font-medium text-orange-700 mb-1 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Areas for Improvement:
                        </h5>
                        <ul className="text-sm text-orange-700 space-y-1">
                          {part.improvements.map((improvement, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {part.suggestions.length > 0 && (
                      <div>
                        <h5 className="font-medium text-blue-700 mb-1 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" />
                          Suggestions:
                        </h5>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {part.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Feedback */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Overall Feedback</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{gradingResult.overallFeedback}</p>
          </div>

          {/* Study Recommendations */}
          {gradingResult.studyRecommendations.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Study Recommendations
              </h3>
              <ul className="space-y-2">
                {gradingResult.studyRecommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-800">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {gradingResult.nextSteps.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Next Steps
              </h3>
              <ul className="space-y-2">
                {gradingResult.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-green-800">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Graded by {gradingResult.model} • {new Date(gradingResult.gradedAt).toLocaleString()}
            </div>
            <div className="flex gap-3">
              {onRetry && (
                <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Re-grade
                </Button>
              )}
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
