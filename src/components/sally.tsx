"use client"

import { useState, useEffect, useContext } from "react"
import { Bot, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { UserContext } from "@/context/UserContext"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { toast } from "@/components/ui/use-toast"
import { BotMessage, UserMessage } from "./Chatbot/Components/Messages"

interface Message {
  role: "user" | "assistant"
  content: string
  id?: string
}

interface UserSettings {
  gpt_version: string
  tone: string
  essay_length: string
  essay_style: string
  include_examples: boolean
  custom_instructions: string
}

export function SallyAIConsultant() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm Sally, your AI study consultant. How can I help you today?",
      id: "initial" 
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { userData } = useContext(UserContext)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)

  useEffect(() => {
    const loadUserSettings = async () => {
      const supabase = createSupabaseBrowserClient()
      const { data: session } = await supabase.auth.getSession()
      
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("users")
          .select("gpt_version, tone, essay_length, essay_style, include_examples, custom_instructions")
          .eq("uid", session.user.id)
          .single()

        if (data && !error) {
          setUserSettings(data)
        }
      }
    }

    loadUserSettings()
  }, [userData])

  const generateSystemPrompt = (settings: UserSettings) => {
    return `You are Sally, an AI study consultant. 
    Tone: ${settings.tone}
    Writing Style: ${settings.essay_style}
    Length Preference: ${settings.essay_length}
    ${settings.custom_instructions ? `Additional Instructions: ${settings.custom_instructions}` : ''}
    ${settings.include_examples ? 'Please include relevant examples in your responses.' : ''}
    `
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    try {
      setIsLoading(true)
      const newUserMessage: Message = { role: "user", content: input, id: Date.now().toString() }
      const newAssistantMessage: Message = { role: "assistant", content: "", id: (Date.now() + 1).toString() }
      
      setMessages(prev => [...prev, newUserMessage, newAssistantMessage])
      setInput("")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
          systemPrompt: userSettings ? generateSystemPrompt(userSettings) : "",
          model: userSettings?.gpt_version || "gpt-3.5-turbo"
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No response reader")

      let accumulatedResponse = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        
        // Extract the actual text content from the numbered format
        const tokens = chunk.match(/0:\s*"([^"]*)"/g) || []
        const cleanedChunk = tokens
          .map(token => token.replace(/0:\s*"([^"]*)"/, '$1'))
          .join('')
        
        accumulatedResponse += cleanedChunk

        // Update the message with the accumulated response
        setMessages(prev => prev.map(msg => 
          msg.id === newAssistantMessage.id 
            ? { ...msg, content: accumulatedResponse } 
            : msg
        ))
      }

    } catch (error) {
      console.error("Chat error:", error)
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive"
      })
      setMessages(prev => prev.filter(msg => msg.id !== (Date.now() + 1).toString()))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[calc(110vh-30.3rem)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Sally AI Consultant
        </CardTitle>
        <CardDescription>Your personal study assistant</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="pr-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" ? (
                  <BotMessage content={message.content} />
                ) : (
                  <UserMessage>{message.content}</UserMessage>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input 
            placeholder="Type your question..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

