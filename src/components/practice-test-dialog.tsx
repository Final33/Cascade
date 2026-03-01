"use client"

import * as React from "react"
import { Check, ChevronRight, Clock, FileText, GraduationCap, Settings, X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { TestInterface } from "@/components/test-interface"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { courseConfigs, CourseId, CourseUnit } from "@/lib/course-config"
import { usePathname } from 'next/navigation'
import { getCourseIdFromRoute } from '@/lib/course-utils'
import { PastFRQManager } from "@/components/past-frq-manager"
import { PastFRQ } from "@/types/frq"
import { CSTestInterface } from "@/components/cs-test-interface"
import { TestType, Question, TestResults } from "@/types/test"

export interface PracticeTestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTestType?: TestType
  initialCourse?: CourseId
}

const testTypes = [
  {
    id: "mcq",
    title: "Quick MCQ Practice",
    description: "Multiple choice questions focused on specific topics",
    duration: "20-30 mins",
    icon: Clock,
  },
  {
    id: "frq",
    title: "AI FRQ Practice",
    description: "Free response questions with detailed scoring guidelines",
    duration: "30-45 mins",
    icon: FileText,
  },
  {
    id: "past-frq",
    title: "Old FRQs",
    description: "Practice with real past AP exam questions",
    duration: "30-45 mins",
    icon: GraduationCap,
  },
  {
    id: "full",
    title: "Full AP Test",
    description: "Complete AP exam simulation with all question types",
    duration: "3-4 hours",
    icon: FileText,
  },
]

const difficultyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

const calcUnits = [
  { id: "limits", label: "Limits and Continuity" },
  { id: "derivatives", label: "Differentiation: Definition and Fundamental Properties" },
  { id: "derivatives-apps", label: "Differentiation: Composite, Implicit, and Inverse Functions" },
  { id: "apps-derivatives", label: "Applications of Differentiation" },
  { id: "integration", label: "Integration and Accumulation of Change" },
  { id: "differential-equations", label: "Differential Equations" },
  { id: "apps-integration", label: "Applications of Integration" },
]

export type QuestionType = "mcq" | "frq"

export interface BaseQuestion {
  id: string
  type: QuestionType
  content: string
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced" | "ap-level"
}

export interface MCQQuestion extends BaseQuestion {
  type: "mcq"
  options: {
    id: string
    label: string
    text: string
    isCorrect: boolean
  }[]
  explanation: string
}

export interface FRQQuestion extends BaseQuestion {
  type: "frq"
  rubric: {
    points: number
    criteria: string[]
  }
  sampleResponse?: string
}

export type Question = MCQQuestion | FRQQuestion

const generateMockQuestions = (type: string, count: number, selectedUnits: string[]): Question[] => {
  const questions: Question[] = []
  for (let i = 0; i < count; i++) {
    if (type === "mcq") {
      questions.push({
        id: `mock-${i}`,
        type: "mcq",
        content: `This is multiple choice question ${i + 1} about ${selectedUnits.join(", ")}. Choose the best answer.`,
        options: [
          { id: "A", label: "A", text: "First option for question " + (i + 1), isCorrect: false },
          { id: "B", label: "B", text: "Second option for question " + (i + 1), isCorrect: false },
          { id: "C", label: "C", text: "Third option for question " + (i + 1), isCorrect: true },
          { id: "D", label: "D", text: "Fourth option for question " + (i + 1), isCorrect: false },
        ],
        explanation: "This is a mock explanation",
        topic: selectedUnits[0],
        difficulty: "intermediate"
      })
    } else if (type === "frq") {
      questions.push({
        id: `mock-${i}`,
        type: "frq",
        content: `Free response question ${i + 1} about ${selectedUnits.join(", ")}. Explain your answer in detail.`,
        topic: selectedUnits[0],
        difficulty: "intermediate",
        rubric: {
          points: 9,
          criteria: ["Sample criteria 1", "Sample criteria 2", "Sample criteria 3"]
        }
      })
    }
  }
  return questions
}

