export interface TestResults {
  score: number
  maxScore: number
  timeSpent: number
  feedback: {
    [questionId: string]: {
      score: number
      comments: string[]
    }
  }
}

export interface BaseQuestion {
  id: string
  type: "mcq" | "frq"
  content: string
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced" | "ap-level"
  title?: string
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

export type TestType = "mcq" | "frq" | "full" | "past-frq" 