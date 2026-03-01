"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Target, Clock, BookOpen, TrendingUp } from "lucide-react"
import { getUserStreakInfo, updateDailyGoal, getTodayActivity } from "@/lib/supabase/test-results"

interface GoalManagementProps {
  onGoalUpdate?: () => void
}

export const GoalManagement = ({ onGoalUpdate }: GoalManagementProps) => {
  const [currentGoal, setCurrentGoal] = useState<number>(20)
  const [newGoal, setNewGoal] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [todayProgress, setTodayProgress] = useState<any>(null)

  useEffect(() => {
    loadGoalData()
  }, [])

  const loadGoalData = async () => {
    try {
      setIsLoading(true)
      const [userInfo, todayActivity] = await Promise.all([
        getUserStreakInfo(),
        getTodayActivity()
      ])
      
      setCurrentGoal(userInfo.daily_goal_questions || 20)
      setNewGoal((userInfo.daily_goal_questions || 20).toString())
      setTodayProgress(todayActivity)
    } catch (error) {
      console.error('Error loading goal data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveGoal = async () => {
    try {
      setIsSaving(true)
      const goalValue = parseInt(newGoal)
      
      if (goalValue > 0 && goalValue <= 100) {
        await updateDailyGoal(goalValue)
        setCurrentGoal(goalValue)
        onGoalUpdate?.()
      }
    } catch (error) {
      console.error('Error updating goal:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const progressPercentage = currentGoal > 0 ? Math.min(Math.round(((todayProgress?.questions_answered || 0) / currentGoal) * 100), 100) : 0

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Goal Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Today's Progress</h3>
            <Badge variant={todayProgress?.goal_achieved ? "default" : "secondary"}>
              {todayProgress?.goal_achieved ? "Goal Achieved!" : "In Progress"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {todayProgress?.questions_answered || 0}
              </div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {progressPercentage}%
              </div>
              <div className="text-sm text-gray-600">Goal Progress</div>
            </div>
          </div>
        </div>

        {/* Goal Setting */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Daily Question Goal</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label htmlFor="goal-input" className="text-sm text-gray-600">
                Questions per day
              </Label>
              <Input
                id="goal-input"
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                min="1"
                max="100"
                className="mt-1"
                placeholder="Enter daily goal"
              />
            </div>
            <Button 
              onClick={handleSaveGoal}
              disabled={isSaving || newGoal === currentGoal.toString()}
              className="mt-6"
            >
              {isSaving ? "Saving..." : "Update Goal"}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Recommended: 15-25 questions per day for consistent progress
          </p>
        </div>

        {/* Goal Suggestions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Quick Goal Presets</h3>
          <div className="grid grid-cols-3 gap-2">
            {[10, 20, 30].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setNewGoal(preset.toString())}
                className={newGoal === preset.toString() ? "border-blue-500 bg-blue-50" : ""}
              >
                {preset} questions
              </Button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                Practice Time: {Math.round((todayProgress?.practice_time_seconds || 0) / 60)} min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                Tests Completed: {todayProgress?.tests_completed || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                Accuracy: {todayProgress?.questions_answered > 0 
                  ? Math.round(((todayProgress?.questions_correct || 0) / todayProgress.questions_answered) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GoalManagement