export function PracticeTestDialog({ 
  open, 
  onOpenChange, 
  initialTestType = "mcq",
  initialCourse
}: PracticeTestDialogProps) {
  const pathname = usePathname()
  const routeCourse = getCourseIdFromRoute(pathname)
  const [step, setStep] = React.useState(0)
  const [selectedCourse, setSelectedCourse] = React.useState<CourseId>(initialCourse || routeCourse || 'calc-ab')
  const [testType, setTestType] = React.useState<TestType>(initialTestType)
  const [questionCount, setQuestionCount] = React.useState(15)
  const [difficulty, setDifficulty] = React.useState("intermediate")
  const [selectedUnits, setSelectedUnits] = React.useState<string[]>([])
  const [progress, setProgress] = React.useState(0)
  const [testStarted, setTestStarted] = React.useState(false)
  const [questions, setQuestions] = React.useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [selectedPastFRQ, setSelectedPastFRQ] = React.useState<PastFRQ | null>(null)

  const currentCourseConfig = courseConfigs[selectedCourse]

  // Update selectedCourse when route changes
  React.useEffect(() => {
    if (routeCourse) {
      setSelectedCourse(routeCourse)
    }
  }, [routeCourse])

  React.useEffect(() => {
    if (testType === "full" && currentCourseConfig?.units) {
      setDifficulty("ap-level")
      setSelectedUnits(currentCourseConfig.units.map((unit) => unit.id))
    }
  }, [testType, currentCourseConfig])

  React.useEffect(() => {
    setProgress((step / (testStarted ? 3 : 2)) * 100)
  }, [step, testStarted])

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isLoading) {
      // Simulate progress for better UX
      setLoadingProgress(0)
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          // Cap at 90% until actual completion
          const next = prev + (90 - prev) * 0.1
          return Math.min(next, 90)
        })
      }, 300)
    } else {
      setLoadingProgress(0)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLoading])

  const handleNext = async () => {
    if (testType === "past-frq") {
      if (step === 0) {
        setStep(1) // Go directly to FRQ selection
        return
      }
      if (selectedPastFRQ) {
        // Start test immediately with the selected FRQ
        setIsLoading(true)
        setError(null)
        setLoadingProgress(10)
        
        try {
          // Create a proper FRQ question from the selected past FRQ
          const frqQuestion: FRQQuestion = {
            id: selectedPastFRQ.id,
            type: "frq",
            content: selectedPastFRQ.content,
            topic: selectedPastFRQ.topics.join(", "),
            difficulty: "ap-level",
            rubric: selectedPastFRQ.rubric,
            sampleResponse: selectedPastFRQ.sampleResponse
          }
          
          setLoadingProgress(100)
          setQuestions([frqQuestion])
          
          // Short delay to show 100% before proceeding
          setTimeout(() => {
            setTestStarted(true)
            setIsLoading(false)
          }, 500)
        } catch (err) {
          console.error("Error setting up FRQ:", err)
          setError("Failed to set up the FRQ for practice")
          setIsLoading(false)
        }
        return
      }
      setError("Please select a past FRQ to practice with")
      return
    }

    if (testType === "full" && step === 0) {
      setStep(2) // Skip to summary for full AP test
      return
    }

    if (step === 2) {
      // Generate questions and start the test
      setIsLoading(true)
      setError(null)
      setLoadingProgress(10)
      
      const attemptGeneration = async (retryCount = 0, maxRetries = 2) => {
        try {
          const response = await fetch("/api/generate-questions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              course: selectedCourse,
              testType,
              questionCount,
              difficulty,
              selectedUnits,
            }),
          });
          
          setLoadingProgress(50 + (retryCount * 10))
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to generate questions");
          }
          
          const data = await response.json();
          
          // Validate the response contains actual questions
          if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
            if (retryCount < maxRetries) {
              console.log(`Attempt ${retryCount + 1} failed - retrying question generation...`);
              return attemptGeneration(retryCount + 1, maxRetries);
            }
            throw new Error("Failed to generate proper questions after multiple attempts");
          }
          
          // We have valid questions
          setQuestions(data.questions);
          setLoadingProgress(100);
          
          // Short delay to show 100% before proceeding
          setTimeout(() => {
            setTestStarted(true);
            setIsLoading(false);
          }, 500);
        } catch (err) {
          console.error("Error generating questions:", err);
          
          // Retry logic
          if (retryCount < maxRetries) {
            console.log(`Attempt ${retryCount + 1} failed - retrying question generation...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            return attemptGeneration(retryCount + 1, maxRetries);
          }
          
          // All retries failed
          setError(err instanceof Error ? err.message : "Failed to generate questions after multiple attempts");
          setIsLoading(false);
        }
      };
      
      await attemptGeneration();
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleTestComplete = (results: TestResults) => {
    // Handle test completion
    setTestStarted(false)
    onOpenChange(false)
  }

  const toggleUnit = (unitId: string) => {
    setSelectedUnits((current) =>
      current.includes(unitId) ? current.filter((id) => id !== unitId) : [...current, unitId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("p-0", testStarted ? "sm:max-w-[90vw] h-[90vh]" : "sm:max-w-[600px]")}>
        {testStarted ? (
          selectedCourse === "cs-a" && (testType === "past-frq" || testType === "frq") ? (
            <CSTestInterface
              questions={questions}
              onComplete={handleTestComplete}
              timeLimit={testType === "past-frq" ? 60 : 240}
            />
          ) : (
            <TestInterface
              questions={questions}
              onComplete={handleTestComplete}
              timeLimit={testType === "full" ? 240 : 60}
              testType={testType}
              difficulty={difficulty}
              selectedUnits={selectedUnits}
            />
          )
        ) : (
          <>
            <DialogClose
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className="fixed top-0 left-0 w-full h-2 bg-muted rounded-t-lg">
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out rounded-t-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            <DialogHeader className="p-6 pb-4">
              <DialogTitle>
                {testType === "past-frq" && step === 1 ? "Past FRQs" : "Practice Simulator"}
              </DialogTitle>
              <DialogDescription>
                {testType === "past-frq" && step === 1 
                  ? "Choose from past FRQs or add new ones to practice with"
                  : step === 0
                    ? "Choose the type of practice test you want to take"
                    : "Customize your practice test settings"
                }
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 px-6">
              {step === 0 && (
                <div className="grid gap-4">
                  {testTypes.map((type) => (
                    <Card
                      key={type.id}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/50",
                        testType === type.id && "border-primary",
                      )}
                      onClick={() => setTestType(type.id)}
                    >
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            testType === type.id ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <type.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {type.title}
                            {testType === type.id && <Check className="h-4 w-4" />}
                          </CardTitle>
                          <CardDescription>{type.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">{type.duration}</Badge>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              {step === 1 && testType !== "past-frq" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Course</Label>
                    <Select value={selectedCourse} onValueChange={(value: CourseId) => setSelectedCourse(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(courseConfigs) as CourseId[]).map((courseId) => (
                          <SelectItem key={courseId} value={courseId}>
                            {courseConfigs[courseId].name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {currentCourseConfig ? (
                    <div className="space-y-4">
                      <Label>Select Units to Practice</Label>
                      <div className="grid gap-4">
                        {currentCourseConfig.units.map((unit: CourseUnit) => (
                          <div key={unit.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={unit.id}
                              checked={selectedUnits.includes(unit.id)}
                              onCheckedChange={() => toggleUnit(unit.id)}
                            />
                            <Label
                              htmlFor={unit.id}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {unit.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>Course configuration not found. Please select a different course.</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <Label>Number of Questions</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Questions: {questionCount}</span>
                    </div>
                    <Slider
                      value={[questionCount]}
                      min={5}
                      max={testType === "full" ? 55 : 30}
                      step={1}
                      onValueChange={(value) => setQuestionCount(value[0])}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Difficulty Level</Label>
                    <RadioGroup value={difficulty} onValueChange={setDifficulty}>
                      {difficultyLevels.map((level) => (
                        <div key={level.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={level.value} id={level.value} />
                          <Label htmlFor={level.value}>{level.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {testType === "past-frq" && step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Course</Label>
                    <Select value={selectedCourse} onValueChange={(value: CourseId) => setSelectedCourse(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(courseConfigs) as CourseId[]).map((courseId) => (
                          <SelectItem key={courseId} value={courseId}>
                            {courseConfigs[courseId].name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <PastFRQManager
                    course={selectedCourse}
                    onSelectFRQ={(frq) => {
                      setSelectedPastFRQ(frq);
                      handleNext();
                    }}
                  />
                </div>
              )}

              {step === 2 && testType !== "past-frq" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Test Summary</CardTitle>
                    <CardDescription>Review your test configuration before starting</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Course:</span>
                        <span className="font-medium">{currentCourseConfig.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Test Type:</span>
                        <span className="font-medium">{testTypes.find((t) => t.id === testType)?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Selected Units:</span>
                        <span className="font-medium text-right">
                          {selectedUnits.length === 0
                            ? "No units selected"
                            : currentCourseConfig.units
                                .filter((unit: CourseUnit) => selectedUnits.includes(unit.id))
                                .map((unit: CourseUnit) => unit.label)
                                .join(", ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Questions:</span>
                        <span className="font-medium">{questionCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Difficulty:</span>
                        <span className="font-medium capitalize">{difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Time:</span>
                        <span className="font-medium">{testTypes.find((t) => t.id === testType)?.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Timer will start when you begin the test</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>You can pause the test at any time</span>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </div>

            {isLoading && (
              <div className="fixed inset-0 bg-background/80 flex flex-col items-center justify-center z-50">
                <div className="w-[300px] space-y-4">
                  <div className="space-y-2 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <h3 className="font-semibold">Loading your practice question</h3>
                    <p className="text-sm text-muted-foreground">
                      Preparing the selected FRQ for practice...
                    </p>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-in-out"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    This may take a few seconds. Please wait...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="mx-6 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="p-6 pt-4">
              <div className="flex w-full justify-between">
                <Button variant="outline" onClick={handleBack} disabled={step === 0 || isLoading}>
                  Back
                </Button>
                {!(testType === "past-frq" && step === 1) && (
                  <Button 
                    onClick={handleNext} 
                    disabled={(step === 1 && selectedUnits.length === 0) || isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {step === 2 ? "Generating Test..." : "Next"}
                      </>
                    ) : (
                      <>
                        {step === 2 ? "Start Test" : "Next"}
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

