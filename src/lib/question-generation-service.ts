import { CourseId } from './course-config'
import { QuestionTopicMapper, TopicAnalysis } from './question-topic-mapper'

export interface GeneratedQuestion {
  id: number
  type: "mcq" | "frq"
  content: string
  subject?: string // Course name (e.g., Biology, Chemistry)
  difficulty?: string // Easy, Medium, Hard
  options?: Array<{
    label: string
    text: string
  }>
  correctAnswer?: string
  explanation?: string
  rubric?: {
    points: number
    criteria: string[]
  }
  sampleResponse?: string
}

export interface QuestionGenerationRequest {
  topic: string
  course?: CourseId
  units?: string[]
  difficulty?: "beginner" | "intermediate" | "advanced" | "ap-level"
  questionCount?: number
  testType?: "mcq" | "frq" | "full"
}

export interface QuestionGenerationResponse {
  questions: GeneratedQuestion[]
  metadata: {
    detectedCourse: CourseId
    detectedUnits: string[]
    confidence: number
    processingTime: number
  }
}

export interface QuestionGenerationError {
  code: 'TOPIC_ANALYSIS_FAILED' | 'API_ERROR' | 'PARSING_ERROR' | 'NETWORK_ERROR' | 'RATE_LIMIT' | 'UNKNOWN_ERROR'
  message: string
  details?: any
  retryable: boolean
}

export class QuestionGenerationService {
  private static readonly API_ENDPOINT = '/api/generate-questions'
  private static readonly DEFAULT_TIMEOUT = 30000 // 30 seconds
  private static readonly MAX_RETRIES = 3
  private static readonly RETRY_DELAY = 1000 // 1 second

  /**
   * Generates a question based on a topic string
   */
  static async generateQuestion(
    request: QuestionGenerationRequest
  ): Promise<{ success: true; data: QuestionGenerationResponse } | { success: false; error: QuestionGenerationError }> {
    const startTime = Date.now()

    try {
      console.log('🚀 Starting AI-powered question generation for topic:', request.topic)

      // Step 1: Prepare API request with user's natural language topic
      const apiRequest = {
        topic: request.topic,  // Pass the raw topic to AI for intelligent processing
        testType: request.testType || "mcq" as const,
        questionCount: request.questionCount || 1,
        difficulty: request.difficulty || "intermediate"
      }

      console.log('🚀 API Request:', JSON.stringify(apiRequest, null, 2))

      // Step 2: Call the API with retry logic
      const apiResponse = await this.callApiWithRetry(apiRequest)

      // Step 3: Process and validate response
      const questions = this.processApiResponse(apiResponse)
      
      if (questions.length === 0) {
        throw new Error('No questions generated from API response')
      }

      // Step 4: Enhance questions with explanations if missing
      const enhancedQuestions = await this.enhanceQuestions(questions, request.topic)

      const processingTime = Date.now() - startTime

      return {
        success: true,
        data: {
          questions: enhancedQuestions,
          metadata: {
            detectedCourse: "ai-detected", // AI handles subject detection internally
            detectedUnits: ["dynamic"], // AI handles unit detection internally
            confidence: 1.0, // AI is confident in its analysis
            processingTime
          }
        }
      }

    } catch (error) {
      console.error('❌ Question generation failed:', error)
      
      return {
        success: false,
        error: this.categorizeError(error)
      }
    }
  }

