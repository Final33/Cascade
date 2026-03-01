"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import AskPearsonSidebar from "@/components/Dashboard/AskPearsonSidebar"
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  BookOpen, 
  Calendar,
  Upload,
  MessageSquare,
  ChevronLeft,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatHistoryService } from "@/lib/supabase/chat-history"
import type { ChatSession, ChatMessage } from "@/types/chat"
import { QuestionDisplay } from "@/components/QuestionDisplay"
import { QuestionGenerationService } from "@/lib/question-generation-service"

// Function to properly format Pearson AI messages with correct bullet point formatting
function formatPearsonMessage(content: string): string {
  return content
    // Handle bold and italic formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Handle headers
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-gray-900 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-6 mb-4">$1</h1>')
    
    // Handle bullet points by wrapping consecutive bullets in <ul> tags
    .replace(/(^[\*•\-] .*$(\n^[\*•\-] .*$)*)/gm, (match) => {
      const listItems = match
        .split('\n')
        .map(line => line.replace(/^[\*•\-] (.*)$/, '<li class="mb-2 text-lg leading-relaxed">$1</li>'))
        .join('');
      return `<ul class="list-disc pl-6 mb-4 space-y-2">${listItems}</ul>`;
    })
    
    // Handle numbered lists by wrapping consecutive numbered items in <ol> tags
    .replace(/(^\d+\. .*$(\n^\d+\. .*$)*)/gm, (match) => {
      const listItems = match
        .split('\n')
        .map(line => line.replace(/^\d+\. (.*)$/, '<li class="mb-2 text-lg leading-relaxed">$1</li>'))
        .join('');
      return `<ol class="list-decimal pl-6 mb-4 space-y-2">${listItems}</ol>`;
    })
    
    // Handle paragraphs
    .replace(/\n\n/g, '</p><p class="mb-3 text-lg leading-relaxed">')
    .replace(/^(?!<[h|l|u|o])/gm, '<p class="mb-3 text-lg leading-relaxed">')
    .replace(/<\/p>$/, '</p>');
}

// Using types from @/types/chat instead of local interfaces

