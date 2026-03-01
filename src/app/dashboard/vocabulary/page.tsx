"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { 
  Search, 
  BookOpen, 
  Target, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  Flag,
  CheckCircle2,
  Circle,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  AP_VOCAB_CLASSES, 
  SAMPLE_VOCAB_WORDS, 
  VocabWord, 
  getVocabByClass, 
  getVocabByUnit,
  getVocabByDifficulty,
  searchVocab,
  getRandomVocabWords
} from "@/lib/vocab-data"
import VocabPracticeMode from "@/components/vocabulary/VocabPracticeMode"
import VocabPracticeResults from "@/components/vocabulary/VocabPracticeResults"
import ModernFlashcard from "@/components/vocabulary/ModernFlashcard"

interface StudySession {
  studiedToday: number
  dailyGoal: number
  streak: number
}

interface PracticeResults {
  totalWords: number
  correctAnswers: number
  timeSpent: number
  wordsStudied: string[]
  difficulty: Record<string, number>
}

type ViewMode = 'vocabulary' | 'practice' | 'quiz' | 'results'

export default function VocabularyPage() {
  // State management for the magnificent vocabulary tool
  const [selectedClass, setSelectedClass] = useState<string>("All Words")
  const [selectedUnit, setSelectedUnit] = useState<string>("All Difficulties")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All Difficulties")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFlagged, setShowFlagged] = useState(false)
  const [showWithExamples, setShowWithExamples] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [practiceSize, setPracticeSize] = useState(5)
  const [quizSize, setQuizSize] = useState(5)
  const [studySession, setStudySession] = useState<StudySession>({
    studiedToday: 0,
    dailyGoal: 15,
    streak: 0
  })
  const [flaggedWords, setFlaggedWords] = useState<Set<string>>(new Set())
  const [studiedWords, setStudiedWords] = useState<Set<string>>(new Set())
  
  // Practice mode state
  const [currentView, setCurrentView] = useState<ViewMode>('vocabulary')
  const [practiceWords, setPracticeWords] = useState<VocabWord[]>([])
  const [practiceResults, setPracticeResults] = useState<PracticeResults | null>(null)
  const [practiceMode, setPracticeMode] = useState<'flashcards' | 'quiz'>('flashcards')

  const wordsPerPage = 15

  // Get filtered vocabulary words
  const filteredWords = useMemo(() => {
    let words = [...SAMPLE_VOCAB_WORDS]

    // Apply search filter
    if (searchQuery.trim()) {
      words = searchVocab(searchQuery)
    }

    // Apply class filter
    if (selectedClass !== "All Words") {
      words = words.filter(word => word.apClass === selectedClass)
    }

    // Apply unit filter
    if (selectedUnit !== "All Difficulties" && selectedClass !== "All Words") {
      words = words.filter(word => word.unit === selectedUnit)
    }

    // Apply difficulty filter
    if (selectedDifficulty !== "All Difficulties") {
      words = words.filter(word => word.difficulty === selectedDifficulty)
    }

    // Apply flagged filter
    if (showFlagged) {
      words = words.filter(word => flaggedWords.has(word.id))
    }

    // Apply example sentences filter
    if (showWithExamples) {
      words = words.filter(word => word.exampleSentence)
    }

    return words
  }, [searchQuery, selectedClass, selectedUnit, selectedDifficulty, showFlagged, showWithExamples, flaggedWords])

  // Pagination
  const totalPages = Math.ceil(filteredWords.length / wordsPerPage)
  const paginatedWords = filteredWords.slice(
    (currentPage - 1) * wordsPerPage,
    currentPage * wordsPerPage
  )

  // Get available units for selected class
  const availableUnits = useMemo(() => {
    if (selectedClass === "All Words") return []
    const classData = AP_VOCAB_CLASSES.find(cls => cls.name === selectedClass)
    return classData?.units || []
  }, [selectedClass])

  // Handle class change
  const handleClassChange = (value: string) => {
    setSelectedClass(value)
    setSelectedUnit("All Difficulties") // Reset unit when class changes
    setCurrentPage(1)
  }

  // Toggle word flag
  const toggleFlag = (wordId: string) => {
    const newFlagged = new Set(flaggedWords)
    if (newFlagged.has(wordId)) {
      newFlagged.delete(wordId)
    } else {
      newFlagged.add(wordId)
    }
    setFlaggedWords(newFlagged)
  }

  // Mark word as studied
  const markAsStudied = (wordId: string) => {
    const newStudied = new Set(studiedWords)
    newStudied.add(wordId)
    setStudiedWords(newStudied)
    
    // Update daily progress
    setStudySession(prev => ({
      ...prev,
      studiedToday: prev.studiedToday + 1
    }))
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

  // Get class color
  const getClassColor = (className: string) => {
    const classData = AP_VOCAB_CLASSES.find(cls => cls.name === className)
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-100 text-blue-800 border-blue-200',
      'purple': 'bg-purple-100 text-purple-800 border-purple-200',
      'green': 'bg-green-100 text-green-800 border-green-200',
      'red': 'bg-red-100 text-red-800 border-red-200',
      'indigo': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'emerald': 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
    return colorMap[classData?.color || 'blue'] || 'bg-blue-100 text-blue-800 border-blue-200'
  }

  // Get words for practice based on current filters
  const getPracticeWords = (count: number): VocabWord[] => {
    let availableWords = [...filteredWords]
    
    // If no words match filters, use all words
    if (availableWords.length === 0) {
      availableWords = [...SAMPLE_VOCAB_WORDS]
    }
    
    // Shuffle and return requested count
    const shuffled = availableWords.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  // Start practice mode
  const startPractice = () => {
    const words = getPracticeWords(practiceSize)
    setPracticeWords(words)
    setPracticeMode('flashcards')
    setCurrentView('practice')
  }

  // Start quiz mode
  const startQuiz = () => {
    const words = getPracticeWords(quizSize)
    setPracticeWords(words)
    setPracticeMode('quiz')
    setCurrentView('quiz')
  }

  // Handle practice completion
  const handlePracticeComplete = (results: PracticeResults) => {
    setPracticeResults(results)
    setCurrentView('results')
    
    // Update study session
    setStudySession(prev => ({
      ...prev,
      studiedToday: prev.studiedToday + results.wordsStudied.length
    }))
    
    // Update studied words
    const newStudied = new Set(Array.from(studiedWords).concat(results.wordsStudied))
    setStudiedWords(newStudied)
  }

  // Return to vocabulary list
  const returnToVocabulary = () => {
    setCurrentView('vocabulary')
    setPracticeWords([])
    setPracticeResults(null)
  }

  // Retry practice with same words
  const retryPractice = () => {
    if (practiceResults) {
      setCurrentView(practiceMode === 'flashcards' ? 'practice' : 'quiz')
      setPracticeResults(null)
    }
  }

  // Render practice mode
  if (currentView === 'practice' || currentView === 'quiz') {
    return (
      <ModernFlashcard
        words={practiceWords}
        mode={practiceMode}
        onComplete={handlePracticeComplete}
        onExit={returnToVocabulary}
      />
    )
  }

  // Render results
  if (currentView === 'results' && practiceResults) {
    return (
      <VocabPracticeResults
        results={practiceResults}
        mode={practiceMode}
        onRetry={retryPractice}
        onHome={returnToVocabulary}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Vocab</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Master AP vocabulary with interactive flashcards and intelligent practice sessions
          </p>
        </div>

        {/* Main Layout - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Practice Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Practice Set */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900">Practice Set</CardTitle>
                <p className="text-sm text-gray-600">Choose Your Practice Size</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {[5, 10, 15].map((size) => (
                    <Button
                      key={size}
                      variant={practiceSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPracticeSize(size)}
                      className={cn(
                        "flex-1 font-medium",
                        practiceSize === size 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "hover:bg-blue-50"
                      )}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={startPractice}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Practice
                </Button>
              </CardContent>
            </Card>

            {/* Quiz Set */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900">Quiz Set</CardTitle>
                <p className="text-sm text-gray-600">Choose Your Quiz Size</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {[5, 10, 15].map((size) => (
                    <Button
                      key={size}
                      variant={quizSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuizSize(size)}
                      className={cn(
                        "flex-1 font-medium",
                        quizSize === size 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "hover:bg-green-50"
                      )}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={startQuiz}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Start Quiz
                </Button>
              </CardContent>
            </Card>

            {/* Daily Vocab Goal */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900">Daily Vocab Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        strokeDasharray={`${(studySession.studiedToday / studySession.dailyGoal) * 100}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-600">
                        {Math.round((studySession.studiedToday / studySession.dailyGoal) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {studySession.studiedToday}/{studySession.dailyGoal}
                    </p>
                    <p className="text-sm text-gray-600">Words Studied Today</p>
                    <Button
                      variant="link"
                      className="text-purple-600 hover:text-purple-700 p-0 h-auto text-sm"
                    >
                      Edit Goal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Vocabulary List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters and Search */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Vocab List</CardTitle>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{filteredWords.length} words</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search vocabulary..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* AP Class Filter */}
                  <Select value={selectedClass} onValueChange={handleClassChange}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="All Words" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Words">All Words</SelectItem>
                      {AP_VOCAB_CLASSES.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Unit Filter */}
                  <Select 
                    value={selectedUnit} 
                    onValueChange={setSelectedUnit}
                    disabled={selectedClass === "All Words"}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="All Units" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Difficulties">All Units</SelectItem>
                      {availableUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.name}>
                          Unit {unit.number}: {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Difficulty Filter */}
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="All Difficulties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Difficulties">All Difficulties</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Filters */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flagged"
                      checked={showFlagged}
                      onCheckedChange={(checked) => setShowFlagged(checked === true)}
                    />
                    <label htmlFor="flagged" className="text-sm font-medium text-gray-700">
                      Flagged
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="examples"
                      checked={showWithExamples}
                      onCheckedChange={(checked) => setShowWithExamples(checked === true)}
                    />
                    <label htmlFor="examples" className="text-sm font-medium text-gray-700">
                      With Example Sentences
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vocabulary Words Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedWords.map((word) => (
                <Card 
                  key={word.id} 
                  className={cn(
                    "border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group",
                    studiedWords.has(word.id) ? "bg-green-50 border-green-200" : "hover:border-blue-200"
                  )}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Word Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {word.word}
                        </h3>
                        <p className="text-sm text-gray-500 italic">{word.partOfSpeech}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFlag(word.id)
                          }}
                          className={cn(
                            "h-8 w-8 p-0",
                            flaggedWords.has(word.id) 
                              ? "text-yellow-600 hover:text-yellow-700" 
                              : "text-gray-400 hover:text-yellow-600"
                          )}
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsStudied(word.id)
                          }}
                          className={cn(
                            "h-8 w-8 p-0",
                            studiedWords.has(word.id)
                              ? "text-green-600 hover:text-green-700"
                              : "text-gray-400 hover:text-green-600"
                          )}
                        >
                          {studiedWords.has(word.id) ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Definition */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {word.definition}
                    </p>

                    {/* Example Sentence */}
                    {word.exampleSentence && (
                      <div className="bg-gray-50 p-2 rounded-md">
                        <p className="text-xs text-gray-600 italic">
                          "{word.exampleSentence}"
                        </p>
                      </div>
                    )}

                    {/* Tags and Metadata */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(word.difficulty)}>
                          {word.difficulty}
                        </Badge>
                        <Badge className={getClassColor(word.apClass)}>
                          Unit {word.unitNumber}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < Math.round(word.frequency / 2) 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
