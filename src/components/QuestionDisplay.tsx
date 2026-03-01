"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LatexContent } from "@/components/latex-content"

interface QuestionOption {
  label: string
  text: string
}

interface QuestionData {
  title: string
  subject: string
  difficulty: string
  question: string
  options: QuestionOption[]
  correctAnswer?: string
  explanation?: string
}

interface QuestionDisplayProps {
  isLoading?: boolean
  questionData?: QuestionData
  className?: string
  selectedAnswer?: string | null
  showResults?: boolean
  isAnswerSubmitted?: boolean
  loadingStatus?: string
  onAnswerSelect?: (optionLabel: string) => void
  onCheckAnswer?: () => void
  onNewQuestion?: () => void
}

export function QuestionDisplay({ 
  isLoading = false, 
  questionData, 
  className,
  selectedAnswer,
  showResults = false,
  isAnswerSubmitted = false,
  loadingStatus = '',
  onAnswerSelect,
  onCheckAnswer,
  onNewQuestion
}: QuestionDisplayProps) {
  if (isLoading) {
    return (
      <div className={cn("bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm w-full max-w-4xl", className)}>
        {/* Header with "Generating Question..." */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-blue-600">Generating Question...</h2>
            {loadingStatus && (
              <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                {loadingStatus}
              </span>
            )}
          </div>
          <span className="text-gray-500 text-sm font-medium">AI Powered</span>
        </div>

        {/* Loading question content - left side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-300 rounded animate-pulse w-4/6" />
            <div className="h-4 bg-gray-300 rounded animate-pulse w-3/6" />
            <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6" />
          </div>

          {/* Loading answer options - right side */}
          <div className="space-y-4">
            {['A', 'B', 'C', 'D'].map((letter) => (
              <div key={letter} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 font-medium text-sm">{letter}</span>
                </div>
                <div className="h-4 bg-gray-300 rounded animate-pulse flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!questionData) return null

  const getOptionStyle = (optionLabel: string) => {
    if (!showResults) {
      // Before submission - show selection state
      if (selectedAnswer === optionLabel) {
        return "border-blue-500 bg-blue-50 text-blue-700"
      }
      return "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-colors"
    } else {
      // After submission - show correct/incorrect
      if (optionLabel === questionData.correctAnswer) {
        return "border-green-500 bg-green-50 text-green-700"
      } else if (selectedAnswer === optionLabel && optionLabel !== questionData.correctAnswer) {
        return "border-red-500 bg-red-50 text-red-700"
      }
      return "border-gray-200 bg-white text-gray-500"
    }
  }

  const getOptionCircleStyle = (optionLabel: string) => {
    if (!showResults) {
      if (selectedAnswer === optionLabel) {
        return "border-blue-500 bg-blue-500 text-white"
      }
      return "border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"
    } else {
      if (optionLabel === questionData.correctAnswer) {
        return "border-green-500 bg-green-500 text-white"
      } else if (selectedAnswer === optionLabel && optionLabel !== questionData.correctAnswer) {
        return "border-red-500 bg-red-500 text-white"
      }
      return "border-gray-300 text-gray-400"
    }
  }

  return (
    <div className={cn("bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm w-full max-w-4xl", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-blue-600">{questionData.title}</h2>
        <span className="text-gray-500 text-sm font-medium">{questionData.subject}</span>
      </div>

      {/* Question and Options Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Question - left side */}
        <div>
          <div className="text-gray-900 text-lg leading-relaxed font-medium">
            <LatexContent content={questionData.question} inline={false} />
          </div>
        </div>

        {/* Answer Options - right side */}
        <div className="space-y-4">
          {questionData.options.map((option) => (
            <button
              key={option.label}
              onClick={() => onAnswerSelect?.(option.label)}
              disabled={isAnswerSubmitted}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl text-left group",
                getOptionStyle(option.label),
                isAnswerSubmitted ? "cursor-default" : "cursor-pointer"
              )}
            >
              <div className={cn(
                "w-8 h-8 border-2 rounded-full flex items-center justify-center flex-shrink-0",
                getOptionCircleStyle(option.label)
              )}>
                <span className="font-medium text-sm">{option.label}</span>
              </div>
              <span className="text-lg font-medium">
                <LatexContent content={option.text} inline={true} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation Section */}
      {showResults && questionData.explanation && (
        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Explanation:</h3>
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed">
              <LatexContent content={questionData.explanation} inline={false} />
            </div>
          </div>
          
          {/* Feedback Section */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Was this question helpful?</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600">
                👍
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                👎
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        {showResults && (
          <Button 
            onClick={onNewQuestion}
            variant="outline"
            className="px-6 py-3 rounded-lg font-medium text-base"
          >
            New Question
          </Button>
        )}
        <Button 
          onClick={onCheckAnswer}
          disabled={!selectedAnswer || isAnswerSubmitted}
          className={cn(
            "px-8 py-3 rounded-lg font-medium text-base",
            isAnswerSubmitted 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-gray-600 hover:bg-gray-700 text-white"
          )}
        >
          {isAnswerSubmitted ? "Answer Submitted" : "Check Answer"}
        </Button>
      </div>
    </div>
  )
}