export default function AskPearsonPage() {
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isGenerateQuestionMode, setIsGenerateQuestionMode] = useState(false)
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false)
  const [generatedQuestion, setGeneratedQuestion] = useState<any>(null)
  const [questionGenerationStatus, setQuestionGenerationStatus] = useState<string>('')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle drag & drop functionality
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      setUploadedImages(prev => [...prev, ...imageFiles.slice(0, 5 - prev.length)])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      setUploadedImages(prev => [...prev, ...imageFiles.slice(0, 5 - prev.length)])
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // Load chat sessions from Supabase on mount
  useEffect(() => {
    loadChatSessions().catch(console.error)
    // Check for localStorage migration
    migrateLegacyData().catch(console.error)
  }, [])

  const loadChatSessions = async () => {
    try {
      const chatService = new ChatHistoryService()
      const result = await chatService.getUserChatSessions({ 
        limit: 50,
        archived: false 
      })
      
      if (result.success && result.data) {
        setChatSessions(result.data.sessions)
      } else {
        console.error('Failed to load chat sessions:', result.error)
        // Continue without chat sessions - question generation should still work
        setChatSessions([])
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error)
      // Continue without chat sessions - question generation should still work
      setChatSessions([])
    }
  }

  const migrateLegacyData = async () => {
    try {
      const chatService = new ChatHistoryService()
      const result = await chatService.migrateChatHistoryFromLocalStorage()
      if (result.success && result.data && result.data.migratedSessions > 0) {
        console.log(`Migrated ${result.data.migratedSessions} sessions from localStorage`)
        // Reload sessions after migration
        loadChatSessions()
      }
    } catch (error) {
      console.error('Error migrating legacy data:', error)
    }
  }

  // Load current session messages when session changes
  useEffect(() => {
    if (currentSession && !currentSession.messages) {
      loadSessionMessages(currentSession.id)
    }
  }, [currentSession])

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const chatService = new ChatHistoryService()
      const result = await chatService.getChatSessionWithMessages(sessionId)
      if (result.success && result.data) {
        setCurrentSession(result.data)
      } else {
        console.error('Failed to load session messages:', result.error)
      }
    } catch (error) {
      console.error('Error loading session messages:', error)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages])

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const message = currentMessage.trim()
    setCurrentMessage('')
    setIsLoading(true)

    try {
      let sessionToUse = currentSession

      // Create new session if none exists
      if (!sessionToUse) {
        try {
          const chatService = new ChatHistoryService()
          const sessionResult = await chatService.createChatSession({
            title: message.length > 50 ? message.substring(0, 50) + '...' : message
          })

          if (sessionResult.success && sessionResult.data) {
            sessionToUse = { ...sessionResult.data, messages: [] }
            setCurrentSession(sessionToUse)
            setChatSessions(prev => [sessionToUse!, ...prev])
          } else {
            console.error('Failed to create session in Supabase:', sessionResult.error)
            setIsLoading(false)
            return
          }
                } catch (error) {
          console.error('Failed to create session:', error)
          setIsLoading(false)
          return
        }
      }

      // Check if we should generate a question
      if (shouldGenerateQuestion(message)) {
        console.log('Question generation triggered for message:', message) // Debug log
        
        // Add user message to Supabase
        try {
          const chatService = new ChatHistoryService()
          const userMessageResult = await chatService.addMessageToSession({
            session_id: sessionToUse.id,
            content: message,
            is_user: true
          })

          if (userMessageResult.success && userMessageResult.data) {
            const updatedSession = {
              ...sessionToUse,
              messages: [...(sessionToUse.messages || []), userMessageResult.data]
            }
            setCurrentSession(updatedSession)
          } else {
            console.error('Failed to save user message to Supabase:', userMessageResult.error)
            setIsLoading(false)
            return
          }
        } catch (error) {
          console.error('Failed to save message to database:', error)
          setIsLoading(false)
          return
        }

        // Generate question instead of regular AI response
        await generateQuestion(message)
        
        // Turn off generate question mode after generating
        setIsGenerateQuestionMode(false)
        
        setIsLoading(false)
        console.log('✅ Question generation complete, returning from handleSendMessage')
        return
      }

      // Regular message flow - Add user message to Supabase
      console.log('🔄 Starting regular message flow for:', message)
      const startTime = Date.now()
      let updatedSession = sessionToUse
      
      try {
        const chatService = new ChatHistoryService()
        const userMessageResult = await chatService.addMessageToSession({
          session_id: sessionToUse.id,
          content: message,
          is_user: true
        })

        if (userMessageResult.success && userMessageResult.data) {
          updatedSession = {
            ...sessionToUse,
            messages: [...(sessionToUse.messages || []), userMessageResult.data]
          }
          setCurrentSession(updatedSession)
        } else {
          console.error('Failed to save user message to Supabase:', userMessageResult.error)
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.error('Failed to save user message:', error)
        setIsLoading(false)
        return
      }

      // Call the Ask Pearson API
      console.log('📡 Calling Ask Pearson API...')
      try {
        const response = await fetch('/api/ask-pearson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            chatHistory: updatedSession.messages || []
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to get AI response')
        }

        const data = await response.json()
        const responseTime = Date.now() - startTime

        // Add AI message to Supabase
        try {
          const chatService = new ChatHistoryService()
          const aiMessageResult = await chatService.addMessageToSession({
            session_id: sessionToUse.id,
            content: data.message,
            is_user: false,
            response_time_ms: responseTime
          })

          if (aiMessageResult.success && aiMessageResult.data) {
            const finalSession = {
              ...updatedSession,
              messages: [...(updatedSession.messages || []), aiMessageResult.data]
            }
            setCurrentSession(finalSession)
              
              // Generate AI title after 2+ messages (user + AI response)
              if (finalSession.messages.length >= 2 && (finalSession.title.length > 20 || finalSession.title.includes('...'))) {
                generateChatTitle(finalSession.messages).then(aiTitle => {
                  if (aiTitle && aiTitle !== "Study Session" && aiTitle !== finalSession.title) {
                    handleRenameChat(finalSession.id, aiTitle)
                  }
                }).catch(error => {
                  console.error('Failed to generate AI title:', error)
                })
              }
              
              // Update sessions list
              setChatSessions(prev => prev.map(session => 
                session.id === finalSession.id 
                  ? { ...session, updated_at: new Date(), last_message_at: new Date() }
                  : session
              ))
          } else {
            console.error('Failed to save AI message to Supabase:', aiMessageResult.error)
            setIsLoading(false)
            return
          }
        } catch (error) {
          console.error('Failed to save AI message:', error)
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.error('Error calling Ask Pearson API:', error)
        // Show error message to user
        const errorMessage: ChatMessage = {
          id: 'error-msg-' + Date.now(),
          content: "I'm sorry, I'm having trouble responding right now. Please try again.",
          is_user: false
        } as ChatMessage
        
        const finalSession = {
          ...updatedSession,
          messages: [...(updatedSession.messages || []), errorMessage]
        }
        setCurrentSession(finalSession)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      // TODO: Show user-friendly error message
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSession(session)
    setGeneratedQuestion(null)
    setIsGenerateQuestionMode(false)
    // Reset question state
    setSelectedAnswer(null)
    setShowResults(false)
    setIsAnswerSubmitted(false)
  }

  const handleNewChat = () => {
    setCurrentSession(null)
    setGeneratedQuestion(null)
    setIsGenerateQuestionMode(false)
    // Reset question state
    setSelectedAnswer(null)
    setShowResults(false)
    setIsAnswerSubmitted(false)
  }

  const handleDeleteSession = async (sessionId: string) => {
    // Delegate to the main delete function
    await handleDeleteChat(sessionId)
  }

  const handleRenameChat = async (sessionId: string, newTitle: string) => {
    try {
      const chatService = new ChatHistoryService()
      const result = await chatService.updateChatSession(sessionId, { title: newTitle })
      if (result.success) {
        setChatSessions(prev => 
          prev.map(session => 
            session.id === sessionId 
              ? { ...session, title: newTitle }
              : session
          )
        )
        if (currentSession?.id === sessionId) {
          setCurrentSession(prev => prev ? { ...prev, title: newTitle } : null)
        }
      } else {
        console.error('Failed to rename chat:', result.error)
      }
    } catch (error) {
      console.error('Error renaming chat:', error)
    }
  }

  const handleDeleteChat = async (sessionId: string) => {
    try {
      const chatService = new ChatHistoryService()
      const result = await chatService.deleteChatSession(sessionId)
      if (result.success) {
        setChatSessions(prev => prev.filter(s => s.id !== sessionId))
        if (currentSession?.id === sessionId) {
          setCurrentSession(null)
        }
      } else {
        console.error('Failed to delete chat:', result.error)
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const generateChatTitle = async (messages: ChatMessage[]): Promise<string> => {
    try {
      const response = await fetch('/api/generate-chat-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.title || "Study Session"
      } else {
        console.error('Failed to generate chat title')
        return "Study Session"
      }
    } catch (error) {
      console.error('Error generating chat title:', error)
      return "Study Session"
    }
  }

  const shouldGenerateQuestion = (message: string): boolean => {
    const lowerMessage = message.toLowerCase()
    return isGenerateQuestionMode || 
           lowerMessage.includes('generate a question') || 
           lowerMessage.includes('generate question') || 
           lowerMessage.includes('create a question') ||
           lowerMessage.includes('create question') ||
           lowerMessage.includes('make a question') ||
           lowerMessage.includes('make question')
  }

  const generateQuestion = async (topic: string) => {
    console.log('🚀 Starting real question generation for topic:', topic)
    setIsGeneratingQuestion(true)
    setGeneratedQuestion(null) // Clear any existing question
    setQuestionGenerationStatus('Analyzing topic...')
    // Reset question state
    setSelectedAnswer(null)
    setShowResults(false)
    setIsAnswerSubmitted(false)
    
    try {
      setQuestionGenerationStatus('Detecting course and units...')
      await new Promise(resolve => setTimeout(resolve, 500)) // Brief pause for UX
      
      setQuestionGenerationStatus('Generating AI question...')
      // Call the real API service
      const result = await QuestionGenerationService.generateQuestion({
        topic: topic,
        questionCount: 1,
        testType: "mcq"
      })

      if (result.success) {
        setQuestionGenerationStatus('Formatting question...')
        const apiQuestion = result.data.questions[0]
        console.log('✅ Question generated successfully:', result.data.metadata)
        
        // Transform API response to our UI format
        // Use AI-provided subject and difficulty information
        const courseName = apiQuestion.subject || "AP Subject"
        const difficulty = apiQuestion.difficulty || "Medium"
        
        const uiQuestion = {
          title: `${courseName} Question`,
          subject: difficulty,
          difficulty: "AP Level",
          question: apiQuestion.content,
          options: apiQuestion.options || [],
          correctAnswer: apiQuestion.correctAnswer,
          explanation: apiQuestion.explanation || `This question tests your understanding of the topic: ${topic}`
        }
        
        setQuestionGenerationStatus('Question ready!')
        await new Promise(resolve => setTimeout(resolve, 300)) // Brief pause to show success
        setGeneratedQuestion(uiQuestion)

        // Add the generated question to chat history for persistence
        if (currentSession) {
          const questionMessage: ChatMessage = {
            id: 'question-' + Date.now(),
            session_id: currentSession.id,
            content: `I've generated a ${courseName} question for you! You can select an answer and check your understanding.`,
            is_user: false,
            message_order: (currentSession.messages?.length || 0) + 1,
            created_at: new Date(),
            question_data: JSON.stringify(uiQuestion) // Store the question data
          }
          
          // Add to local state immediately
          const updatedSession = {
            ...currentSession,
            messages: [...(currentSession.messages || []), questionMessage]
          }
          setCurrentSession(updatedSession)

          // Save to database
          try {
            const chatService = new ChatHistoryService()
            await chatService.addMessageToSession({
              session_id: currentSession.id,
              content: questionMessage.content,
              is_user: false,
              metadata: { question_data: uiQuestion } // Store question in metadata
            })
          } catch (error) {
            console.error('Failed to save question to chat history:', error)
          }
        }
      } else {
        console.error('❌ API generation failed:', result.error)
        
        // Add error message to chat as a regular Pearson response
        const errorMessage = QuestionGenerationService.getErrorMessage(result.error)
        
        // Add the error message to the current session
        if (currentSession) {
          const errorChatMessage: ChatMessage = {
            id: 'error-msg-' + Date.now(),
            session_id: currentSession.id,
            content: errorMessage,
            is_user: false,
            message_order: (currentSession.messages?.length || 0) + 1,
            created_at: new Date()
          }
          
          const updatedSession = {
            ...currentSession,
            messages: [...(currentSession.messages || []), errorChatMessage]
          }
          setCurrentSession(updatedSession)
        }
        
        console.warn('⚠️ Question generation failed:', result.error.message)
      }
      
    } catch (error) {
      console.error('💥 Unexpected error during question generation:', error)
      
      // Show error message in chat
      const errorMessage = "I'm having trouble generating a question right now. Try asking again, or let me know if you need help with something else!"
      
      // Add the error message to the current session
      if (currentSession) {
        const errorChatMessage: ChatMessage = {
          id: 'error-msg-' + Date.now(),
          session_id: currentSession.id,
          content: errorMessage,
          is_user: false,
          message_order: (currentSession.messages?.length || 0) + 1,
          created_at: new Date()
        }
        
        const updatedSession = {
          ...currentSession,
          messages: [...(currentSession.messages || []), errorChatMessage]
        }
        setCurrentSession(updatedSession)
      }
    } finally {
      setIsGeneratingQuestion(false)
      setQuestionGenerationStatus('')
      console.log('🏁 Question generation complete')
    }
  }

  const handleAnswerSelect = (optionLabel: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(optionLabel)
    }
  }

  const handleCheckAnswer = () => {
    if (selectedAnswer && generatedQuestion && !isAnswerSubmitted) {
      setIsAnswerSubmitted(true)
      setShowResults(true)
    }
  }

  const handleNewQuestion = () => {
    setGeneratedQuestion(null)
    setSelectedAnswer(null)
    setShowResults(false)
    setIsAnswerSubmitted(false)
  }





  const handleSuggestionClick = async (suggestion: string) => {
    setCurrentMessage(suggestion)
    
    // Create a temporary message to send
    const tempMessage = suggestion
    setCurrentMessage('')
    setIsLoading(true)

    // Create new session if none exists
    if (!currentSession) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        user_id: '',
        title: tempMessage.length > 50 ? tempMessage.substring(0, 50) + '...' : tempMessage,
        subject: undefined,
        topic: undefined,
        message_count: 0,
        messages: [],
        created_at: new Date(),
        updated_at: new Date(),
        last_message_at: new Date(),
        is_archived: false,
        is_favorite: false
      }
      setCurrentSession(newSession)
      setChatSessions(prev => [newSession, ...prev])
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      session_id: currentSession?.id || '',
      content: tempMessage,
      is_user: true,
      message_order: (currentSession?.messages?.length || 0) + 1,
      created_at: new Date()
    }

    const updatedSession = {
      ...currentSession!,
      messages: [...(currentSession?.messages || []), userMessage]
    }
    setCurrentSession(updatedSession)

    try {
      // Call the Ask Pearson API
      const response = await fetch('/api/ask-pearson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: tempMessage,
          chatHistory: updatedSession.messages || []
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        session_id: currentSession?.id || '',
        content: data.message,
        is_user: false,
        message_order: (updatedSession.messages?.length || 0) + 1,
        created_at: new Date()
      }

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage]
      }
      
      setCurrentSession(finalSession)
      setChatSessions(prev => prev.map(session => 
        session.id === finalSession.id ? finalSession : session
      ))

    } catch (error) {
      console.error('Error sending suggestion:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Combined Sidebar */}
      <AskPearsonSidebar
        chatSessions={chatSessions}
        currentSession={currentSession}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        userData={userData}
        userPlan="free"

      />

      {/* Main Chat Area */}
      <div 
        className="flex-1 flex flex-col"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          {!currentSession || !currentSession.messages || currentSession.messages.length === 0 ? (
            /* Welcome Screen */
            <div className="h-full flex flex-col items-center justify-center p-8 relative">
              {/* Drag overlay */}
              {isDragOver && (
                <div className="absolute inset-0 bg-blue-50 bg-opacity-90 border-2 border-dashed border-blue-400 flex items-center justify-center z-10">
                  <div className="text-center">
                    <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-blue-700">Drop images here</p>
                    <p className="text-blue-600">PNG, JPG, GIF up to 5 images</p>
                  </div>
                </div>
              )}

              <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Hi Aarnav! What can I help with?
                  </h1>
                  <p className="text-xl text-gray-600">Ask me anything or try one of these:</p>
                </div>

                {/* Suggestion Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div 
                    onClick={() => handleSuggestionClick("What are the most important concepts to know on the SAT?")}
                    className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      What are the most important concepts to know on the SAT?
                    </h3>
                    <p className="text-sm text-gray-600">Get helpful information</p>
                  </div>

                  <div 
                    onClick={() => handleSuggestionClick("Generate a question about Linear Equations")}
                    className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Generate a question about Linear Equations
                    </h3>
                    <p className="text-sm text-gray-600">Generate a practice question</p>
                  </div>

                  <div 
                    onClick={() => handleSuggestionClick("How should I prepare today? Based on my personalized study plan")}
                    className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      How should I prepare today?
                    </h3>
                    <p className="text-sm text-gray-600">Based on your personalized study plan</p>
                  </div>
                </div>

                {/* File Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "bg-white rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200",
                    isDragOver 
                      ? "border-blue-400 bg-blue-50" 
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  )}
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Drag & drop images here
                  </h3>
                  <p className="text-gray-600 mb-4">PNG, JPG, GIF up to 5 images</p>
                  <Button variant="outline" className="text-sm">
                    Or click to browse
                  </Button>
                </div>

                {/* Image Previews */}
                {uploadedImages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Images ({uploadedImages.length}/5)</h4>
                    <div className="flex flex-wrap gap-3">
                      {uploadedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate w-20">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {currentSession.messages?.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
                      message.is_user ? "justify-end" : "justify-start"
                    )}
                  >
                    {!message.is_user && (
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white text-sm font-bold">P</span>
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-3xl rounded-2xl px-6 py-4 shadow-sm",
                        message.is_user
                          ? "bg-blue-600 text-white ml-12"
                          : "bg-white border border-gray-200"
                      )}
                    >
                      <div className={cn(
                        "whitespace-pre-wrap leading-relaxed font-medium",
                        message.is_user 
                          ? "text-white text-lg" 
                          : "text-gray-900 text-lg"
                      )}>
                        {message.is_user ? (
                          message.content
                        ) : (
                          <div 
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: formatPearsonMessage(message.content)
                            }}
                          />
                        )}
                      </div>

                    </div>
                    {message.is_user && (
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white text-sm font-semibold">A</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Question Generation Display */}
                {(isGeneratingQuestion || generatedQuestion) && (
                  <div className="flex gap-4 justify-start animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white text-sm font-bold">P</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <QuestionDisplay 
                        isLoading={isGeneratingQuestion}
                        questionData={generatedQuestion}
                        selectedAnswer={selectedAnswer}
                        showResults={showResults}
                        isAnswerSubmitted={isAnswerSubmitted}
                        loadingStatus={questionGenerationStatus}
                        onAnswerSelect={handleAnswerSelect}
                        onCheckAnswer={handleCheckAnswer}
                        onNewQuestion={handleNewQuestion}
                      />
                    </div>
                  </div>
                )}
                
                {isLoading && !isGeneratingQuestion && (
                  <div className="flex gap-4 justify-start animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-gray-700 text-lg font-medium">Pearson is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Image Previews in Input */}
            {uploadedImages.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Send a message..."
                className="w-full resize-none border-gray-300 rounded-2xl pr-32 py-4 px-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                rows={1}
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsGenerateQuestionMode(!isGenerateQuestionMode)}
                  className={cn(
                    "text-xs px-2 h-8 transition-colors",
                    isGenerateQuestionMode
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Sparkles className={cn(
                    "w-4 h-4 mr-1",
                    isGenerateQuestionMode ? "text-blue-600" : ""
                  )} />
                  Generate question
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 h-8 px-4 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
