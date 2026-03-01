"use client"
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { CourseCircles } from "@/components/course-circles"
import { DashboardStats } from "@/components/dashboard-stats"
import { UnitProgress } from "@/components/unit-progress"
import { CourseProvider } from "@/context/course-context"
import { SallyAIConsultant } from "@/components/sally"
import { QuickStatsAndGoals } from "@/components/goals"
import BetaGate from "@/components/Dashboard/BetaGate"

export default function DashboardPage() {
  const dashboardContent = (
    <CourseProvider>
      <div className="min-h-screen">
        <div className="container py-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold mb-2">Unlimited FRQs, DBQs, LEQS!</h1>
            <p className="text-gray-600">Your one stop shop for AP-style Practice and Progress Tracking, click on a class to begin!</p>
          </div>

          <CourseCircles />
          {/* <DashboardStats /> */}
            <div className="grid gap-6 lg:grid-cols-2">
              <QuickStatsAndGoals/>
            <SallyAIConsultant />
            </div>
        </div>
      </div>
    </CourseProvider>
  )

  return (
    <BetaGate featureName="Free Response" className="h-screen" isAdmin={true}>
      {dashboardContent}
    </BetaGate>
  )
}

