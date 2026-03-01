"use client"
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React, { useState, useEffect } from "react"
import { PracticeHistoryList, type Test } from "@/components/practice-history-list"
import { PracticeHistoryFilters } from "@/components/practice-history-filters"
import { PracticeHistoryStats } from "@/components/practice-history-stats"
import { getUserTestHistory, getTestDetails } from "@/lib/supabase/test-results"
import { TestReviewDialog } from "@/components/test-review-dialog"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import BetaGate from "@/components/Dashboard/BetaGate"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"

interface FormattedTestResults {
  questions: any[]
  score: number
  totalTime: number
  completedAt: Date
}

export default function PracticeHistoryPage() {
  const [activeFilters, setActiveFilters] = useState({
    type: "all",
    date: "all",
  })

  const [testHistory, setTestHistory] = useState<Test[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)

  const [isReviewLoading, setIsReviewLoading] = useState(false)
  const [testReviewOpen, setTestReviewOpen] = useState(false)
  const [selectedTestDetails, setSelectedTestDetails] = useState<FormattedTestResults | null>(null)
  
  const [userData, setUserData] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createSupabaseBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: userData } = await supabase
            .from('users')
            .select('admin')
            .eq('uid', user.id)
            .single()
          
          setUserData(userData)
          setIsAdmin((userData as any)?.admin === true)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    async function fetchTestHistory() {
      setIsLoadingHistory(true)
      setHistoryError(null)
      try {
        const history = await getUserTestHistory()
        setTestHistory(Array.isArray(history) ? history : [])
      } catch (error) {
        console.error("Error fetching test history:", error)
        setHistoryError("Failed to load your test history.")
        toast({
          title: "Error",
          description: "Failed to load your test history.",
          variant: "destructive",
        })
        setTestHistory([])
      } finally {
        setIsLoadingHistory(false)
      }
    }

    fetchUserData()
    fetchTestHistory()
  }, [])

  const handleReviewTest = async (testId: string) => {
    setIsReviewLoading(true)
    try {
      const details = await getTestDetails(testId)

      if (!details || !details.test || !details.questions) {
         throw new Error('Incomplete test details received.');
      }

      const formattedResults: FormattedTestResults = {
        questions: details.questions.map((q: any) => ({
          ...q,
          options: q.options || [],
          documents: q.documents || [],
          rubric: q.rubric || {},
          isCorrect: q.is_correct,
          userAnswer: q.user_answer,
        })),
        score: details.test.score ?? 0,
        totalTime: details.test.total_time ?? 0,
        completedAt: details.test.completed_at ? new Date(details.test.completed_at) : new Date(),
      }

      setSelectedTestDetails(formattedResults)
      setTestReviewOpen(true)
    } catch (error) {
      console.error("Error fetching test details:", error)
      toast({
        title: "Error",
        description: `Failed to load test details. ${error instanceof Error ? error.message : ''}`,
        variant: "destructive",
      })
      setSelectedTestDetails(null)
    } finally {
      setIsReviewLoading(false)
    }
  }

  const statsContent = (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 ">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Stats</h1>
        <p className="text-muted-foreground">Track your progress and review past practice sessions</p>
      </div>

      <PracticeHistoryStats />

      <div className="grid gap-8 md:grid-cols-[300px,1fr]">
        <aside>
          <PracticeHistoryFilters activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
        </aside>
        <main>
          {isLoadingHistory ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
              ))}
            </div>
          ) : historyError ? (
            <p className="text-destructive">{historyError}</p>
          ) : (
            <PracticeHistoryList
              testHistory={testHistory}
              activeFilters={activeFilters}
              onReviewTest={handleReviewTest}
              isReviewLoading={isReviewLoading}
            />
          )}
        </main>
      </div>

      <TestReviewDialog
        open={testReviewOpen}
        onOpenChange={setTestReviewOpen}
        testResults={selectedTestDetails}
        onClose={() => setTestReviewOpen(false)}
      />
    </div>
  )

  return (
    <BetaGate featureName="Stats" className="h-screen" isAdmin={isAdmin}>
      {statsContent}
    </BetaGate>
  )
}

