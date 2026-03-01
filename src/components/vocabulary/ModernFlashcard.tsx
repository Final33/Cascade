"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Eye, 
  EyeOff,
  CheckCircle2,
  XCircle,
  Star,
  Volume2,
  BookOpen,
  Target,
  Flag,
  ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { VocabWord } from "@/lib/vocab-data"

interface ModernFlashcardProps {
  words: VocabWord[]
  onComplete: (results: PracticeResults) => void
  onExit: () => void
  mode: 'flashcards' | 'quiz'
}

interface PracticeResults {
  totalWords: number
  correctAnswers: number
  timeSpent: number
  wordsStudied: string[]
  difficulty: Record<string, number>
}

export default function ModernFlashcard({ 
  words, 
  onComplete, 
  onExit, 
  mode = 'flashcards' 
}: ModernFlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [studiedWords, setStudiedWords] = useState<Set<string>>(new Set())
  const [startTime] = useState(Date.now())
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set())
  const [isFlipping, setIsFlipping] = useState(false)
  const [exampleText, setExampleText] = useState("")

  const currentWord = words[currentIndex]
  const progress = ((currentIndex + 1) / words.length) * 100

  // Handle card flip with animation
  const handleFlip = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setTimeout(() => {
      setShowDefinition(!showDefinition)
      setIsFlipping(false)
    }, 150)
  }

  // Handle next word
  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowDefinition(false)
      setExampleText("")
    } else {
      // Practice complete
      const results: PracticeResults = {
        totalWords: words.length,
        correctAnswers: knownWords.size,
        timeSpent: Date.now() - startTime,
        wordsStudied: Array.from(studiedWords),
        difficulty: words.reduce((acc, word) => {
          acc[word.difficulty] = (acc[word.difficulty] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
      onComplete(results)
    }
  }

  // Handle previous word
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowDefinition(false)
      setExampleText("")
    }
  }

  // Mark word as known/unknown
  const handleKnowWord = (known: boolean) => {
    const newStudiedWords = new Set(studiedWords)
    const newKnownWords = new Set(knownWords)
    
    newStudiedWords.add(currentWord.word)
    
    if (known) {
      newKnownWords.add(currentWord.word)
    } else {
      newKnownWords.delete(currentWord.word)
    }
    
    setStudiedWords(newStudiedWords)
    setKnownWords(newKnownWords)
    
    // Auto advance after marking
    setTimeout(() => {
      handleNext()
    }, 500)
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'hard': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (!currentWord) return null

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* TOP SECTION - Navigation Bar */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            Exit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Browse
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg font-medium flex items-center gap-1"
          >
            <ChevronRight className="h-4 w-4 rotate-90" />
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Badge 
            variant="outline" 
            className={cn("px-3 py-1 font-medium rounded-full", getDifficultyColor(currentWord.difficulty))}
          >
            {currentWord.difficulty}
          </Badge>
          <div className="text-sm font-medium text-gray-600">
            Word {currentIndex + 1} of {words.length}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Flag className="h-4 w-4 text-yellow-500" />
          </Button>
        </div>
      </div>

      {/* MIDDLE SECTION - Flashcard */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Navigation Arrows */}
          <div className="relative">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="ghost"
              size="sm"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              onClick={handleNext}
              variant="ghost"
              size="sm"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* The Card with attached bottom section */}
            <div className="bg-white rounded-2xl border border-gray-200">
              {/* Flippable Card Content */}
              <div 
                className="p-8 text-center cursor-pointer min-h-[400px] flex flex-col justify-center border-b border-gray-100"
                onClick={handleFlip}
              >
                {!showDefinition ? (
                  // Front of card - Word
                  <div className="space-y-4">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">
                      {currentWord.word}
                    </h1>
                    <p className="text-gray-400 text-lg">
                      Click to reveal meaning
                    </p>
                  </div>
                ) : (
                  // Back of card - Definition
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">
                      {currentWord.word}
                    </h2>
                    <p className="text-xl text-gray-700 leading-relaxed max-w-lg mx-auto">
                      {currentWord.definition}
                    </p>
                    
                    {currentWord.exampleSentence && (
                      <div className="bg-gray-50 rounded-xl p-6 mt-6">
                        <p className="text-gray-600 italic text-lg">
                          "{currentWord.exampleSentence}"
                        </p>
                      </div>
                    )}

                    {currentWord.etymology && (
                      <p className="text-gray-500 mt-6">
                        <span className="font-medium">Root:</span> {currentWord.etymology} <span className="text-gray-400">({currentWord.partOfSpeech})</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Static Bottom Section - Part of the card */}
              <div className="px-6 py-6 space-y-4">
                {/* I Know This Word Checkbox */}
                <div className="flex items-center justify-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={knownWords.has(currentWord.word)}
                      onChange={(e) => handleKnowWord(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={cn(
                      "flex items-center justify-center w-5 h-5 rounded border-2 transition-colors",
                      knownWords.has(currentWord.word)
                        ? "bg-yellow-500 border-yellow-500 text-white"
                        : "border-gray-300 hover:border-gray-400"
                    )}>
                      {knownWords.has(currentWord.word) && (
                        <CheckCircle2 className="h-3 w-3" />
                      )}
                    </div>
                    <span className="text-gray-700 font-medium">I know this word</span>
                  </label>
                </div>

                {/* Example Sentence Input */}
                <div className="relative">
                  <textarea
                    value={exampleText}
                    onChange={(e) => setExampleText(e.target.value)}
                    placeholder="Write your own example sentence..."
                    className="w-full h-24 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                    maxLength={250}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {exampleText.length}/250 characters
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