  /**
   * Calls the API with retry logic for transient failures
   */
  private static async callApiWithRetry(request: { topic: string; testType: string; questionCount: number; difficulty: string }, attempt = 1): Promise<any> {
    try {
      console.log(`📡 API call attempt ${attempt}/${this.MAX_RETRIES}`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.DEFAULT_TIMEOUT)

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 429 && attempt < this.MAX_RETRIES) {
          // Rate limit - wait longer before retry
          console.log('⏳ Rate limited, waiting before retry...')
          await this.delay(this.RETRY_DELAY * attempt * 2)
          return this.callApiWithRetry(request, attempt + 1)
        }
        
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      return data

    } catch (error) {
      if (attempt < this.MAX_RETRIES && this.isRetryableError(error)) {
        const errorMessage = (error as any)?.message || 'Unknown error'
        console.log(`🔄 Retrying after error: ${errorMessage}`)
        await this.delay(this.RETRY_DELAY * attempt)
        return this.callApiWithRetry(request, attempt + 1)
      }
      
      throw error
    }
  }

  /**
   * Processes the raw API response into our question format
   */
  private static processApiResponse(apiResponse: any): GeneratedQuestion[] {
    if (!apiResponse.questions || !Array.isArray(apiResponse.questions)) {
      throw new Error('Invalid API response format: missing questions array')
    }

    return apiResponse.questions.map((q: any, index: number) => {
      // Validate required fields
      if (!q.content) {
        throw new Error(`Question ${index} missing content`)
      }

      const question: GeneratedQuestion = {
        id: q.id || index,
        type: q.type || "mcq",
        content: q.content,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        rubric: q.rubric,
        sampleResponse: q.sampleResponse
      }

      // Validate MCQ questions have options and correct answer
      if (question.type === "mcq") {
        if (!question.options || question.options.length === 0) {
          throw new Error(`MCQ question ${index} missing options`)
        }
        if (!question.correctAnswer) {
          console.warn(`MCQ question ${index} missing correct answer`)
        }
      }

      return question
    })
  }

  /**
   * Enhances questions with explanations if they're missing
   */
  private static async enhanceQuestions(
    questions: GeneratedQuestion[], 
    originalTopic: string
  ): Promise<GeneratedQuestion[]> {
    return questions.map(question => {
      // If explanation is missing, generate a basic one
      if (!question.explanation && question.type === "mcq" && question.correctAnswer) {
        question.explanation = this.generateBasicExplanation(question, originalTopic)
      }

      return question
    })
  }

  /**
   * Generates a basic explanation for questions missing one
   */
  private static generateBasicExplanation(question: GeneratedQuestion, topic: string): string {
    const correctOption = question.options?.find(opt => opt.label === question.correctAnswer)
    
    if (!correctOption) {
      return `This question tests your understanding of ${topic}. Review the relevant concepts and try again.`
    }

    return `The correct answer is ${question.correctAnswer}: ${correctOption.text}. This question covers key concepts in ${topic}. For a detailed explanation, please refer to your course materials or ask for clarification.`
  }

  /**
   * Categorizes errors for better handling
   */
  private static categorizeError(error: unknown): QuestionGenerationError {
    const errorObj = error as any // Type assertion for error handling
    
    if (errorObj?.name === 'AbortError') {
      return {
        code: 'NETWORK_ERROR',
        message: 'Request timed out',
        details: error,
        retryable: true
      }
    }

    const errorMessage = errorObj?.message || ''

    if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
      return {
        code: 'RATE_LIMIT',
        message: 'API rate limit exceeded. Please try again in a moment.',
        details: error,
        retryable: true
      }
    }

    if (errorMessage.includes('parse') || errorMessage.includes('JSON')) {
      return {
        code: 'PARSING_ERROR',
        message: 'Failed to parse API response',
        details: error,
        retryable: true
      }
    }

    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error occurred',
        details: error,
        retryable: true
      }
    }

    if (errorMessage.includes('API returned')) {
      return {
        code: 'API_ERROR',
        message: errorMessage,
        details: error,
        retryable: false
      }
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: errorMessage || 'An unknown error occurred',
      details: error,
      retryable: true
    }
  }

  /**
   * Determines if an error is retryable
   */
  private static isRetryableError(error: any): boolean {
    const retryableErrors = [
      'fetch',
      'network',
      'timeout',
      'ECONNRESET',
      'ENOTFOUND',
      'ECONNREFUSED'
    ]

    const errorMessage = error.message?.toLowerCase() || ''
    return retryableErrors.some(keyword => errorMessage.includes(keyword))
  }

  /**
   * Utility function for delays
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Gets a user-friendly error message in Pearson's voice
   */
  static getErrorMessage(error: QuestionGenerationError): string {
    switch (error.code) {
      case 'RATE_LIMIT':
        return "I'm getting a lot of requests right now! Give me a moment to catch up, then try asking for a question again."
      case 'NETWORK_ERROR':
        return "I'm having trouble connecting to my question generator at the moment. Try again in a few seconds?"
      case 'PARSING_ERROR':
        return "Something got scrambled when I was creating your question. Let me try again - ask me for another question!"
      case 'API_ERROR':
        return "My question generator is having a hiccup right now. Try asking for a different topic or come back in a bit!"
      case 'TOPIC_ANALYSIS_FAILED':
        return "I'm not quite sure what subject you're asking about. Could you be more specific? Like 'generate a calculus question' or 'create a statistics problem'?"
      default:
        return "I'm having trouble generating a question right now. Try asking again, or let me know if you need help with something else!"
    }
  }
}
