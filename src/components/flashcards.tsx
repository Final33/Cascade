"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Rotate3D } from "lucide-react"

const flashcards = [
  {
    id: 1,
    front: "What is the definition of a limit?",
    back: "A limit is the value that a function approaches as the input (usually x) gets closer to a specific value.",
  },
  {
    id: 2,
    front: "What is the chain rule used for?",
    back: "The chain rule is used to find the derivative of a composite function.",
  },
  {
    id: 3,
    front: "What is the fundamental theorem of calculus?",
    back: "The fundamental theorem of calculus states that differentiation and integration are inverse processes.",
  },
]

export function Flashcards() {
  const [currentFlashcard, setCurrentFlashcard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const nextFlashcard = () => {
    setCurrentFlashcard((prev) => (prev + 1) % flashcards.length)
    setShowAnswer(false)
  }

  const prevFlashcard = () => {
    setCurrentFlashcard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setShowAnswer(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Flashcards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="relative h-[200px] cursor-pointer"
          onClick={() => setShowAnswer(!showAnswer)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setShowAnswer(!showAnswer)
            }
          }}
        >
          <div
            className={`
              absolute inset-0 rounded-lg bg-card
              transition-all duration-300 ease-in-out
              ${showAnswer ? "rotate-y-180 opacity-0" : "rotate-y-0 opacity-100"}
            `}
          >
            <div className="flex h-full items-center justify-center p-6 text-center border rounded-lg">
              <p className="text-lg">{flashcards[currentFlashcard].front}</p>
            </div>
          </div>
          <div
            className={`
              absolute inset-0 rounded-lg bg-card
              transition-all duration-300 ease-in-out
              ${showAnswer ? "rotate-y-0 opacity-100" : "rotate-y-180 opacity-0"}
            `}
          >
            <div className="flex h-full items-center justify-center p-6 text-center border rounded-lg">
              <p className="text-lg">{flashcards[currentFlashcard].back}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
          <Button onClick={prevFlashcard} variant="outline" size="icon" aria-label="Previous flashcard">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {currentFlashcard + 1} of {flashcards.length}
            </span>
            <Button onClick={() => setShowAnswer(!showAnswer)} variant="ghost" size="sm" aria-label="Flip card">
              <Rotate3D className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={nextFlashcard} variant="outline" size="icon" aria-label="Next flashcard">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

