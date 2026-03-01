import { Card, CardContent } from "@/components/ui/card"
import { Clock, Brain, Target, Trophy, Users } from "lucide-react"
import { useEffect, useState } from 'react';
import { update } from "@intercom/messenger-js-sdk";
import { getTotalPracticeTime, updateTotalPracticeTime, getQuestionsAnswered, getCorrectQuestions, getQuestionsAnsweredThisWeek, getPracticeTimeThisWeek, getWeeklyAccuracyImprovement, getHoursImprovementThisWeek, getTestCountImprovementThisWeek, getTestsCompletedThisWeek} from "@/lib/supabase/test-results";
// Calculate total time from all tests

function getWeekStart(): Date | null {
  const now = new Date();
  const firstDayOfWeek = now.getDate() - now.getDay(); // Adjust based on week start preference (e.g., Sunday)
  return new Date(now.setDate(firstDayOfWeek));
}

export function PracticeHistoryStats() {
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
  const accuracy = ((questionsCorrect || 0) / (questionsAnswered || 1))*100;
  const stats = [
    {
      title: "Practice Hours",
      value: practiceTime !== null ? practiceTime.toFixed(1) : "Loading...",
      description: "Total study time",
      trend: `${practiceTimeWeek?.toFixed(1) || 0} this week`,
      icon: Clock,
    },
    {
      title: "Questions Answered",
      value: questionsAnswered !== null ? questionsAnswered.toFixed(0) : "Loading...",
      description: "Across all courses",
      trend: `${questionsWeek?.toFixed(0) || 0} this week`,
      icon: Brain,
    },
    {
      title: "Average Score",
      value: `${accuracy.toFixed(0)}%`,
      description: "On practice tests",
      trend: accuracyImprovement !== null ? 
         `${accuracyImprovement >= 0 ? '+' : ''}${accuracyImprovement.toFixed(0)}% improvement` : 
         "You haven't practiced enough yet!",
      icon: Target,
    },
    {
      title: "Achievements",
      value: "12",
      description: "Study milestones",
      trend: "2 new this week",
      icon: Trophy,
    },
  ]
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{stat.title}</span>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-bold">{stat.value}</span>
              <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
              <p className="text-sm text-green-600 mt-1">{stat.trend}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

