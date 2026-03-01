"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Lightbulb, Zap, Target } from "lucide-react"
import { UnitProgress } from "@/components/unit-progress"
import { AIPracticeCard } from "@/components/ai-practice-card"
import { CourseSelector } from "@/components/course-selector"
import { LessonBlurbs } from "@/components/lesson-blurbs"
import { Flashcards } from "@/components/flashcards"
import { SuggestedPractice } from "@/components/suggested-practice"

export default function DashboardPage() {
  const [selectedCourse, setSelectedCourse] = useState("calc-ab")

  return (
    <div className="min-h-screen bg-background">
      <div className="container space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">AP Calculus</h1>
            <p className="text-muted-foreground">Master calculus with AI-powered practice and real exam questions</p>
          </div>
          <CourseSelector selectedCourse={selectedCourse} onCourseChange={setSelectedCourse} />
        </div>

        <section>
          <div className="grid gap-6 md:grid-cols-3">
            <AIPracticeCard
              title="Quick MCQ Practice"
              description="Generate a set of multiple-choice questions focused on your current unit"
              duration="20-30 mins"
              questionCount={15}
              type="mcq"
              onGenerate={() => {}}
            />
            <AIPracticeCard
              title="AI FRQ Practice"
              description="Practice with AI-generated free-response questions similar to the AP exam"
              duration="30-45 mins"
              questionCount={3}
              type="frq"
              onGenerate={() => {}}
            />
            <AIPracticeCard
              title="DBQ Practice"
              description="Work on document-based questions with detailed scoring rubrics"
              duration="45-60 mins"
              questionCount={1}
              type="dbq"
              onGenerate={() => {}}
            />
          </div>
        </section>

        <Tabs defaultValue="progress" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              <span>Unit Progress</span>
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              <span>Lesson Blurbs</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span>Flashcards</span>
            </TabsTrigger>
            <TabsTrigger value="suggested-practice" className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span>Suggested Practice</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-6">
            <UnitProgress />
          </TabsContent>

          <TabsContent value="lessons" className="mt-6">
            <LessonBlurbs />
          </TabsContent>

          <TabsContent value="flashcards" className="mt-6">
            <Flashcards />
          </TabsContent>

          <TabsContent value="suggested-practice" className="mt-6">
            <SuggestedPractice />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

