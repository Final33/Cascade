export interface PastFRQ {
  id: string
  year: number
  questionNumber: number
  title: string
  content: string
  topics: string[]
  rubric: {
    points: number
    criteria: string[]
  }
  sampleResponse?: string
  course: string
}

export interface FRQCollection {
  [id: string]: PastFRQ
} 