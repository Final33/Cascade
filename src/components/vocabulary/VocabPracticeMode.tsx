"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"
import { VocabWord } from "@/lib/vocab-data"

interface VocabPracticeModeProps {
  words: VocabWord[]
  onComplete: (results: PracticeResults) => void
  onExit: () => void
  mode: 'flashcards' | 'quiz' | 'matching'
}

interface PracticeResults {
  totalWords: number
  correctAnswers: number
  timeSpent: number
  wordsStudied: string[]
  difficulty: Record<string, number>
}

export default function VocabPracticeMode({ 
  words, 
  onComplete, 
  onExit, 
  mode = 'flashcards' 
}: VocabPracticeModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [studiedWords, setStudiedWords] = useState<Set<string>>(new Set())
  const [startTime] = useState(Date.now())
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizOptions, setQuizOptions] = useState<string[]>([])

  const currentWord = words[currentIndex]
  const progress = ((currentIndex + 1) / words.length) * 100

  // Generate quiz options for quiz mode
  useEffect(() => {
    if (mode === 'quiz' && currentWord) {
      const otherWords = words.filter(w => w.id !== currentWord.id)
      const randomOptions = otherWords
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.definition)
      
      const allOptions = [currentWord.definition, ...randomOptions]
        .sort(() => 0.5 - Math.random())
      
      setQuizOptions(allOptions)
    }
  }, [currentIndex, currentWord, mode, words])

  // Handle next word
  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowDefinition(false)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // Practice complete
      const results: PracticeResults = {
        totalWords: words.length,
        correctAnswers,
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
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  // Handle flashcard flip
  const handleFlip = () => {
    setShowDefinition(!showDefinition)
    if (!showDefinition) {
      const newStudied = new Set(studiedWords)
      newStudied.add(currentWord.id)
      setStudiedWords(newStudied)
    }
  }

  // Handle quiz answer
  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)
    
    const isCorrect = answer === currentWord.definition
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1)
    }
    
    const newStudied = new Set(studiedWords)
    newStudied.add(currentWord.id)
    setStudiedWords(newStudied)
  }

  // Mark as known/unknown for flashcards
  const handleKnown = (known: boolean) => {
    if (known) {
      setCorrectAnswers(correctAnswers + 1)
    }
    
    const newStudied = new Set(studiedWords)
    newStudied.add(currentWord.id)
    setStudiedWords(newStudied)
    
    handleNext()
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!currentWord) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onExit}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Exit Practice
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'flashcards' ? 'Flashcard Practice' : 
               mode === 'quiz' ? 'Quiz Mode' : 'Matching Practice'}
            </h1>
            <p className="text-gray-600">
              {currentIndex + 1} of {words.length} words
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="font-semibold text-gray-900">{Math.round(progress)}%</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-2" />

        {/* Main Practice Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge className={getDifficultyColor(currentWord.difficulty)}>
                {currentWord.difficulty}
              </Badge>
              <Badge variant="outline">
                {currentWord.apClass}
              </Badge>
              <Badge variant="outline">
                Unit {currentWord.unitNumber}
              </Badge>
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {currentWord.word}
            </CardTitle>
            
            <p className="text-lg text-gray-600 italic">
              {currentWord.partOfSpeech}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {mode === 'flashcards' && (
              <div className="text-center space-y-6">
                {/* Flashcard Content */}
                <div 
                  className={cn(
                    "min-h-[200px] flex items-center justify-center p-8 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer",
                    showDefinition 
                      ? "bg-blue-50 border-blue-300" 
                      : "bg-gray-50 border-gray-300 hover:border-blue-300"
                  )}
                  onClick={handleFlip}
                >
                  {showDefinition ? (
                    <div className="space-y-4 text-center">
                      <p className="text-xl text-gray-900 leading-relaxed">
                        {currentWord.definition}
                      </p>
                      {currentWord.exampleSentence && (
                        <div className="bg-white p-4 rounded-lg border">
                          <p className="text-sm text-gray-600 italic">
                            "{currentWord.exampleSentence}"
                          </p>
                        </div>
                      )}
                      {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                          <span className="text-sm text-gray-600">Synonyms:</span>
                          {currentWord.synonyms.map((synonym, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {synonym}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-gray-600">
                        Click to reveal definition
                      </p>
                    </div>
                  )}
                </div>

                {/* Flashcard Controls */}
                {showDefinition && (
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleKnown(false)}
                      className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Don't Know
                    </Button>
                    <Button
                      onClick={() => handleKnown(true)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      I Know This
                    </Button>
                  </div>
                )}
              </div>
            )}

            {mode === 'quiz' && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg text-gray-700 mb-6">
                    What is the definition of <strong>{currentWord.word}</strong>?
                  </p>
                </div>

                <div className="grid gap-3">
                  {quizOptions.map((option, index) => {
                    const isSelected = selectedAnswer === option
                    const isCorrect = option === currentWord.definition
                    const showColors = showResult
                    
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => !showResult && handleQuizAnswer(option)}
                        disabled={showResult}
                        className={cn(
                          "p-4 h-auto text-left justify-start whitespace-normal",
                          showColors && isCorrect && "bg-green-100 border-green-500 text-green-800",
                          showColors && isSelected && !isCorrect && "bg-red-100 border-red-500 text-red-800",
                          !showColors && "hover:bg-blue-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-semibold text-gray-500 mt-1">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="flex-1">{option}</span>
                          {showColors && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          )}
                          {showColors && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </div>

                {showResult && (
                  <div className="text-center space-y-4">
                    {selectedAnswer === currentWord.definition ? (
                      <div className="text-green-600">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-semibold">Correct!</p>
                      </div>
                    ) : (
                      <div className="text-red-600">
                        <XCircle className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-semibold">Incorrect</p>
                      </div>
                    )}
                    
                    {currentWord.exampleSentence && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 italic">
                          "{currentWord.exampleSentence}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="font-semibold text-gray-900">
                {studiedWords.size > 0 ? Math.round((correctAnswers / studiedWords.size) * 100) : 0}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Studied</p>
              <p className="font-semibold text-gray-900">
                {studiedWords.size} / {words.length}
              </p>
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={mode === 'quiz' && !showResult}
            className="flex items-center gap-2"
          >
            {currentIndex === words.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
