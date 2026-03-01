import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, Zap } from "lucide-react"
import { useEffect, useState } from 'react';
import { getTotalPracticeTime, updateTotalPracticeTime, getQuestionsAnswered, getCorrectQuestions, getQuestionsAnsweredThisWeek, getPracticeTimeThisWeek, getWeeklyAccuracyImprovement, getHoursImprovementThisWeek, getTestCountImprovementThisWeek, getTestsCompletedThisWeek} from "@/lib/supabase/test-results";
const weekDays = ["M", "T", "W", "T", "F", "S", "S"]
const currentStreak = [true, true, true, true, true, false, false] // Example streak data

export function QuickStatsAndGoals() {
  const [practiceTime, setPracticeTime] = useState<number | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState<number | null>(null);
  const [questionsCorrect, setQuestionsCorrect] = useState<number | null>(null);
  updateTotalPracticeTime();
  const [practiceTimeWeek, setPracticeTimeWeek] = useState<number | null>(null);
  const [questionsWeek, setQuestionsWeek] = useState<number | null>(null);
  const [accuracyImprovement, setAccuracyImprovement] = useState<number | null>(null);
  const [practiceHoursImprovement, setPracticeHoursImprovement] = useState<number | null>(null);
  const [testsCompletedWeek, setCompletedTests] = useState<number | null>(null);
  const [testsImprovementWeek, setTestsImprovementWeek] = useState<number | null>(null);
  useEffect(() => {
    getWeeklyAccuracyImprovement().then(setAccuracyImprovement);
    getTestsCompletedThisWeek().then(setCompletedTests);
    getTestCountImprovementThisWeek().then(setTestsImprovementWeek);
  }, []);  
  useEffect(() => {
    getPracticeTimeThisWeek().then(setPracticeTimeWeek);
    getQuestionsAnsweredThisWeek().then(setQuestionsWeek);
  }, []);
  useEffect(() => {
    const loadCorrect = async () => {
      const correct = await getCorrectQuestions();
      console.log("Fetched practice hours:", correct);
      setQuestionsCorrect(correct);
    };
  
    loadCorrect();
  }, []);  
  useEffect(() => {
    const loadTime = async () => {
      const hours = await getTotalPracticeTime();
      console.log("Fetched practice hours:", hours);
      setPracticeTime(hours);
    };
  
    loadTime();
  }, []);  
  useEffect(() => {
    const loadQuestions = async () => {
      const answered = await getQuestionsAnswered();
      console.log("Fetched questions answered:", answered);
      setQuestionsAnswered(answered)
    };
    loadQuestions();
  }, []); 
  useEffect(() => {
    getHoursImprovementThisWeek().then(setPracticeHoursImprovement);
  }, []);
  useEffect(() => {
    getHoursImprovementThisWeek().then(setPracticeHoursImprovement);
  }, []);
  return (
    <Card className="h-[calc(110vh-30.3rem)]">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>Quick Stats & Goals</CardTitle>
        <button className="bg-white text-black border border-black py-1 px-2 rounded hover:bg-gray-200 transition duration-300">
          Edit Goals
        </button>
      </div>
    </CardHeader>
      <CardContent className="space-y-8">
        {/* Daily Streak Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-2 bg-muted">
                <Zap className="h-4 w-4 text-yellow-500" />
              </div>
              <span className="text-sm font-medium">Daily Streak</span>
            </div>
            <span className="text-sm font-medium">5 days</span>
          </div>
          <div className="flex justify-between gap-2">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`flex flex-col items-center ${
                  currentStreak[index] ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`
                    w-10 h-10 flex items-center justify-center
                    relative
                    before:content-[''] before:absolute before:inset-0
                    before:bg-[${currentStreak[index] ? "#FFB800" : "#FFE7B3"}]
                    before:rounded-tl-[50%] before:rounded-tr-[50%] before:rounded-br-[50%]
                    before:rotate-[135deg]
                  `}
                >
                  <span className="relative z-10 text-white font-medium">{day}</span>
                </div>
                <span className="mt-1 text-xs">{currentStreak[index] ? "✓" : "–"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Study Goal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-2 bg-muted">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Weekly Study Goal</span>
            </div>
            <span className="text-sm font-medium">{practiceTimeWeek?.toFixed(2) || 0} hours / 5 hours</span>
          </div>
          <Progress value={practiceTimeWeek !== null ? (practiceTimeWeek/5) * 100 : 0} className="h-2" />
          <div className="flex items-center text-xs text-muted-foreground">
          {practiceHoursImprovement !== null ? (
            <span>
              {practiceHoursImprovement >= 0 ? '+' : ''}
              {practiceHoursImprovement.toFixed(1)} hours from last week
            </span>
          ) : (
            <span>No data from last week</span>
          )}
          </div>
        </div>

        {/* Practice Tests Completed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-2 bg-muted">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <span className="text-sm font-medium">Practice Tests Completed</span>
            </div>
            <span className="text-sm font-medium">{testsCompletedWeek} tests / 10 tests</span>
          </div>
          <Progress value={testsCompletedWeek !== null ? (testsCompletedWeek/10) * 100 : 0} className="h-2" />
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{testsImprovementWeek !== null ? testsImprovementWeek : 0} tests this week</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}