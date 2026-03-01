"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, 
  Target, 
  Clock, 
  BookOpen, 
  Star,
  TrendingUp,
  RotateCcw,
  Home,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PracticeResults {
  totalWords: number
  correctAnswers: number
  timeSpent: number
  wordsStudied: string[]
  difficulty: Record<string, number>
}

interface VocabPracticeResultsProps {
  results: PracticeResults
  onRetry: () => void
  onHome: () => void
  mode: 'flashcards' | 'quiz' | 'matching'
}

export default function VocabPracticeResults({ 
  results, 
  onRetry, 
  onHome, 
  mode 
}: VocabPracticeResultsProps) {
  const accuracy = Math.round((results.correctAnswers / results.totalWords) * 100)
  const timeInMinutes = Math.round(results.timeSpent / 60000)
  const timeInSeconds = Math.round((results.timeSpent % 60000) / 1000)
  
  // Get performance level
  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (accuracy >= 80) return { level: 'Great', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (accuracy >= 70) return { level: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (accuracy >= 60) return { level: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    return { level: 'Needs Practice', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const performance = getPerformanceLevel(accuracy)

  // Get trophy icon based on performance
  const getTrophyIcon = (accuracy: number) => {
    if (accuracy >= 90) return '🏆'
    if (accuracy >= 80) return '🥈'
    if (accuracy >= 70) return '🥉'
    return '📚'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-6xl mb-4">
            {getTrophyIcon(accuracy)}
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Practice Complete!
          </h1>
          <p className="text-xl text-gray-600">
            {mode === 'flashcards' ? 'Flashcard Session' : 
             mode === 'quiz' ? 'Quiz Session' : 'Matching Session'} Results
          </p>
        </div>

        {/* Main Results Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold mb-4",
              performance.bgColor,
              performance.color
            )}>
              <Star className="w-5 h-5" />
              {performance.level}
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {accuracy}% Accuracy
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Progress Circle */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={accuracy >= 80 ? "#10b981" : accuracy >= 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="2"
                    strokeDasharray={`${accuracy}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {accuracy}%
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {results.correctAnswers}
                </p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {results.totalWords}
                </p>
                <p className="text-sm text-gray-600">Total Words</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {timeInMinutes}:{timeInSeconds.toString().padStart(2, '0')}
                </p>
                <p className="text-sm text-gray-600">Time Spent</p>
              </div>

              <div className="text-center">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {results.wordsStudied.length}
                </p>
                <p className="text-sm text-gray-600">Words Studied</p>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            {Object.keys(results.difficulty).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 text-center">
                  Difficulty Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(results.difficulty).map(([difficulty, count]) => {
                    const percentage = Math.round((count / results.totalWords) * 100)
                    const colorMap = {
                      'Easy': 'bg-green-500',
                      'Medium': 'bg-yellow-500',
                      'Hard': 'bg-red-500'
                    }
                    
                    return (
                      <div key={difficulty} className="text-center">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {difficulty}
                          </span>
                          <span className="text-sm text-gray-600">
                            {count} words
                          </span>
                        </div>
                        <Progress 
                          value={percentage} 
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {percentage}%
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Motivational Message */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              {accuracy >= 90 && (
                <div>
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Outstanding Performance! 🌟
                  </p>
                  <p className="text-gray-600">
                    You've mastered these vocabulary words! Keep up the excellent work.
                  </p>
                </div>
              )}
              
              {accuracy >= 70 && accuracy < 90 && (
                <div>
                  <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Great Job! 💪
                  </p>
                  <p className="text-gray-600">
                    You're making solid progress. A few more practice sessions and you'll be a vocabulary master!
                  </p>
                </div>
              )}
              
              {accuracy < 70 && (
                <div>
                  <BookOpen className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Keep Practicing! 📚
                  </p>
                  <p className="text-gray-600">
                    Every expert was once a beginner. Review these words and try again - you've got this!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRetry}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            <RotateCcw className="w-4 h-4" />
            Practice Again
          </Button>
          
          <Button
            variant="outline"
            onClick={onHome}
            className="flex items-center gap-2 px-8 py-3"
          >
            <Home className="w-4 h-4" />
            Back to Vocabulary
          </Button>
        </div>

        {/* Achievement Badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {accuracy === 100 && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              🏆 Perfect Score!
            </Badge>
          )}
          {accuracy >= 90 && (
            <Badge className="bg-green-100 text-green-800 border-green-300">
              ⭐ Vocabulary Master
            </Badge>
          )}
          {results.totalWords >= 20 && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              📚 Dedicated Learner
            </Badge>
          )}
          {timeInMinutes <= 2 && results.totalWords >= 10 && (
            <Badge className="bg-purple-100 text-purple-800 border-purple-300">
              ⚡ Speed Demon
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
