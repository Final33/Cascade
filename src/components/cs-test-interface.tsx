import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, ChevronLeft, Check, Timer, Calculator, StickyNote } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Question, TestResults, FRQQuestion } from "@/types/test"
import { DesmosCalculator } from "./desmos-calculator"
import { Notepad } from "./notepad"
import Prism from 'prismjs'
import 'prismjs/components/prism-java'
import 'prismjs/themes/prism-tomorrow.css'

interface CSTestInterfaceProps {
  questions: Question[]
  onComplete: (results: TestResults) => void
  timeLimit?: number // in minutes
}

export function CSTestInterface({ questions, onComplete, timeLimit = 60 }: CSTestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<{ [key: string]: string }>({})
  const [timeRemaining, setTimeRemaining] = React.useState(timeLimit * 60)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [feedback, setFeedback] = React.useState<TestResults["feedback"]>({})
  const [showCalculator, setShowCalculator] = React.useState(false)
  const [showNotepad, setShowNotepad] = React.useState(false)

  const currentQuestion = questions[currentQuestionIndex] as FRQQuestion

  React.useEffect(() => {
    // Highlight code blocks when content changes
    requestAnimationFrame(() => {
      const codeBlocks = document.querySelectorAll('pre code')
      codeBlocks.forEach(block => {
        Prism.highlightElement(block)
      })
    })
  }, [currentQuestion])

  React.useEffect(() => {
    if (!isSubmitted && timeLimit) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isSubmitted, timeLimit])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async () => {
    setIsSubmitted(true)
    
    try {
      const response = await fetch("/api/grade-cs-frq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions,
          answers,
        }),
      })

      if (!response.ok) throw new Error("Failed to grade submission")
      
      const results = await response.json()
      setFeedback(results.feedback)
      
      onComplete({
        score: results.totalScore,
        maxScore: questions.reduce((total, q) => (q as FRQQuestion).rubric.points, 0),
        timeSpent: timeLimit * 60 - timeRemaining,
        feedback: results.feedback,
      })
    } catch (error) {
      console.error("Error grading submission:", error)
    }
  }

  const processContent = (content: string) => {
    // Parse the HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    
    // Process each section
    const sections = Array.from(doc.body.children)
    return sections.map((section, idx) => {
      if (section.classList.contains('question-text')) {
        return (
          <div key={idx} className="mb-6 text-base leading-7 text-foreground">
            {section.innerHTML}
          </div>
        )
      } else if (section.classList.contains('code-section')) {
        // Extract code from the backticks
        const codeContent = section.textContent || ''
        const match = codeContent.match(/```java\n([\s\S]*?)```/)
        if (match) {
          return (
            <div key={idx} className="mb-6 rounded-lg overflow-hidden">
              <pre className="!mt-0 !mb-0">
                <code className="language-java">{match[1]}</code>
              </pre>
            </div>
          )
        }
      }
      return null
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with timer and progress */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Badge variant={timeRemaining < 300 ? "destructive" : "secondary"}>
            <Timer className="w-4 h-4 mr-1" />
            {formatTime(timeRemaining)}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowNotepad(true)}
          >
            <StickyNote className="h-4 w-4" />
            Notes
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowCalculator(true)}
          >
            <Calculator className="h-4 w-4" />
            Calculator
          </Button>
          {!isSubmitted && (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      </div>

      {/* Main content area with side-by-side view */}
      <div className="flex-1 grid grid-cols-2 gap-6 p-6">
        {/* Question panel */}
        <Card className="p-6 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-6">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold mb-4">
                  {currentQuestion.title || `Question ${currentQuestionIndex + 1}`}
                </h2>
                <div className="[&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-0 [&_code]:text-sm [&_code]:leading-relaxed [&_code]:font-mono">
                  {processContent(currentQuestion.content)}
                </div>
              </div>
              {currentQuestion.rubric && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                  <h3 className="font-semibold mb-2">Rubric ({currentQuestion.rubric.points} points)</h3>
                  <ul className="list-disc list-inside space-y-1.5">
                    {currentQuestion.rubric.criteria.map((criterion, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">{criterion}</li>
                    ))}
                  </ul>
                </div>
              )}
              {isSubmitted && feedback[currentQuestion.id] && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold">Feedback</h3>
                  <div className="space-y-2">
                    {feedback[currentQuestion.id].comments.map((comment, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{comment}</p>
                    ))}
                  </div>
                  <p className="font-medium mt-2">
                    Score: {feedback[currentQuestion.id].score} / {currentQuestion.rubric.points}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Code editor panel */}
        <Card className="p-6">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <textarea
              className="w-full h-full min-h-[600px] font-mono text-base p-4 bg-[#1E1E1E] text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
              placeholder="Write your solution here..."
              disabled={isSubmitted}
              spellCheck={false}
            />
          </ScrollArea>
        </Card>
      </div>

      {/* Navigation footer */}
      <div className="flex items-center justify-between p-4 border-t">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Desmos Calculator Modal */}
      <DesmosCalculator 
        isOpen={showCalculator} 
        onClose={() => setShowCalculator(false)} 
      />

      {/* Notepad Modal */}
      <Notepad 
        isOpen={showNotepad} 
        onClose={() => setShowNotepad(false)} 
      />
    </div>
  )
} 